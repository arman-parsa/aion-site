import type { Metadata } from "next";
import { BodyBlocks, PageIntro } from "@/components/sections";
import { Section } from "@/components/ui";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("cookies");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.intro,
  path: "/cookies",
});

export default function Page() {
  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Section spacing="none" className="pb-3xl">
        <BodyBlocks body={page.body} className="max-w-measure" />
      </Section>
    </>
  );
}
