import { getLayoutCopy, getNavigation, getSiteSettings } from "@/lib/content";
import { MenuOverlay } from "./MenuOverlay";

/** Server wrapper: reads content and hands plain props to the client overlay. */
export function Menu() {
  const copy = getLayoutCopy().menu;
  const site = getSiteSettings();
  const nav = getNavigation();
  const office = site.offices[0];
  const details = [
    { label: copy.email, value: site.contact.email, href: `mailto:${site.contact.email}` },
    {
      label: copy.phone,
      value: site.contact.phone,
      href: site.contact.phoneHref ? `tel:${site.contact.phoneHref}` : undefined,
    },
    { label: copy.office, value: office ? office.lines.join(", ") : "" },
    { label: copy.linkedin, value: "LinkedIn", href: site.contact.linkedin || undefined },
  ].filter((d) => d.value && (d.label !== copy.linkedin || d.href));

  return (
    <MenuOverlay
      items={nav.primary.map(({ label, href }) => ({ label, href }))}
      label={copy.label}
      primaryHeading={copy.primaryHeading}
      secondaryHeading={copy.secondaryHeading}
      details={details}
    />
  );
}
