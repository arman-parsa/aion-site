import type { Metadata } from "next";
import { IndexList, PageIntro } from "@/components/sections";
import { Section } from "@/components/ui";
import { displayName, getPage, getPeople } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("people");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.intro,
  path: "/people",
});

export default function PeoplePage() {
  const people = getPeople();
  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Section spacing="none" className="pb-3xl">
        <IndexList
          label={page.eyebrow}
          items={people.map((p) => ({
            href: `/people/${p.slug}`,
            title: displayName(p),
            meta: [p.honorifics.join(" "), p.role].filter(Boolean).join(" · "),
          }))}
        />
      </Section>
    </>
  );
}
