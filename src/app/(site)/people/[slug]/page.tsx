import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BodyBlocks, PageIntro } from "@/components/sections";
import { Section } from "@/components/ui";
import { displayName, getPeople, getPerson } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getPeople().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) return {};
  return buildMetadata({
    title: displayName(person),
    description: person.shortBio,
    seo: person.seo,
    path: `/people/${slug}`,
  });
}

export default async function PersonPage({ params }: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) notFound();
  return (
    <>
      <PageIntro eyebrow={person.role} title={displayName(person)} intro={person.shortBio} />
      <Section spacing="none" className="pb-3xl">
        <BodyBlocks body={person.longBio} />
      </Section>
    </>
  );
}
