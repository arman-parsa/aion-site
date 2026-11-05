/**
 * Content getters: the ONLY way pages and components read content.
 * Every getter takes a locale (default "en") so Arabic can slot in later.
 */
import { contentFor, styleguide, ui } from "./load";
import type { CaseStudy, Insight, Locale, Page, PageKey, Person, Service } from "./schema";

export type * from "./schema";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/* ---- preview ---- */

/**
 * Content preview: set CONTENT_PREVIEW=1 (e.g. on Vercel *Preview* deployments
 * only) to review feature-flagged sections and placeholder entries. Ignored
 * on production deployments.
 */
export function isContentPreview(): boolean {
  return process.env.CONTENT_PREVIEW === "1" && process.env.VERCEL_ENV !== "production";
}

/* ---- site ---- */

export function getSiteSettings(locale: Locale = "en") {
  return contentFor(locale).site;
}

export function isFeatureOn(flag: "showWork" | "showInsights", locale: Locale = "en"): boolean {
  return (contentFor(locale).site.flags[flag] ?? false) || isContentPreview();
}

/** Navigation with feature-flagged items removed. */
export function getNavigation(locale: Locale = "en") {
  const { navigation } = contentFor(locale);
  const on = (item: { flag?: "showWork" | "showInsights" }) =>
    !item.flag || isFeatureOn(item.flag, locale);
  return { primary: navigation.primary.filter(on), legal: navigation.legal.filter(on) };
}

export function getPage(key: PageKey, locale: Locale = "en"): Page {
  const page = contentFor(locale).pages[key];
  if (!page) throw new Error(`Missing page content "${key}"`);
  return page;
}

/* ---- services ---- */

export function getServices(locale: Locale = "en"): Service[] {
  return [...contentFor(locale).services].sort(byOrder);
}

export function getService(slug: string, locale: Locale = "en"): Service | undefined {
  return contentFor(locale).services.find((s) => s.slug === slug);
}

/** The service after this one, wrapping to the first. */
export function getNextService(slug: string, locale: Locale = "en"): Service | undefined {
  const list = getServices(locale);
  const i = list.findIndex((s) => s.slug === slug);
  return i === -1 ? undefined : list[(i + 1) % list.length];
}

/* ---- case studies ---- */

/** Case studies. Placeholders are excluded unless `includePlaceholders` is set. */
export function getCaseStudies(
  { includePlaceholders = false }: { includePlaceholders?: boolean } = {},
  locale: Locale = "en",
): CaseStudy[] {
  return contentFor(locale).caseStudies.filter(
    (c) => includePlaceholders || isContentPreview() || !c.placeholder,
  );
}

/** Case studies tagged with a service, or all when no service is given. */
export function getCaseStudiesByService(
  service: string | undefined,
  locale: Locale = "en",
): CaseStudy[] {
  const all = getCaseStudies({}, locale);
  return service ? all.filter((c) => c.services.includes(service)) : all;
}

/** The project after this one in the listing, wrapping around. */
export function getNextCaseStudy(slug: string, locale: Locale = "en"): CaseStudy | undefined {
  const list = getCaseStudies({}, locale);
  const i = list.findIndex((c) => c.slug === slug);
  return i === -1 || list.length < 2 ? undefined : list[(i + 1) % list.length];
}

export function getTestimonial(id: string, locale: Locale = "en") {
  return contentFor(locale).testimonials.find((t) => t.id === id && t.approved);
}

export function getCaseStudy(slug: string, locale: Locale = "en"): CaseStudy | undefined {
  return contentFor(locale).caseStudies.find((c) => c.slug === slug);
}

export function getCaseStudiesForService(serviceSlug: string, locale: Locale = "en"): CaseStudy[] {
  const service = getService(serviceSlug, locale);
  const related = new Set(service?.relatedWork ?? []);
  return getCaseStudies({}, locale).filter(
    (c) => related.has(c.slug) || c.services.includes(serviceSlug),
  );
}

/* ---- people ---- */

export function getPeople(locale: Locale = "en"): Person[] {
  return [...contentFor(locale).people].sort(byOrder);
}

export function getPerson(slug: string, locale: Locale = "en"): Person | undefined {
  return contentFor(locale).people.find((p) => p.slug === slug);
}

/** "Prof. Ali Parsa" */
export function displayName(person: Pick<Person, "prefix" | "name">): string {
  return [person.prefix, person.name].filter(Boolean).join(" ");
}

/* ---- insights & testimonials ---- */

export function getInsights(locale: Locale = "en"): Insight[] {
  return [...contentFor(locale).insights].sort((a, b) => b.date.localeCompare(a.date));
}

export function getInsight(slug: string, locale: Locale = "en"): Insight | undefined {
  return contentFor(locale).insights.find((i) => i.slug === slug);
}

export function getTestimonials(locale: Locale = "en") {
  return contentFor(locale).testimonials.filter((t) => t.approved && t.language === locale);
}

/* ---- UI strings ---- */

export function getUiStrings(_locale: Locale = "en") {
  return ui;
}

export function getStyleguide() {
  return styleguide;
}
