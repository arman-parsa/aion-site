# Content model

Content lives in `src/content/<locale>/*.ts`, typed with `satisfies` against the
Zod schemas in `src/lib/content/schema.ts`. `src/lib/content/load.ts` validates
the whole locale once when the site builds; any problem fails `next build` with
the file and field named, for example:

```
✖ Content validation failed for locale "en" (2 problems):
  • src/content/en/services.ts → services[2].slug: slug must be lowercase-kebab-case
  • src/content/en/services.ts → services[0].relatedWork[0]: unknown case study "a-project-that-does-not-exist"
```

Pages read content only through the getters in `src/lib/content/index.ts`
(`getServices()`, `getPerson(slug)`, …). Every getter takes `locale` (default
`"en"`). To move to a CMS (e.g. Sanity), replace the `sources` object in
`load.ts` with CMS data of the same shape.

`[Bracketed]` strings are placeholders awaiting real content. Run
`pnpm content:todo` to list them all.

## Documents

| Schema | Key fields | References |
|---|---|---|
| **SiteSettings** | name, legalName, wordmark, lockup, url, flags (`showWork`, `showInsights`), contact (email, phone, phoneHref, linkedin), offices[], company (number, registeredOffice), officeHours, seo (titleTemplate, defaultTitle, description) | — |
| **Navigation** | primary[] and legal[] of NavItem (label, href, flag?) | flag → SiteSettings.flags |
| **Page** (per key: home, expertise, work, people, insights, contact, privacy, cookies, notFound, error) | eyebrow?, title, intro?, body, seo | — |
| **Service** | slug, order, title, kicker, summary, body, outcomes[≤3], methods[] (title, description?), relatedWork[], image, seo | relatedWork → CaseStudy.slug |
| **CaseStudy** | slug, title, client (name?, descriptor), sector, location, year, summary, challenge, approach, outcome, stats[], images[≥1], services[≥1], testimonial?, placeholder, seo | services → Service.slug; testimonial → Testimonial.id |
| **Person** | slug, prefix?, name, honorifics[], role, shortBio, longBio, credentials[], affiliations[] (name, role?, url?), alumniOf[], portrait, order, featured, seo | — |
| **Insight** (for later) | slug, title, kicker?, summary, date, authors[], body, image?, seo | authors → Person.slug |
| **Testimonial** | id, quote, attribution, role?, org?, language (en/ar), approved | — |

## Shared types

| Schema | Fields | Notes |
|---|---|---|
| **Image** | src, alt, width, height, decorative, caption?, credit?, placeholder | alt required unless decorative |
| **Seo** (page SEO) | title? (≤70), description? (≤170), ogImage?, noindex | |
| **Stat** | value (number), prefix?, suffix?, label, source | source required: no unsourced numbers |
| **Body** | array of Block | maps 1:1 to CMS portable-text style blocks |

## Body blocks

| `type` | Fields |
|---|---|
| `paragraph` | text |
| `heading` | text, level (2, 3) |
| `quote` | text, attribution?, role? |
| `image` | image, layout (inline, wide, full) |
| `list` | style (bullet, numbered), items[] |
| `stat-row` | stats[] (1–4 Stat) |

## Integrity checks

- Slugs are kebab-case and unique per collection.
- Every reference (relatedWork, services, testimonial, authors) must resolve.
- Placeholder case studies are excluded from listings and 404 in production.
