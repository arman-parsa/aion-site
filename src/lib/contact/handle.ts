import type { Mailer } from "./email";
import {
  createContactSchema,
  fieldErrors,
  formDataToObject,
  type ContactErrorMessages,
  type ContactState,
} from "./schema";

export type ContactCopy = {
  errors: ContactErrorMessages & {
    summary: string;
    verification: string;
    rateLimited: string;
    server: string;
  };
  success: string;
  enquiryTypes: readonly { value: string; label: string }[];
  email_: {
    notifySubject: string;
    ackSubject: string;
    ackGreeting: string;
    ackBody: string;
    ackSignoff: string;
  };
};

export type ContactDeps = {
  copy: ContactCopy;
  mailer: Mailer;
  /** Returns true if the Turnstile token is valid. */
  verify: (token: string) => Promise<boolean>;
  rateLimit: () => { ok: boolean };
  to: string;
  from: string;
  /** Skip Turnstile entirely (test mode). */
  skipVerification: boolean;
  log?: (msg: string, err?: unknown) => void;
};

/** Honeypot field name. Real people never see or fill it. */
export const HONEYPOT = "website";
/** Set to "1" by the client script; absent on no-JS submissions. */
export const JS_FLAG = "js";
export const TURNSTILE_FIELD = "cf-turnstile-response";

/**
 * The contact pipeline, independent of Next so it can be unit tested:
 * honeypot → rate limit → validate → Turnstile → send notification → ack.
 *
 * No-JS visitors can't run Turnstile; their messages are accepted but marked
 * "[unverified]" in the subject (honeypot and rate limit still apply).
 */
export async function handleContact(form: FormData, deps: ContactDeps): Promise<ContactState> {
  const { copy } = deps;
  const raw = formDataToObject(form);
  const values = { ...raw, consent: undefined };

  // Bots that fill the honeypot get a fake success and nothing is sent.
  const honeypot = form.get(HONEYPOT);
  if (typeof honeypot === "string" && honeypot.trim() !== "")
    return { status: "success", message: copy.success };

  if (!deps.rateLimit().ok) return { status: "error", message: copy.errors.rateLimited, values };

  const parsed = createContactSchema(copy.errors).safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: copy.errors.summary,
      errors: fieldErrors(parsed.error),
      values,
    };
  }

  const token = form.get(TURNSTILE_FIELD);
  const hasJs = form.get(JS_FLAG) === "1";
  let unverified = false;
  if (!deps.skipVerification) {
    if (typeof token === "string" && token) {
      if (!(await deps.verify(token)))
        return { status: "error", message: copy.errors.verification, values };
    } else if (hasJs) {
      return { status: "error", message: copy.errors.verification, values };
    } else {
      unverified = true;
    }
  }

  const d = parsed.data;
  const typeLabel =
    copy.enquiryTypes.find((t) => t.value === d.enquiryType)?.label ?? d.enquiryType;

  try {
    await deps.mailer.send({
      from: deps.from,
      to: deps.to,
      replyTo: d.email,
      subject: `${unverified ? "[unverified] " : ""}${copy.email_.notifySubject}: ${typeLabel} — ${d.name}`,
      text: [
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        `Organisation: ${d.organisation || "—"}`,
        `Enquiry type: ${typeLabel}`,
        "",
        d.message,
      ].join("\n"),
    });
  } catch (err) {
    deps.log?.("contact: notification failed", err);
    return { status: "error", message: copy.errors.server, values };
  }

  // The acknowledgement is a courtesy: never fail the submission because of it.
  try {
    await deps.mailer.send({
      from: deps.from,
      to: d.email,
      replyTo: deps.to,
      subject: copy.email_.ackSubject,
      text: [
        `${copy.email_.ackGreeting} ${d.name},`,
        "",
        copy.email_.ackBody,
        "",
        copy.email_.ackSignoff,
      ].join("\n"),
    });
  } catch (err) {
    deps.log?.("contact: acknowledgement failed", err);
  }

  return { status: "success", message: copy.success };
}
