import type { Metadata } from "next";
import { getSiteSettings, type Seo } from "@/lib/content";

/**
 * Page metadata from content SEO fields: title (templated "%s — AION
 * Consultancy" by the root layout), description, canonical URL, OpenGraph and
 * Twitter. OG images come from the nearest opengraph-image.tsx.
 */
export function buildMetadata({
  title,
  description,
  seo,
  path,
  type = "website",
}: {
  title: string;
  description?: string;
  seo?: Seo;
  path: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  const site = getSiteSettings();
  const t = seo?.title ?? title;
  const d = seo?.description ?? description ?? site.seo.description;
  return {
    title: t,
    description: d,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: "en_GB",
      title: t,
      description: d,
    },
    twitter: { card: "summary_large_image", title: t, description: d },
    robots: seo?.noindex ? { index: false, follow: true } : undefined,
  };
}
