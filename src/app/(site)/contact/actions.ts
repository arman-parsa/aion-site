"use server";

import { headers } from "next/headers";
import { env } from "@/env";
import { getUiStrings } from "@/lib/content";
import { logMailer, resendMailer } from "@/lib/contact/email";
import { handleContact } from "@/lib/contact/handle";
import { rateLimit } from "@/lib/contact/rate-limit";
import type { ContactState } from "@/lib/contact/schema";
import { verifyTurnstile } from "@/lib/contact/turnstile";

function isTestMode() {
  return env.CONTACT_TEST_MODE === "1" && process.env.VERCEL_ENV !== "production";
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  const ip = await clientIp();
  const test = isTestMode();
  return handleContact(form, {
    copy: getUiStrings().contact,
    mailer: test ? logMailer : resendMailer(env.RESEND_API_KEY),
    verify: (token) => verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip),
    rateLimit: () => rateLimit(ip, test ? { max: 1000 } : undefined),
    to: env.CONTACT_TO_EMAIL,
    from: env.CONTACT_FROM_EMAIL,
    skipVerification: test,
    log: (msg, err) => console.error(msg, err),
  });
}
