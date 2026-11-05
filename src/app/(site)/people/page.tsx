import type { Metadata } from "next";
import { SplitHeading } from "@/components/motion";
import { PeopleIndex } from "@/components/sections/people";
import { Eyebrow, Section, Text } from "@/components/ui";
import { displayName, getPage, getPeople, getUiStrings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("people");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.intro,
  path: "/people",
});

export default function PeoplePage() {
  const ui = getUiStrings().people;
  const people = getPeople().map((p) => ({
    href: `/people/${p.slug}`,
    name: displayName(p),
    honorifics: p.honorifics.join(", "),
    role: p.role,
    portrait: {
      src: p.portrait.src,
      alt: p.portrait.alt,
      width: p.portrait.width,
      height: p.portrait.height,
    },
  }));

  return (
    <>
      <Section spacing="none" className="pt-page-top pb-2xl">
        {page.eyebrow && <Eyebrow>{page.eyebrow}</Eyebrow>}
        <SplitHeading as="h1" size={7} trigger="load" className="mt-s max-w-display">
          {page.title}
        </SplitHeading>
        {page.intro && (
          <Text size={3} tone="ink-2" className="mt-m font-display">
            {page.intro}
          </Text>
        )}
      </Section>
      <Section spacing="none" className="pb-3xl">
        <PeopleIndex
          people={people}
          labels={{ view: ui.viewLabel, list: ui.list, grid: ui.grid, listLabel: ui.listLabel }}
        />
      </Section>
    </>
  );
}
