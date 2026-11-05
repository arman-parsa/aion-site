import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BodyBlocks, PageIntro } from "@/components/sections";
import { Section } from "@/components/ui";
import { getService, getServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/expertise/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({ ...service, description: service.summary, path: `/expertise/${slug}` });
}

export default async function ServicePage({ params }: PageProps<"/expertise/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return (
    <>
      <PageIntro eyebrow={service.kicker} title={service.title} intro={service.summary} />
      <Section spacing="none" className="pb-3xl">
        <BodyBlocks body={service.body} />
      </Section>
    </>
  );
}
