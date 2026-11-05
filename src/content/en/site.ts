/**
 * Site-wide settings and contact facts.
 *
 * TODO(content): every value in brackets is a placeholder. The current site
 * (aionconsults.com) could not be fetched from the build environment, and
 * docs/voice.md requires facts to come from AION, so nothing here is guessed.
 */
export const site = {
  name: "AION Consultancy",
  legalName: "AION Consultancy Ltd",
  wordmark: "AION",
  lockup: "Consultancy",
  flags: {
    /** Show /work in navigation once there are at least three case studies. */
    showWork: false,
    showInsights: false,
  },
  contact: {
    email: "[email@aionconsults.com]", // TODO(content): real enquiries address
    phone: "[+44 phone]", // TODO(content): display format
    phoneHref: "", // TODO(content): E.164, e.g. +442000000000
    linkedin: "", // TODO(content): company LinkedIn URL
  },
  offices: [
    {
      name: "London",
      lines: ["[Office address line 1]", "[City, postcode]"], // TODO(content)
    },
  ],
  company: {
    number: "[placeholder]", // TODO(content): Companies House number
    registeredOffice: "[registered office address]", // TODO(content)
  },
  /** Europe/London office hours, used for the live "open now" status. TODO(content): confirm. */
  officeHours: { days: [1, 2, 3, 4, 5], open: "09:00", close: "17:30", timeZone: "Europe/London" },
} as const;

export const layoutCopy = {
  skipToContent: "Skip to content",
  header: {
    homeLabel: "AION Consultancy, home",
    clockLabel: "London",
    clockAria: "Current time in London",
    getInTouch: "Get in touch",
    getInTouchHref: "/contact",
    menuOpen: "Menu",
    menuClose: "Close",
  },
  menu: {
    label: "Site menu",
    primaryHeading: "Pages",
    secondaryHeading: "Contact",
    email: "Email",
    phone: "Phone",
    office: "Office",
    linkedin: "LinkedIn",
  },
  footer: {
    cta: "Let’s talk.",
    ctaHref: "/contact",
    columns: { navigation: "Navigation", contact: "Contact", offices: "Offices", legal: "Legal" },
    companyNo: "Company no.",
    registeredOffice: "Registered office",
    backToTop: "Back to top",
    officeHours: "Office hours",
    open: "open now",
    closed: "closed",
  },
} as const;
