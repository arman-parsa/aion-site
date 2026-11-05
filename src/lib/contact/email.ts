import { Resend } from "resend";

export type Email = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
};

export interface Mailer {
  send(email: Email): Promise<void>;
}

/** Sends through Resend. Throws on failure. */
export function resendMailer(apiKey: string): Mailer {
  const client = new Resend(apiKey);
  return {
    async send(email) {
      const { error } = await client.emails.send({
        from: email.from,
        to: email.to,
        replyTo: email.replyTo,
        subject: email.subject,
        text: email.text,
      });
      if (error) throw new Error(`Resend: ${error.message}`);
    },
  };
}

/** Test mode: logs instead of sending, and keeps an in-memory outbox. */
export const outbox: Email[] = [];
export const logMailer: Mailer = {
  async send(email) {
    outbox.push(email);
    console.info(`[contact:test-mode] email to ${email.to}: ${email.subject}`);
  },
};
