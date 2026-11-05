import type { SiteSettingsInput } from "@/lib/content/schema";

/**
 * Site-wide settings and contact facts.
 *
 * TODO(content): every [bracketed] value is a placeholder. docs/voice.md
 * requires facts to come from AION, and the current site could not be fetched
 * from the build environment, so nothing here is guessed.
 */
export const site = {
  name: "AION Consultancy",
  legalName: "AION Consultancy Ltd",
  wordmark: "AION",
  lockup: "Consultancy",
  url: "https://aionconsults.com",
  flags: {
    /** Show /work once there are at least three real case studies. */
    showWork: false,
    showInsights: false,
  },
  contact: {
    // TEMPORARY: personal inbox until an @aionconsults.com mailbox is set up
    // (the domain currently has no MX records). Switch to aliparsa@aionconsults.com.
    email: "argp2018@outlook.com",
    phone: "[+44 phone]",
    phoneHref: "",
    linkedin: "",
  },
  offices: [{ name: "London", lines: ["[Office address line 1]", "[City, postcode]"] }],
  company: { number: "[placeholder]", registeredOffice: "[registered office address]" },
  // TODO(content): confirm office hours.
  officeHours: { days: [1, 2, 3, 4, 5], open: "09:00", close: "17:30", timeZone: "Europe/London" },
  seo: {
    titleTemplate: "%s — AION Consultancy",
    defaultTitle: "AION Consultancy",
    description:
      "Real estate research, urban regeneration strategy and executive education, led by Prof. Ali Parsa FRICS.",
  },
} satisfies SiteSettingsInput;
