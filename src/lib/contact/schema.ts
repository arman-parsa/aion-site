import { z } from "zod";

export const ENQUIRY_TYPES = [
  "executive-education",
  "research",
  "strategy-regeneration",
  "speaking",
  "other",
] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export type ContactErrorMessages = {
  name: string;
  email: string;
  enquiryType: string;
  messageShort: string;
  messageLong: string;
  consent: string;
};

/**
 * Shared by the client (instant feedback) and the server action (the
 * authority). Messages come from content so they can be translated.
 */
export function createContactSchema(m: ContactErrorMessages) {
  return z.object({
    name: z.string().trim().min(1, m.name).max(120, m.name),
    email: z.string().trim().pipe(z.email(m.email)).pipe(z.string().max(254, m.email)),
    organisation: z.string().trim().max(160).optional().default(""),
    enquiryType: z.enum(ENQUIRY_TYPES, { error: m.enquiryType }),
    message: z.string().trim().min(10, m.messageShort).max(5000, m.messageLong),
    consent: z.literal("on", { error: m.consent }),
  });
}

export type ContactInput = z.infer<ReturnType<typeof createContactSchema>>;
export type ContactField = keyof ContactInput;

export const CONTACT_FIELDS: ContactField[] = [
  "name",
  "email",
  "organisation",
  "enquiryType",
  "message",
  "consent",
];

/** FormData → plain object of the fields the schema knows about. */
export function formDataToObject(form: FormData): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const key of CONTACT_FIELDS) {
    const v = form.get(key);
    out[key] = typeof v === "string" ? v : undefined;
  }
  return out;
}

/** First error message per field. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as ContactField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  /** Echoed back so a no-JS submission with errors doesn't lose what was typed. */
  values?: Partial<Record<ContactField, string>>;
};

export const initialContactState: ContactState = { status: "idle" };
