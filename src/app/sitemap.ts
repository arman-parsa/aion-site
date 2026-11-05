import type { MetadataRoute } from "next";
import { getCaseStudies, getPeople, getServices, isFeatureOn } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

/** Public, indexable pages only (no /styleguide, placeholders or hidden sections). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const url = (path: string) => `${base}${path}`;
  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/expertise"), changeFrequency: "monthly", priority: 0.9 },
    ...getServices().map((s) => ({
      url: url(`/expertise/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: url("/people"), changeFrequency: "monthly", priority: 0.8 },
    ...getPeople().map((p) => ({
      url: url(`/people/${p.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/cookies"), changeFrequency: "yearly", priority: 0.2 },
  ];
  if (isFeatureOn("showWork")) {
    pages.push({ url: url("/work"), changeFrequency: "monthly", priority: 0.8 });
    for (const w of getCaseStudies()) {
      if (!w.placeholder && !w.seo.noindex)
        pages.push({ url: url(`/work/${w.slug}`), changeFrequency: "yearly", priority: 0.6 });
    }
  }
  if (isFeatureOn("showInsights")) {
    pages.push({ url: url("/insights"), changeFrequency: "weekly", priority: 0.6 });
  }
  return pages;
}
