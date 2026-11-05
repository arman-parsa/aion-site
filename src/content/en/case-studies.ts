import type { CaseStudyInput } from "@/lib/content/schema";
import { placeholderLandscape } from "./images";

/**
 * Case studies. No real projects have been supplied yet, so there is exactly
 * one clearly marked PLACEHOLDER to exercise the templates. It is flagged
 * `placeholder: true` and noindex; /work stays hidden (site.flags.showWork).
 * Do NOT add clients, numbers or outcomes that AION hasn't confirmed.
 */
export const caseStudies = [
  {
    slug: "placeholder-project",
    title: "[Placeholder project title]",
    client: { descriptor: "[Anonymised client descriptor, e.g. sector and region]" },
    sector: "[Sector]",
    location: "[Location]",
    year: 2026,
    summary: "[One-line summary of the project]",
    challenge: [{ type: "paragraph", text: "[The challenge]" }],
    approach: [{ type: "paragraph", text: "[Our approach]" }],
    outcome: [{ type: "paragraph", text: "[The outcome]" }],
    stats: [],
    images: [placeholderLandscape("Placeholder project image")],
    services: ["research-and-market-intelligence"],
    placeholder: true,
    seo: { noindex: true },
  },
] satisfies CaseStudyInput[];
