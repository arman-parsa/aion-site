import type { z } from "zod";
import { en } from "@/content/en";
import { styleguide } from "@/content/en/styleguide";
import { ui } from "@/content/en/ui";
import {
  isPlaceholder,
  LocaleContentSchema,
  StringTreeSchema,
  type Locale,
  type LocaleContent,
} from "./schema";

/**
 * Loads and validates all content once, at module evaluation. Every page
 * imports the getters, so `next build` fails on the first invalid file with a
 * message listing each problem and where it is.
 *
 * To move to a CMS, replace `sources` with data fetched from the CMS; the
 * schemas and getters stay the same.
 */
const sources: Record<Locale, unknown> = {
  en,
  ar: undefined, // Arabic slots in here later.
};

const FILES: Record<string, string> = {
  site: "site.ts",
  navigation: "navigation.ts",
  pages: "pages.ts",
  services: "services.ts",
  caseStudies: "case-studies.ts",
  people: "people.ts",
  insights: "insights.ts",
  testimonials: "testimonials.ts",
};

export function formatContentError(locale: string, error: z.ZodError): string {
  const lines = error.issues.map((issue) => {
    const [top, ...rest] = issue.path;
    const file = typeof top === "string" ? FILES[top] : undefined;
    const where = [top, ...rest]
      .map((p, i) => (typeof p === "number" ? `[${p}]` : i === 0 ? String(p) : `.${String(p)}`))
      .join("");
    return `  • src/content/${locale}/${file ?? "index.ts"} → ${where || "(root)"}: ${issue.message}`;
  });
  return `\n✖ Content validation failed for locale "${locale}" (${lines.length} problem${lines.length === 1 ? "" : "s"}):\n${lines.join("\n")}\n`;
}

export class ContentValidationError extends Error {
  override name = "ContentValidationError";
}

export function parseLocale(locale: Locale, raw: unknown): LocaleContent {
  const result = LocaleContentSchema.safeParse(raw);
  if (!result.success) throw new ContentValidationError(formatContentError(locale, result.error));
  return result.data;
}

function parseStrings(name: string, raw: unknown) {
  const result = StringTreeSchema.safeParse(raw);
  if (!result.success) throw new ContentValidationError(formatContentError(name, result.error));
}

parseStrings("en/ui.ts", ui);
parseStrings("en/styleguide.ts", styleguide);

const store: Partial<Record<Locale, LocaleContent>> = {};
for (const [locale, raw] of Object.entries(sources) as [Locale, unknown][]) {
  if (raw !== undefined) store[locale] = parseLocale(locale, raw);
}

export function contentFor(locale: Locale): LocaleContent {
  const c = store[locale] ?? store.en;
  if (!c) throw new Error("No content loaded");
  return c;
}

/** Every placeholder string or image in a locale, with its path (for `pnpm content:todo`). */
export function findPlaceholders(locale: Locale = "en"): string[] {
  const out: string[] = [];
  const walk = (v: unknown, path: string) => {
    if (isPlaceholder(v)) out.push(`${path}: ${String(v)}`);
    else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
    else if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (o.placeholder === true && typeof o.src === "string")
        out.push(`${path}: placeholder image ${o.src}`);
      for (const [k, x] of Object.entries(o)) walk(x, path ? `${path}.${k}` : k);
    }
  };
  walk(contentFor(locale), "");
  return out;
}

export { styleguide, ui };
