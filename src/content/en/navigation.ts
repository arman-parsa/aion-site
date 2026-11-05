import type { NavigationInput } from "@/lib/content/schema";

/** `flag` hides an item until that site-settings flag is on. */
export const navigation = {
  primary: [
    { label: "Expertise", href: "/expertise" },
    { label: "Work", href: "/work", flag: "showWork" },
    { label: "People", href: "/people" },
    { label: "Insights", href: "/insights", flag: "showInsights" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
  ],
} satisfies NavigationInput;
