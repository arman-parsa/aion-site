import type { PersonInput } from "@/lib/content/schema";
import { placeholderPortrait } from "./images";

/**
 * People. Names and post-nominals are from the brief; everything else is a
 * placeholder.
 *
 * TODO(content): roles, bios, credentials, affiliations and portraits must be
 * copied from the current site (aionconsults.com/team/) and checked with each
 * person. The site was unreachable from the build environment, so nothing has
 * been filled in from it yet.
 */
export const people = [
  {
    slug: "ali-parsa",
    prefix: "Prof.",
    name: "Ali Parsa",
    honorifics: ["FRICS"],
    role: "[Role]", // TODO(content): CLAUDE.md says the firm is "led by" Prof. Parsa; confirm title.
    shortBio: "[Short bio]",
    longBio: [{ type: "paragraph", text: "[Long bio]" }],
    credentials: [],
    affiliations: [],
    alumniOf: [],
    portrait: placeholderPortrait("Placeholder portrait for Prof. Ali Parsa"),
    order: 1,
    featured: true,
  },
  {
    slug: "chris-mullard",
    prefix: "Prof.",
    name: "Chris Mullard",
    honorifics: ["CBE"],
    role: "[Role]",
    shortBio: "[Short bio]",
    longBio: [{ type: "paragraph", text: "[Long bio]" }],
    portrait: placeholderPortrait("Placeholder portrait for Prof. Chris Mullard"),
    order: 2,
    featured: true,
  },
  {
    slug: "m-morad",
    prefix: "Prof.",
    name: "M. Morad", // TODO(content): full first name as the person prefers it.
    honorifics: [],
    role: "[Role]",
    shortBio: "[Short bio]",
    longBio: [{ type: "paragraph", text: "[Long bio]" }],
    portrait: placeholderPortrait("Placeholder portrait for Prof. M. Morad"),
    order: 3,
  },
  {
    slug: "elvina-chung",
    name: "Elvina Chung",
    honorifics: [],
    role: "[Role]",
    shortBio: "[Short bio]",
    longBio: [{ type: "paragraph", text: "[Long bio]" }],
    portrait: placeholderPortrait("Placeholder portrait for Elvina Chung"),
    order: 4,
  },
] satisfies PersonInput[];
