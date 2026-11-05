import type { Metadata } from "next";
import type { Seo } from "@/lib/content";

/**
 * Page metadata from content SEO fields. The title template ("%s — AION
 * Consultancy") is set once in the root layout. Canonical URLs, OpenGraph and
 * OG images are added in the SEO task.
 */
export function buildMetadata({
  title,
  description,
  seo,
  path,
}: {
  title: string;
  description?: string;
  seo?: Seo;
  path: string;
}): Metadata {
  return {
    title: seo?.title ?? title,
    description: seo?.description ?? description,
    alternates: { canonical: path },
    robots: seo?.noindex ? { index: false, follow: true } : undefined,
  };
}
