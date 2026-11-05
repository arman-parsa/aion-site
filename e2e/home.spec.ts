import { expect, test } from "@playwright/test";

test("home renders placeholder with one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
});

test("security headers are set", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("challenges.cloudflare.com");
  expect(h["strict-transport-security"]).toContain("max-age=");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["permissions-policy"]).toContain("camera=()");
});
