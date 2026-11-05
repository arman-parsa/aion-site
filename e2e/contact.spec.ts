import { expect, test } from "@playwright/test";

/** Runs against `next start` with CONTACT_TEST_MODE=1: emails are logged, Turnstile skipped. */
test.describe("contact form", () => {
  test("shows accessible validation errors and focuses the first one", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();

    const name = page.getByLabel("Name", { exact: true });
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(name).toHaveAttribute("aria-describedby", "name-error");
    await expect(page.locator("#name-error")).toHaveText("Please tell us your name.");
    await expect(page.locator("#consent-error")).toBeVisible();
    await expect(name).toBeFocused();

    await page.getByLabel("Email", { exact: true }).fill("not-an-email");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.locator("#email-error")).toHaveText("Please enter a valid email address.");
  });

  test("happy path sends and confirms", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name", { exact: true }).fill("Test Person");
    await page.getByLabel("Email", { exact: true }).fill("test@example.com");
    await page.getByLabel("Organisation (optional)").fill("Example Ltd");
    await page.getByLabel("Enquiry type").selectOption("research");
    await page
      .getByLabel("Message", { exact: true })
      .fill("We would like to discuss a country report for our board.");
    await page.getByLabel(/I agree that AION Consultancy/).check();
    await page.getByRole("button", { name: "Send message" }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("Your message has been sent");
    await expect(status).toBeFocused();
    await expect(page.getByLabel("Name", { exact: true })).toHaveValue("");
  });

  test("works without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/contact");
    await page.getByLabel("Name", { exact: true }).fill("No JS");
    await page.getByLabel("Email", { exact: true }).fill("nojs@example.com");
    await page.getByLabel("Enquiry type").selectOption("other");
    await page
      .getByLabel("Message", { exact: true })
      .fill("Sent from a browser with scripts turned off.");
    await page.getByLabel(/I agree that AION Consultancy/).check();
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Your message has been sent")).toBeVisible();
    await context.close();
  });
});
