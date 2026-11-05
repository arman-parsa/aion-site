import type { SiteSettingsInput } from "@/lib/content/schema";

/**
 * Site-wide settings and contact facts.
 *
 * Facts supplied by AION (Nov 2026). Any remaining [bracketed] value is a
 * placeholder still to be confirmed; nothing here is guessed.
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
    phone: "+44 7957 287341",
    phoneHref: "+447957287341",
    linkedin: "",
  },
  offices: [{ name: "Manchester", lines: ["Apartment 5, 32 Range Road", "Manchester M16 8ES"] }],
  // Companies House: AION CONSULTANCY LTD, company number 11807812.
  // TODO(content): registered office address as shown on Companies House.
  company: { number: "11807812", registeredOffice: "[registered office address]" },
  // TODO(content): confirm who founded the firm (e.g. ["ali-parsa"]); used in JSON-LD.
  founders: [],
  // TODO(content): countries/regions served (e.g. "United Kingdom", "Gulf states").
  areaServed: [],
  // TODO(content): confirm office hours.
  officeHours: { days: [1, 2, 3, 4, 5], open: "09:00", close: "17:30", timeZone: "Europe/London" },
  seo: {
    titleTemplate: "%s — AION Consultancy",
    defaultTitle: "AION Consultancy",
    description:
      "Real estate research, urban regeneration strategy and executive education, led by Prof. Ali Parsa FRICS.",
  },
} satisfies SiteSettingsInput;
