import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndexList, PageIntro } from "@/components/sections";
import { Section } from "@/components/ui";
import { getInsights, getPage, isFeatureOn } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("insights");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.intro,
  path: "/insights",
});

/** Feature-flagged off until there are articles (site.flags.showInsights). */
export default function InsightsPage() {
  if (!isFeatureOn("showInsights")) notFound();
  const insights = getInsights();
  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Section spacing="none" className="pb-3xl">
        <IndexList
          label={page.eyebrow}
          items={insights.map((n) => ({
            href: `/insights/${n.slug}`,
            title: n.title,
            meta: n.date,
          }))}
        />
      </Section>
    </>
  );
}
