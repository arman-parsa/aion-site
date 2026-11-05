import { expect, test } from "@playwright/test";

test.describe("SEO", () => {
  test("legacy WordPress URLs redirect permanently", async ({ request }) => {
    for (const [from, to] of [
      ["/team-members", "/people"],
      ["/team", "/people"],
      ["/team/ali-parsa", "/people"],
      ["/contact-us", "/contact"],
      ["/feed", "/"],
    ]) {
      const res = await request.get(from!, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      expect(new URL(res.headers()["location"]!, "http://x").pathname).toBe(to);
    }
  });

  test("WordPress system paths are gone (410)", async ({ request }) => {
    for (const path of ["/wp-login.php", "/wp-admin", "/xmlrpc.php", "/wp-json/wp/v2/users"]) {
      expect((await request.get(path, { maxRedirects: 0 })).status(), path).toBe(410);
    }
  });

  test("robots and sitemap exclude the styleguide", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /styleguide");
    expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/expertise/executive-education</loc>");
    expect(sitemap).toContain("/people/ali-parsa</loc>");
    expect(sitemap).not.toContain("/styleguide");
    expect(sitemap).not.toContain("placeholder-project");
  });

  test("pages have title template, canonical, OG and Twitter tags", async ({ page }) => {
    await page.goto("/expertise/executive-education");
    await expect(page).toHaveTitle("Executive Education — AION Consultancy");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/expertise\/executive-education$/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });

  test("OG image renders as a PNG", async ({ page, request }) => {
    await page.goto("/people/ali-parsa");
    const src = await page.locator('meta[property="og:image"]').getAttribute("content");
    const res = await request.get(new URL(src!).pathname);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  });

  test("home page has Organization + ProfessionalService JSON-LD", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("AION Consultancy");
    const data = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}",
    );
    expect(data["@type"]).toEqual(["Organization", "ProfessionalService"]);
    expect(data.knowsAbout).toContain("Executive Education");
    expect(JSON.stringify(data)).not.toMatch(/\[.+?\]"/);
  });

  test("icons and manifest are served", async ({ request }) => {
    for (const path of ["/icon.svg", "/favicon.ico", "/apple-icon.png", "/manifest.webmanifest"]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });
});
