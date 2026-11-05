/**
 * Site navigation. The menu overlay, footer and (later) sitemap read this via
 * getNavigation(). `flag` hides an item until its site-settings flag is on.
 */
export type NavItem = {
  label: string;
  href: string;
  /** Optional site-settings feature flag that must be true to show the item. */
  flag?: "showWork" | "showInsights";
};

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
} satisfies { primary: NavItem[]; legal: NavItem[] };
