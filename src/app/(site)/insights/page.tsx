import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/sections";
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
      {/* TODO(insights): add an /insights/[slug] route (it needs at least one
          article for generateStaticParams), then link these titles. */}
      <Section spacing="none" className="pb-3xl">
        <ul className="rule-b">
          {insights.map((n) => (
            <li key={n.slug} className="grid-12 items-baseline py-m rule">
              <span className="col-span-12 font-display text-step-3 md:col-span-9">{n.title}</span>
              <time
                dateTime={n.date}
                className="col-span-12 label text-ink-2 md:col-span-3 md:text-end"
              >
                {n.date}
              </time>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
