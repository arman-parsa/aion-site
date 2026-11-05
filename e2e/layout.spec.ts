import { expect, test, type Page } from "@playwright/test";

const toggle = (page: Page) => page.getByRole("button", { name: /^(Menu|Close)$/ });
const menuLinks = (page: Page) => page.locator("#site-menu").locator("a[href]");

async function tabTo(page: Page, predicate: () => Promise<boolean>, max = 20) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    if (await predicate()) return;
  }
  throw new Error("target never received focus");
}

test.describe("persistent layout", () => {
  test("skip link is the first tab stop and targets main", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await expect(skip).toHaveAttribute("href", "#main");
  });

  test("keyboard-only menu walkthrough: open, trap, Esc", async ({ page }) => {
    await page.goto("/expertise");
    const btn = toggle(page);
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(btn).toHaveAttribute("aria-controls", "site-menu");

    // Closed menu is not reachable by keyboard.
    await expect(page.locator("#site-menu")).toHaveJSProperty("inert", true);

    await tabTo(page, () => btn.evaluate((el) => el === document.activeElement));
    await page.keyboard.press("Enter");

    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await expect(btn).toHaveText("Close");
    await expect(page.locator("#main")).toHaveJSProperty("inert", true);
    await expect(page.locator("#site-footer")).toHaveJSProperty("inert", true);

    const links = menuLinks(page);
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);
    await expect(links.first()).toBeFocused();
    await expect(links.first()).toContainText("(01)");

    // Tab through every menu link; the last Tab wraps back to the toggle.
    for (let i = 1; i < count; i++) {
      await page.keyboard.press("Tab");
      await expect(links.nth(i)).toBeFocused();
    }
    // Wraps to the header wordmark (link home), then the toggle, then the first link.
    const home = page.locator("[data-menu-home]");
    await page.keyboard.press("Tab");
    await expect(home).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(btn).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(links.first()).toBeFocused();

    // Shift+Tab from the first link goes back to the toggle, not the page.
    await page.keyboard.press("Shift+Tab");
    await expect(btn).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(btn).toBeFocused();
    await expect(page.locator("#main")).toHaveJSProperty("inert", false);
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  });

  test("wordmark links home while the menu is open", async ({ page }) => {
    await page.goto("/expertise");
    await toggle(page).click();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "true");
    await page.locator("[data-menu-home]").click();
    await page.waitForURL((url) => url.pathname === "/");
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("wordmark closes the menu when already on the home page", async ({ page }) => {
    await page.goto("/");
    await toggle(page).click();
    await page.locator("[data-menu-home]").click();
    await expect(toggle(page)).toHaveAttribute("aria-expanded", "false");
  });

  test("menu locks page scroll while open", async ({ page }) => {
    await page.goto("/");
    await toggle(page).click();
    await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
    await toggle(page).click();
    await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
  });

  test("home has no footer; other pages have legal links and back to top", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#site-footer")).toBeHidden();
    await page.goto("/expertise");
    const footer = page.locator("#site-footer");
    await expect(footer.getByRole("link", { name: "Privacy" })).toBeVisible();
    await expect(footer.getByRole("link", { name: /Back to top/ })).toHaveAttribute("href", "#top");
    await expect(footer).toContainText(`© AION Consultancy Ltd ${new Date().getFullYear()}`);
  });

  test("header is dark on paper pages after leaving the photo hero", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    const lightOnHome = await header.evaluate((h) => getComputedStyle(h).color);
    await page.getByRole("link", { name: /Explore/ }).click();
    await page.waitForURL("**/expertise");
    await expect(header).not.toHaveCSS("color", lightOnHome);
    await expect(header).toHaveCSS("color", "rgb(20, 20, 20)");
    await expect(page.locator("#site-footer")).toBeVisible();
  });

  test("one h1 per page", async ({ page }) => {
    for (const path of ["/", "/styleguide"]) {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
    }
  });
});
