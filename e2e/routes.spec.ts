import { expect, test } from "@playwright/test";

const live = [
  "/",
  "/expertise",
  "/expertise/executive-education",
  "/expertise/research-and-market-intelligence",
  "/expertise/strategy-and-regeneration",
  "/people",
  "/people/ali-parsa",
  "/contact",
  "/privacy",
  "/cookies",
];

test.describe("routes", () => {
  for (const path of live) {
    test(`${path} renders with one h1`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
    });
  }

  for (const path of [
    "/work",
    "/work/placeholder-project",
    "/insights",
    "/expertise/nope",
    "/no-such-page",
  ]) {
    test(`${path} is a 404 in the house style`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page has moved on.");
      await expect(page.locator("#site-footer")).toBeVisible();
    });
  }
});
