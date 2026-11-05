import type { Metadata } from "next";
import { SplitHeading } from "@/components/motion";
import { PillarBlock } from "@/components/sections/expertise";
import { Eyebrow, Section, Text } from "@/components/ui";
import { getPage, getServices, getUiStrings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("expertise");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.intro,
  path: "/expertise",
});

export default function ExpertisePage() {
  const services = getServices();
  const ui = getUiStrings().expertise;
  return (
    <>
      <Section spacing="none" className="pt-page-top pb-2xl">
        {page.eyebrow && <Eyebrow>{page.eyebrow}</Eyebrow>}
        <SplitHeading as="h1" size={7} trigger="load" className="mt-s max-w-display">
          {page.title}
        </SplitHeading>
        {page.intro && (
          <Text size={2} tone="ink-2" className="mt-m">
            {page.intro}
          </Text>
        )}
      </Section>
      <Section spacing="none" className="pb-3xl" aria-label={ui.pillarsLabel}>
        {services.map((service, i) => (
          <PillarBlock key={service.slug} service={service} index={i} labels={ui} />
        ))}
      </Section>
    </>
  );
}
