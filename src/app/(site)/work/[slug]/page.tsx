import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BodyBlocks, PageIntro } from "@/components/sections";
import { Section } from "@/components/ui";
import { getCaseStudies, getCaseStudy, isFeatureOn } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

/** Includes placeholders: Cache Components needs at least one param at build. */
export function generateStaticParams() {
  return getCaseStudies({ includePlaceholders: true }).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = getCaseStudy(slug);
  if (!work) return {};
  return buildMetadata({ ...work, description: work.summary, path: `/work/${slug}` });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const work = getCaseStudy(slug);
  if (!work || !isFeatureOn("showWork") || work.placeholder) notFound();
  return (
    <>
      <PageIntro
        eyebrow={work.client.name ?? work.client.descriptor}
        title={work.title}
        intro={work.summary}
      />
      <Section spacing="none" className="pb-3xl">
        <BodyBlocks body={[...work.challenge, ...work.approach, ...work.outcome]} />
      </Section>
    </>
  );
}
