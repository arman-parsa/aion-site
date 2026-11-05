import type { ServiceInput } from "@/lib/content/schema";

/**
 * The three service pillars. Titles and method lists come from the brief;
 * kickers/summaries are DRAFT copy from docs/voice.md. Body text and outcomes
 * are TODO(content): placeholders until AION supplies them.
 */
export const services = [
  {
    slug: "executive-education",
    order: 1,
    title: "Executive Education",
    kicker: "Masterclasses, training programmes and study visits.",
    // DRAFT (docs/voice.md)
    summary:
      "Masterclasses and study visits for the people running cities, funds and ministries, taught by the people who wrote the research.",
    body: [{ type: "paragraph", text: "[What we do in executive education — to be written]" }],
    outcomes: ["[Outcome one]", "[Outcome two]", "[Outcome three]"],
    methods: [
      { title: "Masterclasses" },
      { title: "Training programmes" },
      { title: "Specialised study visits for senior executives" },
    ],
    relatedWork: [],
    image: {
      src: "/images/expertise/executive-education.jpg",
      alt: "Colleagues working together around a long table",
      width: 2400,
      height: 1600,
      credit: "Unsplash (photo-1517048676732)",
    },
    seo: { title: "Executive Education" },
  },
  {
    slug: "research-and-market-intelligence",
    order: 2,
    title: "Research & Market Intelligence",
    kicker: "Market intelligence, country reports, surveys and focus groups.",
    // DRAFT (docs/voice.md)
    summary:
      "Country reports, surveys and focus groups that tell you what's actually happening in a market, not what the brochure says.",
    body: [
      {
        type: "paragraph",
        text: "[What we do in research and market intelligence — to be written]",
      },
    ],
    outcomes: ["[Outcome one]", "[Outcome two]", "[Outcome three]"],
    methods: [
      { title: "Real estate market intelligence" },
      { title: "Country reports" },
      { title: "Bespoke surveys" },
      { title: "Focus groups" },
    ],
    relatedWork: [],
    image: {
      src: "/images/expertise/research-and-market-intelligence.jpg",
      alt: "An aerial view across a dense city skyline",
      width: 2400,
      height: 1476,
      credit: "Unsplash (photo-1477959858617)",
    },
    seo: { title: "Research & Market Intelligence" },
  },
  {
    slug: "strategy-and-regeneration",
    order: 3,
    title: "Strategy & Regeneration",
    kicker: "Strategic planning and regeneration evaluation.",
    // DRAFT (docs/voice.md)
    summary:
      "Clear-eyed strategy and independent evaluation for regeneration programmes, from the brief to the ten-year review.",
    body: [
      { type: "paragraph", text: "[What we do in strategy and regeneration — to be written]" },
    ],
    outcomes: ["[Outcome one]", "[Outcome two]", "[Outcome three]"],
    methods: [{ title: "Strategic planning" }, { title: "Urban regeneration evaluation" }],
    relatedWork: [],
    image: {
      src: "/images/expertise/strategy-and-regeneration.jpg",
      alt: "Hands drafting architectural plans on paper",
      width: 2400,
      height: 1350,
      credit: "Unsplash (photo-1503387762)",
    },
    seo: { title: "Strategy & Regeneration" },
  },
] satisfies ServiceInput[];
