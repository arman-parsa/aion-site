import { getNavigation, getUiStrings } from "@/lib/content";
import { MenuOverlay } from "./MenuOverlay";

/** Server wrapper: reads content and hands plain props to the client overlay. */
export function Menu() {
  const copy = getUiStrings().menu;
  const nav = getNavigation();
  return (
    <MenuOverlay
      items={nav.primary.map(({ label, href }) => ({ label, href }))}
      label={copy.label}
    />
  );
}
