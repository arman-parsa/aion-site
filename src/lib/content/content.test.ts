import { describe, expect, it } from "vitest";
import { en } from "@/content/en";
import { contentFor, findPlaceholders, formatContentError, parseLocale } from "./load";
import { LocaleContentSchema } from "./schema";
import { getNavigation, getNextService, getPerson, getServices } from ".";

describe("content", () => {
  it("all English content validates", () => {
    expect(() => parseLocale("en", en)).not.toThrow();
    expect(contentFor("en").services).toHaveLength(3);
  });

  it("reports bad content with file and path", () => {
    const broken = structuredClone(en) as unknown as { services: { image: { alt: string } }[] };
    broken.services[1]!.image.alt = "";
    expect(() => parseLocale("en", broken)).toThrow(
      /src\/content\/en\/services\.ts → services\[1\]\.image\.alt: alt text is required/,
    );
  });

  it("catches broken references", () => {
    const broken = structuredClone(en) as unknown as { services: { relatedWork: string[] }[] };
    broken.services[0]!.relatedWork = ["does-not-exist"];
    const result = LocaleContentSchema.safeParse(broken);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatContentError("en", result.error)).toMatch(/unknown case study "does-not-exist"/);
    }
  });

  it("hides flagged nav items", () => {
    const labels = getNavigation().primary.map((i) => i.label);
    expect(labels).not.toContain("Work");
    expect(labels).not.toContain("Insights");
  });

  it("getters", () => {
    expect(getServices().map((s) => s.order)).toEqual([1, 2, 3]);
    expect(getNextService("strategy-and-regeneration")?.slug).toBe("executive-education");
    expect(getPerson("ali-parsa")?.honorifics).toContain("FRICS");
  });
});

describe("content:todo", () => {
  it("lists placeholders", () => {
    const items = findPlaceholders("en");
    if (process.env.CONTENT_TODO)
      console.log(`\n${items.join("\n")}\n\n${items.length} placeholder(s)`);
    expect(Array.isArray(items)).toBe(true);
  });
});
