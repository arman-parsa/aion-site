import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

const valid = {
  RESEND_API_KEY: "re_123",
  TURNSTILE_SECRET_KEY: "secret",
  CONTACT_TO_EMAIL: "hello@example.com",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site",
  NEXT_PUBLIC_SITE_URL: "https://aionconsults.com",
};

describe("parseEnv", () => {
  it("accepts a complete server env", () => {
    expect(parseEnv(valid, { server: true }).CONTACT_TO_EMAIL).toBe(
      "hello@example.com",
    );
  });

  it("fails with a readable message listing bad keys", () => {
    expect(() =>
      parseEnv(
        { ...valid, CONTACT_TO_EMAIL: "nope", RESEND_API_KEY: undefined },
        { server: true },
      ),
    ).toThrow(/CONTACT_TO_EMAIL[\s\S]*|RESEND_API_KEY/);
  });

  it("on the client validates only public vars and blocks server keys", () => {
    const env = parseEnv(
      {
        NEXT_PUBLIC_SITE_URL: valid.NEXT_PUBLIC_SITE_URL,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: valid.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      },
      { server: false },
    );
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://aionconsults.com");
    expect(() => env.RESEND_API_KEY).toThrow(/server-only/);
  });
});
