import type { PersonInput } from "@/lib/content/schema";
import { placeholderPortrait } from "./images";

/**
 * People. Ali Parsa and Elvina Chung: facts supplied by AION (Nov 2026), from
 * the old site's /team-members/ page.
 *
 * TODO(content): real portraits for everyone.
 */
export const people = [
  {
    slug: "ali-parsa",
    prefix: "Prof.",
    name: "Ali Parsa",
    honorifics: ["M.Phil", "PhD", "FRICS", "FRSA"],
    role: "Partner and Director",
    shortBio:
      "A Chartered Surveyor and former Dean of the School of Real Estate and Land Management at the Royal Agricultural University.",
    longBio: [
      {
        type: "paragraph",
        text: "Ali earned his PhD in International Planning and Construction from the University of Newcastle upon Tyne in 1991. He has since held academic chairs at the University of Salford and the University of Ulster.",
      },
      {
        type: "paragraph",
        text: "He has published more than 150 research articles, and serves as an external examiner for universities around the world, including the University of Hong Kong and the National University of Singapore.",
      },
    ],
    credentials: [
      "PhD, International Planning and Construction, University of Newcastle upon Tyne (1991)",
      "M.Phil",
      "Fellow of the Royal Institution of Chartered Surveyors (FRICS)",
      "Fellow of the Royal Society of Arts (FRSA)",
      "More than 150 published research articles",
    ],
    affiliations: [
      {
        name: "Royal Agricultural University",
        role: "former Dean, School of Real Estate and Land Management",
      },
      { name: "University of Salford", role: "former chair" },
      { name: "University of Ulster", role: "former chair" },
      { name: "University of Hong Kong", role: "external examiner" },
      { name: "National University of Singapore", role: "external examiner" },
    ],
    alumniOf: ["University of Newcastle upon Tyne"],
    portrait: placeholderPortrait("Placeholder portrait for Prof. Ali Parsa"),
    order: 1,
    featured: true,
  },

  {
    slug: "elvina-chung",
    name: "Elvina Chung",
    honorifics: [],
    role: "Director of Planning and Investment",
    shortBio:
      "Specialises in commercial real estate analysis and investment, including venture capital and startup ecosystems.",
    longBio: [
      {
        type: "paragraph",
        text: "Elvina holds a Master’s degree in International Real Estate from a UK university. Alongside her work with AION, she is Director of Planning and Investment at Wonder Team Development Limited, a mid-sized family office based in Hong Kong.",
      },
    ],
    credentials: ["Master’s degree, International Real Estate (UK)"],
    affiliations: [
      {
        name: "Wonder Team Development Limited, Hong Kong",
        role: "Director of Planning and Investment",
      },
    ],
    portrait: placeholderPortrait("Placeholder portrait for Elvina Chung"),
    order: 2,
  },
] satisfies PersonInput[];
