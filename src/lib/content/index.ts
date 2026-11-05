import { home } from "@/content/en/home";
import { navigation, type NavItem } from "@/content/en/navigation";
import { layoutCopy, site } from "@/content/en/site";
import { styleguide } from "@/content/en/styleguide";
import { ui } from "@/content/en/ui";

export type Locale = "en";
export type { NavItem };

export function getHome() {
  return home;
}

export function getUiStrings() {
  return ui;
}

export function getStyleguide() {
  return styleguide;
}

export function getSiteSettings(_locale: Locale = "en") {
  return site;
}

export function getLayoutCopy(_locale: Locale = "en") {
  return layoutCopy;
}

/** Navigation with feature-flagged items removed. */
export function getNavigation(_locale: Locale = "en") {
  const isOn = (item: NavItem) => !item.flag || site.flags[item.flag];
  return {
    primary: navigation.primary.filter(isOn),
    legal: navigation.legal.filter(isOn),
  };
}
