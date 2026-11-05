"use client";

import Script from "next/script";
import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Arrow } from "@/components/ui/Arrow";
import {
  createContactSchema,
  fieldErrors,
  formDataToObject,
  initialContactState,
  type ContactErrorMessages,
  type ContactField,
  type ContactState,
} from "@/lib/contact/schema";
import { cn } from "@/lib/utils/cn";

type Copy = {
  formHeading: string;
  fields: Record<
    | "name"
    | "email"
    | "organisation"
    | "enquiryType"
    | "enquiryPlaceholder"
    | "message"
    | "consent"
    | "privacyLink"
    | "honeypot",
    string
  >;
  enquiryTypes: readonly { value: string; label: string }[];
  submit: string;
  sending: string;
  errors: ContactErrorMessages & { summary: string };
};

type Props = {
  action: (prev: ContactState, form: FormData) => Promise<ContactState>;
  copy: Copy;
  privacyHref: string;
  turnstileSiteKey?: string;
};

const noopSubscribe = () => () => {};

type TurnstileWindow = Window & { turnstile?: { reset: (widget?: string) => void } };

const inputClass =
  "mt-2xs block w-full rounded-none border-0 border-b border-solid border-ink bg-transparent py-2xs text-step-1 text-ink placeholder:text-stone focus:border-ink aria-invalid:border-accent";

/**
 * Contact form. Works without JS (plain form post to the server action);
 * with JS it validates with the shared Zod schema before sending, shows
 * pending state and moves focus to the first problem or the result.
 */
export function ContactForm({ action, copy, privacyHref, turnstileSiteKey }: Props) {
  const [state, formAction, pending] = useActionState(action, initialContactState);
  const [clientErrors, setClientErrors] = useState<Partial<Record<ContactField, string>> | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  // True once hydrated (false in the server HTML, so no-JS posts omit it).
  const hasJs = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const errors = clientErrors ?? state.errors ?? {};
  const values = state.status === "error" ? (state.values ?? {}) : {};

  // After a server response: reset on success, focus the result or first error.
  useEffect(() => {
    if (state.status === "idle") return;
    if (state.status === "success") formRef.current?.reset();
    // Turnstile tokens are single-use: get a fresh one for the next attempt.
    if (state.status === "error") (window as TurnstileWindow).turnstile?.reset();
    const firstInvalid = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
    (firstInvalid ?? statusRef.current)?.focus();
  }, [state]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const result = createContactSchema(copy.errors).safeParse(
      formDataToObject(new FormData(e.currentTarget)),
    );
    if (!result.success) {
      e.preventDefault();
      setClientErrors(fieldErrors(result.error));
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(),
      );
      return;
    }
    setClientErrors(null);
  }

  function clearError(field: ContactField) {
    if (clientErrors?.[field]) setClientErrors({ ...clientErrors, [field]: undefined });
  }

  const describedBy = (field: ContactField) => (errors[field] ? `${field}-error` : undefined);
  const invalid = (field: ContactField) => (errors[field] ? true : undefined);
  const errorText = (field: ContactField) =>
    errors[field] ? (
      <p
        id={`${field}-error`}
        className="mt-2xs label tracking-normal text-accent-text normal-case"
      >
        {errors[field]}
      </p>
    ) : null;

  const showSummary = clientErrors
    ? Object.values(clientErrors).some(Boolean)
    : state.status === "error";
  const statusMessage = clientErrors && showSummary ? copy.errors.summary : state.message;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      aria-labelledby="contact-form-heading"
    >
      <h2 id="contact-form-heading" className="label text-ink-2">
        {copy.formHeading}
      </h2>

      <p
        ref={statusRef}
        tabIndex={-1}
        role={state.status === "success" ? "status" : undefined}
        aria-live="polite"
        className={cn(
          "mt-s text-step-1 outline-none empty:hidden",
          state.status === "success" && !clientErrors ? "text-ink" : "text-accent-text",
        )}
      >
        {(showSummary || state.status === "success") && statusMessage}
      </p>

      <div className="mt-l grid gap-x-l gap-y-m md:grid-cols-2">
        <div>
          <label htmlFor="name" className="label text-ink-2">
            {copy.fields.name}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            defaultValue={values.name}
            aria-invalid={invalid("name")}
            aria-describedby={describedBy("name")}
            onChange={() => clearError("name")}
            className={inputClass}
          />
          {errorText("name")}
        </div>

        <div>
          <label htmlFor="email" className="label text-ink-2">
            {copy.fields.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={values.email}
            aria-invalid={invalid("email")}
            aria-describedby={describedBy("email")}
            onChange={() => clearError("email")}
            className={inputClass}
          />
          {errorText("email")}
        </div>

        <div>
          <label htmlFor="organisation" className="label text-ink-2">
            {copy.fields.organisation}
          </label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            maxLength={160}
            defaultValue={values.organisation}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="enquiryType" className="label text-ink-2">
            {copy.fields.enquiryType}
          </label>
          <div className="relative">
            <select
              id="enquiryType"
              name="enquiryType"
              required
              defaultValue={values.enquiryType ?? ""}
              aria-invalid={invalid("enquiryType")}
              aria-describedby={describedBy("enquiryType")}
              onChange={() => clearError("enquiryType")}
              className={cn(inputClass, "cursor-pointer appearance-none")}
            >
              <option value="" disabled>
                {copy.fields.enquiryPlaceholder}
              </option>
              {copy.enquiryTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute end-0 bottom-2xs text-step-0">
              ↓
            </span>
          </div>
          {errorText("enquiryType")}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="message" className="label text-ink-2">
            {copy.fields.message}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={3}
            maxLength={5000}
            defaultValue={values.message}
            aria-invalid={invalid("message")}
            aria-describedby={describedBy("message")}
            onChange={() => clearError("message")}
            className={cn(inputClass, "resize-y")}
          />
          {errorText("message")}
        </div>

        <div className="md:col-span-2">
          <div className="flex items-start gap-s">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              required
              aria-invalid={invalid("consent")}
              aria-describedby={describedBy("consent")}
              onChange={() => clearError("consent")}
              className="mt-3xs size-s shrink-0 cursor-pointer accent-accent"
            />
            <label htmlFor="consent" className="text-step--1 text-ink-2">
              {copy.fields.consent}
            </label>
          </div>
          {errorText("consent")}
          <a href={privacyHref} className="mt-s inline-block link-underline-rest label text-ink">
            {copy.fields.privacyLink}
          </a>
        </div>

        {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
        <div aria-hidden className="hidden">
          <label>
            {copy.fields.honeypot}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {hasJs && <input type="hidden" name="js" value="1" />}

        {turnstileSiteKey && (
          <>
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="afterInteractive"
              async
            />
            <div
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
              data-theme="light"
              data-appearance="interaction-only"
            />
          </>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={pending}
            aria-disabled={pending}
            className="group inline-flex cursor-pointer items-center gap-s border border-solid border-ink bg-ink px-l py-s label leading-none text-paper transition-colors duration-base ease-out-expo hover:bg-transparent hover:text-ink focus-visible:bg-transparent focus-visible:text-ink disabled:cursor-wait disabled:opacity-60"
          >
            <span>{pending ? copy.sending : copy.submit}</span>
            <Arrow />
          </button>
        </div>
      </div>
    </form>
  );
}
