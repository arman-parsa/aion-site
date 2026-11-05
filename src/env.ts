import { z } from "zod";

/**
 * Environment variables, validated with Zod.
 *
 * `next.config.ts` imports this file, so a missing or malformed variable fails
 * `next build` (and `next dev`) immediately rather than at runtime.
 *
 * - Server vars are only readable on the server. Accessing one from a client
 *   component throws.
 * - `NEXT_PUBLIC_*` vars must be referenced literally (`process.env.NEXT_PUBLIC_X`)
 *   so Next.js can inline them into the client bundle.
 * - Set `SKIP_ENV_VALIDATION=1` to bypass validation (tooling that doesn't
 *   need real values, e.g. lint jobs).
 */

export const serverSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  CONTACT_TO_EMAIL: z.email(),
});

export const clientSchema = z.object({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.url(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
export type Env = ServerEnv & ClientEnv;

type RawEnv = Record<keyof Env, string | undefined>;

const isServer = typeof window === "undefined";

function readRaw(): RawEnv {
  return {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };
}

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
}

export function parseEnv(
  raw: Partial<RawEnv>,
  options: { server: boolean } = { server: isServer },
): Env {
  const schema = options.server ? serverSchema.extend(clientSchema.shape) : clientSchema;
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new Error(`❌ Invalid environment variables:\n${formatIssues(result.error)}`);
  }
  const data = result.data as Env;
  if (options.server) return data;

  // On the client, guard server-only keys so mistakes fail loudly.
  return new Proxy(data, {
    get(target, prop: string) {
      if (prop in serverSchema.shape) {
        throw new Error(`❌ Attempted to access server-only env var "${prop}" on the client.`);
      }
      return target[prop as keyof Env];
    },
  });
}

const skip = !!process.env.SKIP_ENV_VALIDATION;

export const env: Env = skip ? (readRaw() as Env) : parseEnv(readRaw());
