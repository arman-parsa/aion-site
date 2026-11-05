/** Copy for the internal /styleguide route. */
export const styleguide = {
  meta: {
    title: "Styleguide",
    description: "AION design tokens and UI primitives.",
  },
  title: "Design system",
  intro:
    "Tokens and primitives for aionconsults.com. Everything on the site is built from what is on this page.",
  sections: {
    colour: "Colour",
    type: "Type scale",
    families: "Families",
    space: "Space",
    grid: "Grid",
    motion: "Motion",
    primitives: "Primitives",
  },
  colourNote:
    "Stone is for large or decorative text only. Use accent-text for copper text at small sizes.",
  sample: "Places change slowly",
  sampleItalic: "the long view",
  paragraph:
    "We help governments and investors understand the places they're shaping, and we train the people who'll shape them next. Short sentences. Specifics over adjectives. One memorable line per section, and the rest gets out of the way.",
  families: [
    {
      token: "--font-display",
      name: "Instrument Serif",
      sample: "Evidence for the long view",
    },
    {
      token: "--font-sans",
      name: "Inter Tight",
      sample: "Country reports, bespoke surveys and focus groups.",
    },
    {
      token: "--font-mono",
      name: "Geist Mono",
      sample: "(01) Executive education",
    },
  ],
  primitives: {
    eyebrow: "Our process",
    buttons: {
      primary: "Get in touch",
      ghost: "Download brochure",
      text: "Read the research",
    },
    links: {
      internal: "Internal link",
      external: "External link",
      rest: "Underlined at rest",
    },
    headingInk: "Dark sections for rhythm",
    imageAlt: "Placeholder: abstract grey city blocks under a pale sky",
    portraitAlt: "Placeholder: abstract grey portrait-format plate",
    caption: "Placeholder plate, with grain",
  },
} as const;
