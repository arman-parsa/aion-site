import type { Metadata } from "next";
import { Heading, Section } from "@/components/ui";
import { getPage, getSiteSettings } from "@/lib/content";
import { buildMetadata, JsonLd, organizationSchema } from "@/lib/seo";

const page = getPage("home");

export const metadata: Metadata = {
  ...buildMetadata({ ...page, path: "/" }),
  // The home page uses the site's default title, not the "%s — AION" template.
  title: { absolute: getSiteSettings().seo.defaultTitle },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema(getSiteSettings())} />
      <Section spacing="none" className="grid min-h-dvh items-center">
        <Heading as="h1" size={6}>
          {page.title}
        </Heading>
      </Section>
    </>
  );
}
