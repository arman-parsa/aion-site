import { expect, test } from "@playwright/test";

test.describe("people", () => {
  test("list/grid toggle is accessible", async ({ page }) => {
    await page.goto("/people");
    const list = page.getByRole("button", { name: "List" });
    const grid = page.getByRole("button", { name: "Grid" });
    await expect(page.getByRole("group", { name: "View" })).toBeVisible();
    await expect(list).toHaveAttribute("aria-pressed", "true");
    await grid.focus();
    await page.keyboard.press("Enter");
    await expect(grid).toHaveAttribute("aria-pressed", "true");
    await expect(list).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByRole("list", { name: "People" }).getByRole("link")).toHaveCount(2);
  });

  test("person page has valid Person JSON-LD", async ({ page }) => {
    await page.goto("/people/ali-parsa");
    const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
    const data = JSON.parse(raw ?? "{}");
    console.log(JSON.stringify(data, null, 2));
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Ali Parsa");
    expect(data.honorificPrefix).toBe("Prof.");
    expect(data.honorificSuffix).toBe("M.Phil, PhD, FRICS, FRSA");
    expect(data.jobTitle).toBe("Partner and Director");
    expect(data.alumniOf[0].name).toBe("University of Newcastle upon Tyne");
    expect(data.worksFor).toMatchObject({
      "@type": "ProfessionalService",
      name: "AION Consultancy",
    });
    // Placeholder values are never emitted.
    expect(JSON.stringify(data)).not.toMatch(/"\[[^"\]]+\]"/);
  });

  test("person page has no contact details", async ({ page }) => {
    await page.goto("/people/ali-parsa");
    await expect(page.locator("#main").locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(
      0,
    );
  });
});
