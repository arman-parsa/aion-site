import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndexList, PageIntro } from "@/components/sections";
import { Section } from "@/components/ui";
import { getCaseStudies, getPage, isFeatureOn } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("work");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.intro,
  path: "/work",
});

export default function WorkPage() {
  if (!isFeatureOn("showWork")) notFound();
  const work = getCaseStudies();
  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Section spacing="none" className="pb-3xl">
        <IndexList
          label={page.eyebrow}
          items={work.map((w) => ({
            href: `/work/${w.slug}`,
            title: w.title,
            meta: `${w.sector} · ${w.year}`,
          }))}
        />
      </Section>
    </>
  );
}
