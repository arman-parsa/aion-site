import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SplitHeading } from "@/components/motion";
import { WorkFilter, WorkIndexList } from "@/components/sections/work";
import { Eyebrow, Section, Text } from "@/components/ui";
import {
  getCaseStudiesByService,
  getPage,
  getServices,
  getUiStrings,
  isFeatureOn,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("work");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.intro,
  path: "/work",
});

/** Reads ?service= at request time; the rest of the page is a static shell. */
async function FilteredWork({
  searchParams,
}: {
  searchParams: PageProps<"/work">["searchParams"];
}) {
  const ui = getUiStrings().work;
  const services = getServices();
  const raw = (await searchParams).service;
  const current = typeof raw === "string" && services.some((s) => s.slug === raw) ? raw : undefined;
  const work = getCaseStudiesByService(current);

  return (
    <>
      <WorkFilter
        label={ui.filterLabel}
        allLabel={ui.all}
        options={services.map((s) => ({ slug: s.slug, title: s.title }))}
        current={current}
      />
      <div className="mt-xl">
        {work.length === 0 ? (
          <p className="py-m text-step-1 text-ink-2 rule">{ui.empty}</p>
        ) : (
          <WorkIndexList
            label={page.title}
            columns={ui.columns}
            rows={work.map((w) => ({
              href: `/work/${w.slug}`,
              title: w.title,
              sector: w.sector,
              location: w.location,
              year: w.year,
              image: {
                src: w.images[0]!.src,
                width: w.images[0]!.width,
                height: w.images[0]!.height,
              },
            }))}
          />
        )}
      </div>
    </>
  );
}

export default function WorkPage({ searchParams }: PageProps<"/work">) {
  if (!isFeatureOn("showWork")) notFound();
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
      <Section spacing="none" className="pb-3xl">
        <Suspense fallback={<div className="min-h-placeholder" />}>
          <FilteredWork searchParams={searchParams} />
        </Suspense>
      </Section>
    </>
  );
}
