import { getSiteSettings } from "@/lib/content";

/** Canonical origin: NEXT_PUBLIC_SITE_URL (per environment) or the content default. */
export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? getSiteSettings().url).replace(/\/$/, "");
}
