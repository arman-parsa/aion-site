import type { PagesInput } from "@/lib/content/schema";

/**
 * Copy for index and utility pages. DRAFT lines come from docs/voice.md and
 * are awaiting sign-off.
 */
export const pages = {
  home: {
    title: "AION — rebuild in progress",
    seo: { title: "AION Consultancy" },
  },
  expertise: {
    eyebrow: "Expertise",
    // DRAFT (docs/voice.md)
    title: "Evidence for the long view.",
    intro:
      "We help governments and investors understand the places they're shaping, and we train the people who'll shape them next.",
    seo: {
      title: "Expertise",
      description:
        "Executive education, research and market intelligence, and strategy and regeneration from AION Consultancy.",
    },
  },
  work: {
    eyebrow: "Work",
    title: "Selected work.",
    intro: "[Introduction to selected projects]",
    seo: { title: "Work", noindex: true },
  },
  people: {
    eyebrow: "People",
    title: "[People page headline]",
    intro: "[Introduction to the collective: an academic-practitioner network, not a big firm]",
    seo: { title: "People", description: "The people behind AION Consultancy." },
  },
  insights: {
    eyebrow: "Insights",
    title: "Insights.",
    seo: { title: "Insights", noindex: true },
  },
  contact: {
    eyebrow: "Contact",
    title: "Let’s talk.",
    seo: { title: "Contact", description: "Get in touch with AION Consultancy." },
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy notice",
    intro: "[Privacy notice: TODO, to be written and reviewed]",
    seo: { title: "Privacy" },
  },
  cookies: {
    eyebrow: "Legal",
    title: "Cookies",
    intro: "[Cookie notice: TODO, to be written and reviewed]",
    seo: { title: "Cookies" },
  },
  notFound: {
    eyebrow: "404",
    title: "This page has moved on.",
    intro: "The page you were looking for isn’t here. It may have moved when we rebuilt the site.",
    seo: { title: "Page not found", noindex: true },
  },
  error: {
    eyebrow: "Error",
    title: "Something went wrong.",
    intro: "Sorry, this page didn’t load. Try again, or come back in a moment.",
    seo: { title: "Error", noindex: true },
  },
} satisfies PagesInput;
