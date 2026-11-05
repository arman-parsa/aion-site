import type { Metadata } from "next";
import { IndexList, PageIntro } from "@/components/sections";
import { Section } from "@/components/ui";
import { getPage, getServices } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("expertise");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.intro,
  path: "/expertise",
});

export default function ExpertisePage() {
  const services = getServices();
  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Section spacing="none" className="pb-3xl">
        <IndexList
          label={page.eyebrow}
          items={services.map((s) => ({
            href: `/expertise/${s.slug}`,
            title: s.title,
            meta: s.kicker,
          }))}
        />
      </Section>
    </>
  );
}
