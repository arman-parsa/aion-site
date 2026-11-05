/** Interface strings: labels, aria text, layout copy. Not CMS-managed. */
export const ui = {
  opensInNewTab: "(opens in a new tab)",
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
  notFound: { home: "Home", links: "Try one of these" },
  error: { retry: "Try again", home: "Back to the home page" },
  listing: { readMore: "Read more", placeholderBadge: "Placeholder" },
} as const;

export type UiStrings = typeof ui;
