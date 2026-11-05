import { beforeEach, describe, expect, it, vi } from "vitest";
import { ui } from "@/content/en/ui";
import type { Email, Mailer } from "./email";
import { handleContact, type ContactDeps } from "./handle";
import { rateLimit, resetRateLimit } from "./rate-limit";
import { createContactSchema } from "./schema";

const schema = createContactSchema(ui.contact.errors);

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  organisation: "Analytical Engines",
  enquiryType: "research",
  message: "We'd like a country report on residential markets.",
  consent: "on",
};

function form(values: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(values)) f.set(k, v);
  return f;
}

function deps(overrides: Partial<ContactDeps> = {}) {
  const sent: Email[] = [];
  const mailer: Mailer = { send: vi.fn(async (e: Email) => void sent.push(e)) };
  const d: ContactDeps = {
    copy: ui.contact,
    mailer,
    verify: vi.fn(async () => true),
    rateLimit: () => ({ ok: true }),
    to: "office@example.com",
    from: "AION <noreply@example.com>",
    skipVerification: false,
    ...overrides,
  };
  return { d, sent };
}

describe("contact schema", () => {
  it("accepts a valid enquiry and trims", () => {
    const r = schema.safeParse({ ...valid, name: "  Ada  " });
    expect(r.success && r.data.name).toBe("Ada");
  });

  it.each([
    ["email", { email: "not-an-email" }, ui.contact.errors.email],
    ["name", { name: "" }, ui.contact.errors.name],
    ["message", { message: "short" }, ui.contact.errors.messageShort],
    ["enquiryType", { enquiryType: "nonsense" }, ui.contact.errors.enquiryType],
    ["consent", { consent: undefined }, ui.contact.errors.consent],
  ])("rejects bad %s", (field, patch, message) => {
    const r = schema.safeParse({ ...valid, ...patch });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues.find((i) => i.path[0] === field)?.message).toBe(message);
  });

  it("organisation is optional", () => {
    expect(schema.safeParse({ ...valid, organisation: undefined }).success).toBe(true);
  });
});

describe("handleContact", () => {
  it("sends a notification with reply-to and an acknowledgement", async () => {
    const { d, sent } = deps();
    const state = await handleContact(
      form({ ...valid, js: "1", "cf-turnstile-response": "tok" }),
      d,
    );
    expect(state.status).toBe("success");
    expect(d.verify).toHaveBeenCalledWith("tok");
    expect(sent).toHaveLength(2);
    expect(sent[0]).toMatchObject({ to: "office@example.com", replyTo: "ada@example.com" });
    expect(sent[0]!.subject).toContain("Research");
    expect(sent[0]!.text).toContain(valid.message);
    expect(sent[1]).toMatchObject({ to: "ada@example.com", subject: ui.contact.email_.ackSubject });
  });

  it("honeypot: pretends success, sends nothing", async () => {
    const { d, sent } = deps();
    const state = await handleContact(form({ ...valid, website: "http://spam" }), d);
    expect(state.status).toBe("success");
    expect(sent).toHaveLength(0);
  });

  it("returns field errors and echoes values (minus consent)", async () => {
    const { d, sent } = deps();
    const state = await handleContact(form({ ...valid, email: "nope" }), d);
    expect(state.status).toBe("error");
    expect(state.errors?.email).toBe(ui.contact.errors.email);
    expect(state.values?.name).toBe("Ada Lovelace");
    expect(state.values?.consent).toBeUndefined();
    expect(sent).toHaveLength(0);
  });

  it("rejects a failed Turnstile check", async () => {
    const { d, sent } = deps({ verify: vi.fn(async () => false) });
    const state = await handleContact(
      form({ ...valid, js: "1", "cf-turnstile-response": "bad" }),
      d,
    );
    expect(state).toMatchObject({ status: "error", message: ui.contact.errors.verification });
    expect(sent).toHaveLength(0);
  });

  it("rejects a JS submission with no token", async () => {
    const { d } = deps();
    expect((await handleContact(form({ ...valid, js: "1" }), d)).status).toBe("error");
  });

  it("accepts a no-JS submission but marks it unverified", async () => {
    const { d, sent } = deps();
    const state = await handleContact(form(valid), d);
    expect(state.status).toBe("success");
    expect(d.verify).not.toHaveBeenCalled();
    expect(sent[0]!.subject).toMatch(/^\[unverified\]/);
  });

  it("is rate limited", async () => {
    const { d, sent } = deps({ rateLimit: () => ({ ok: false }) });
    const state = await handleContact(form(valid), d);
    expect(state).toMatchObject({ status: "error", message: ui.contact.errors.rateLimited });
    expect(sent).toHaveLength(0);
  });

  it("fails clearly if the notification can't be sent", async () => {
    const { d } = deps({ mailer: { send: vi.fn(async () => Promise.reject(new Error("down"))) } });
    const state = await handleContact(form({ ...valid, js: "1", "cf-turnstile-response": "t" }), d);
    expect(state).toMatchObject({ status: "error", message: ui.contact.errors.server });
  });

  it("still succeeds if only the acknowledgement fails", async () => {
    let calls = 0;
    const mailer: Mailer = {
      send: vi.fn(async () => {
        if (++calls === 2) throw new Error("ack failed");
      }),
    };
    const { d } = deps({ mailer });
    expect(
      (await handleContact(form({ ...valid, js: "1", "cf-turnstile-response": "t" }), d)).status,
    ).toBe("success");
  });
});

describe("rateLimit", () => {
  beforeEach(() => resetRateLimit());

  it("allows 5 per window per key, then blocks, then recovers", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(rateLimit("1.2.3.4", { now: t + i }).ok).toBe(true);
    expect(rateLimit("1.2.3.4", { now: t + 10 }).ok).toBe(false);
    expect(rateLimit("5.6.7.8", { now: t + 10 }).ok).toBe(true);
    expect(rateLimit("1.2.3.4", { now: t + 11 * 60 * 1000 }).ok).toBe(true);
  });
});
