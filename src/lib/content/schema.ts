/**
 * Content model. Zod schemas are the single source of truth for content
 * shape; TypeScript types are inferred from them.
 *
 * The shapes deliberately mirror what a headless CMS (e.g. Sanity) would
 * store: documents with slugs, references by slug, and rich text as an array
 * of typed blocks. Swapping the local files for a CMS means producing the same
 * shapes in src/lib/content/source.ts.
 */
import { z } from "zod";

/* ------------------------------------------------------------ primitives */

export const LocaleSchema = z.enum(["en", "ar"]);
export type Locale = z.infer<typeof LocaleSchema>;

export const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase-kebab-case");

/**
 * A value awaiting real content, written in square brackets, e.g. "[+44 phone]".
 * Accepted so the site builds, but listed by `pnpm content:todo`.
 */
export const PlaceholderSchema = z.string().regex(/^\[.+\]$/, "placeholder must be [in brackets]");
export const isPlaceholder = (v: unknown): boolean => typeof v === "string" && /^\[.+\]$/.test(v);

const orPlaceholder = <T extends z.ZodType>(schema: T) => z.union([schema, PlaceholderSchema]);

/** Site-relative path ("/about") or absolute http(s) URL. */
export const HrefSchema = z
  .string()
  .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v) || /^(mailto|tel):/.test(v), {
    message: "href must start with /, http(s)://, mailto: or tel:",
  });

export const ImageSchema = z
  .object({
    /** Path under /public (e.g. "/images/people/ali-parsa.jpg") or remote URL. */
    src: z.string().min(1),
    /** Describe the image. Use "" only together with decorative: true. */
    alt: z.string(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    decorative: z.boolean().default(false),
    caption: z.string().optional(),
    credit: z.string().optional(),
    /** Placeholder art that must be replaced before launch. */
    placeholder: z.boolean().default(false),
  })
  .refine((img) => img.decorative || img.alt.trim().length > 0, {
    message: "alt text is required unless the image is decorative",
    path: ["alt"],
  });
export type Image = z.infer<typeof ImageSchema>;

export const SeoSchema = z.object({
  title: z.string().max(70).optional(),
  description: z.string().max(170).optional(),
  ogImage: ImageSchema.optional(),
  noindex: z.boolean().default(false),
});
export type Seo = z.infer<typeof SeoSchema>;

export const StatSchema = z.object({
  /** Numeric so it can be animated (CountUp). */
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string().min(1),
  /** Where the number comes from. Required: no unsourced stats on this site. */
  source: z.string().min(1),
});
export type Stat = z.infer<typeof StatSchema>;

/* ----------------------------------------------------------- body blocks */

const ParagraphBlock = z.object({ type: z.literal("paragraph"), text: z.string().min(1) });
const HeadingBlock = z.object({
  type: z.literal("heading"),
  text: z.string().min(1),
  level: z.union([z.literal(2), z.literal(3)]).default(2),
});
const QuoteBlock = z.object({
  type: z.literal("quote"),
  text: z.string().min(1),
  attribution: z.string().optional(),
  role: z.string().optional(),
});
const ImageBlock = z.object({
  type: z.literal("image"),
  image: ImageSchema,
  layout: z.enum(["inline", "wide", "full"]).default("inline"),
});
const ListBlock = z.object({
  type: z.literal("list"),
  style: z.enum(["bullet", "numbered"]).default("bullet"),
  items: z.array(z.string().min(1)).min(1),
});
const StatRowBlock = z.object({
  type: z.literal("stat-row"),
  stats: z.array(StatSchema).min(1).max(4),
});

export const BlockSchema = z.discriminatedUnion("type", [
  ParagraphBlock,
  HeadingBlock,
  QuoteBlock,
  ImageBlock,
  ListBlock,
  StatRowBlock,
]);
export type Block = z.infer<typeof BlockSchema>;
export const BodySchema = z.array(BlockSchema);
export type Body = z.infer<typeof BodySchema>;

/* ----------------------------------------------------------- site & nav */

export const FeatureFlagSchema = z.enum(["showWork", "showInsights"]);
export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;

export const NavItemSchema = z.object({
  label: z.string().min(1),
  href: HrefSchema,
  flag: FeatureFlagSchema.optional(),
});
export type NavItem = z.infer<typeof NavItemSchema>;

export const NavigationSchema = z.object({
  primary: z.array(NavItemSchema).min(1),
  legal: z.array(NavItemSchema),
});
export type Navigation = z.infer<typeof NavigationSchema>;

const TimeSchema = z.string().regex(/^\d{2}:\d{2}$/, "time must be HH:MM");

export const SiteSettingsSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  wordmark: z.string().min(1),
  lockup: z.string(),
  url: z.url(),
  flags: z.record(FeatureFlagSchema, z.boolean()),
  contact: z.object({
    email: orPlaceholder(z.email()),
    phone: z.string().min(1),
    /** E.164 for tel: links; empty until known. */
    phoneHref: z.union([z.string().regex(/^\+\d{7,15}$/), z.literal("")]),
    linkedin: z.union([z.url(), z.literal("")]),
  }),
  offices: z
    .array(z.object({ name: z.string().min(1), lines: z.array(z.string().min(1)).min(1) }))
    .min(1),
  company: z.object({ number: z.string().min(1), registeredOffice: z.string().min(1) }),
  /** Person slugs, for Organization JSON-LD `founder`. */
  founders: z.array(SlugSchema).default([]),
  /** Countries/regions served, for JSON-LD `areaServed`. */
  areaServed: z.array(z.string().min(1)).default([]),
  officeHours: z.object({
    days: z.array(z.number().int().min(0).max(6)).min(1),
    open: TimeSchema,
    close: TimeSchema,
    timeZone: z.string().min(1),
  }),
  seo: z.object({
    titleTemplate: z.string().includes("%s"),
    defaultTitle: z.string().min(1),
    description: z.string().min(1).max(170),
  }),
});
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

/* ------------------------------------------------------------- documents */

export const ServiceSchema = z.object({
  slug: SlugSchema,
  order: z.number().int(),
  title: z.string().min(1),
  /** One short line shown above/below the title. */
  kicker: z.string().min(1),
  summary: z.string().min(1),
  body: BodySchema,
  outcomes: z.array(z.string().min(1)).max(3),
  methods: z
    .array(z.object({ title: z.string().min(1), description: z.string().optional() }))
    .min(1),
  /** CaseStudy slugs. */
  relatedWork: z.array(SlugSchema).default([]),
  image: ImageSchema,
  seo: SeoSchema.default({ noindex: false }),
});
export type Service = z.infer<typeof ServiceSchema>;

export const CaseStudySchema = z.object({
  slug: SlugSchema,
  title: z.string().min(1),
  /** Clients may be anonymised: give a descriptor; add a name only with permission. */
  client: z.object({
    name: z.string().optional(),
    descriptor: z.string().min(1),
  }),
  sector: z.string().min(1),
  location: z.string().min(1),
  year: z.number().int().min(1980).max(2100),
  summary: z.string().min(1),
  challenge: BodySchema,
  approach: BodySchema,
  outcome: BodySchema,
  stats: z.array(StatSchema).default([]),
  images: z.array(ImageSchema).min(1),
  /** Service slugs. */
  services: z.array(SlugSchema).min(1),
  /** Testimonial id. */
  testimonial: z.string().optional(),
  /** Placeholder entries never render in production listings. */
  placeholder: z.boolean().default(false),
  seo: SeoSchema.default({ noindex: false }),
});
export type CaseStudy = z.infer<typeof CaseStudySchema>;

export const PersonSchema = z
  .object({
    slug: SlugSchema,
    /** e.g. "Prof." Kept separate so JSON-LD can use honorificPrefix. */
    prefix: z.string().optional(),
    name: z.string().min(1),
    /** Post-nominals, e.g. ["FRICS"], ["CBE"]. */
    honorifics: z.array(z.string().min(1)).default([]),
    role: z.string().min(1),
    shortBio: z.string().min(1),
    longBio: BodySchema,
    credentials: z.array(z.string().min(1)).default([]),
    affiliations: z
      .array(
        z.object({ name: z.string().min(1), role: z.string().optional(), url: z.url().optional() }),
      )
      .default([]),
    /** Institutions for Person JSON-LD alumniOf. */
    alumniOf: z.array(z.string().min(1)).default([]),
    portrait: ImageSchema,
    order: z.number().int(),
    featured: z.boolean().default(false),
    seo: SeoSchema.default({ noindex: false }),
  })
  .superRefine((p, ctx) => {
    // The old site repeated bios; the short bio must not reappear in the long one.
    p.longBio.forEach((b, i) => {
      if (b.type === "paragraph" && b.text.trim() === p.shortBio.trim())
        ctx.addIssue({
          code: "custom",
          path: ["longBio", i],
          message: "repeats shortBio; don't duplicate bio text",
        });
    });
  });
export type Person = z.infer<typeof PersonSchema>;

export const InsightSchema = z.object({
  slug: SlugSchema,
  title: z.string().min(1),
  kicker: z.string().optional(),
  summary: z.string().min(1),
  date: z.iso.date(),
  /** Person slugs. */
  authors: z.array(SlugSchema).min(1),
  body: BodySchema,
  image: ImageSchema.optional(),
  seo: SeoSchema.default({ noindex: false }),
});
export type Insight = z.infer<typeof InsightSchema>;

export const TestimonialSchema = z.object({
  id: SlugSchema,
  quote: z.string().min(1),
  attribution: z.string().min(1),
  role: z.string().optional(),
  org: z.string().optional(),
  language: LocaleSchema,
  /** Written permission to publish has been recorded. */
  approved: z.boolean(),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

/** Copy + SEO for a route that isn't itself a document (index pages, legal). */
export const PageSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  intro: z.string().optional(),
  /** Full-bleed hero (home page). */
  hero: z
    .object({
      image: ImageSchema,
      cta: z.object({ label: z.string().min(1), href: HrefSchema }),
    })
    .optional(),
  body: BodySchema.default([]),
  seo: SeoSchema.default({ noindex: false }),
});
export type Page = z.infer<typeof PageSchema>;

export const PageKeySchema = z.enum([
  "home",
  "expertise",
  "work",
  "people",
  "insights",
  "contact",
  "privacy",
  "cookies",
  "notFound",
  "error",
]);
export type PageKey = z.infer<typeof PageKeySchema>;
export const PagesSchema = z.record(PageKeySchema, PageSchema);

/* --------------------------------------------------- whole-locale bundle */

function uniqueBy<T>(key: (t: T) => string) {
  return (items: T[], ctx: z.RefinementCtx) => {
    const seen = new Set<string>();
    items.forEach((item, i) => {
      const k = key(item);
      if (seen.has(k)) ctx.addIssue({ code: "custom", message: `duplicate "${k}"`, path: [i] });
      seen.add(k);
    });
  };
}

export const LocaleContentSchema = z
  .object({
    site: SiteSettingsSchema,
    navigation: NavigationSchema,
    pages: PagesSchema,
    services: z.array(ServiceSchema).superRefine(uniqueBy((s) => s.slug)),
    caseStudies: z.array(CaseStudySchema).superRefine(uniqueBy((c) => c.slug)),
    people: z.array(PersonSchema).superRefine(uniqueBy((p) => p.slug)),
    insights: z.array(InsightSchema).superRefine(uniqueBy((i) => i.slug)),
    testimonials: z.array(TestimonialSchema).superRefine(uniqueBy((t) => t.id)),
  })
  .superRefine((c, ctx) => {
    // Referential integrity: every slug reference must resolve.
    const services = new Set(c.services.map((s) => s.slug));
    const work = new Set(c.caseStudies.map((w) => w.slug));
    const people = new Set(c.people.map((p) => p.slug));
    const testimonials = new Set(c.testimonials.map((t) => t.id));
    const check = (ok: boolean, path: (string | number)[], message: string) => {
      if (!ok) ctx.addIssue({ code: "custom", path, message });
    };
    c.services.forEach((s, i) =>
      s.relatedWork.forEach((slug, j) =>
        check(work.has(slug), ["services", i, "relatedWork", j], `unknown case study "${slug}"`),
      ),
    );
    c.caseStudies.forEach((w, i) => {
      w.services.forEach((slug, j) =>
        check(services.has(slug), ["caseStudies", i, "services", j], `unknown service "${slug}"`),
      );
      if (w.testimonial)
        check(
          testimonials.has(w.testimonial),
          ["caseStudies", i, "testimonial"],
          `unknown testimonial "${w.testimonial}"`,
        );
    });
    c.site.founders.forEach((slug, j) =>
      check(people.has(slug), ["site", "founders", j], `unknown person "${slug}"`),
    );
    c.insights.forEach((n, i) =>
      n.authors.forEach((slug, j) =>
        check(people.has(slug), ["insights", i, "authors", j], `unknown person "${slug}"`),
      ),
    );
  });

/** Author-side type: what content files write (defaults may be omitted). */
export type LocaleContentInput = z.input<typeof LocaleContentSchema>;
export type LocaleContent = z.infer<typeof LocaleContentSchema>;

/** Recursive tree of UI strings (labels, aria text). Not CMS-managed. */
export type StringTree = { readonly [key: string]: string | StringTree | readonly StringTree[] };
export const StringTreeSchema: z.ZodType<StringTree> = z.lazy(() =>
  z.record(z.string(), z.union([z.string(), StringTreeSchema, z.array(StringTreeSchema)])),
);

export type SiteSettingsInput = z.input<typeof SiteSettingsSchema>;
export type NavigationInput = z.input<typeof NavigationSchema>;
export type PagesInput = z.input<typeof PagesSchema>;
export type ServiceInput = z.input<typeof ServiceSchema>;
export type CaseStudyInput = z.input<typeof CaseStudySchema>;
export type PersonInput = z.input<typeof PersonSchema>;
export type InsightInput = z.input<typeof InsightSchema>;
export type TestimonialInput = z.input<typeof TestimonialSchema>;
export type ImageInput = z.input<typeof ImageSchema>;
