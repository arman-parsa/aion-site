import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClipMedia, Reveal, SplitHeading } from "@/components/motion";
import { BodyBlocks, IndexList } from "@/components/sections";
import { NextPillar } from "@/components/sections/expertise";
import { Eyebrow, formatIndex, Grid, Media, Rule, Section, Text } from "@/components/ui";
import {
  getCaseStudiesForService,
  getNextService,
  getPage,
  getService,
  getServices,
  getSiteSettings,
  getUiStrings,
} from "@/lib/content";
import { buildMetadata, JsonLd, serviceSchema } from "@/lib/seo";

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

/** Sticky section label in cols 1–3, content in cols 5–11. */
function Row({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="py-2xl rule">
      <Grid rowGap="m">
        <div className="col-span-12 md:col-span-3">
          <h2 id={id} className="label text-ink-2 md:sticky md:top-header">
            {label}
          </h2>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-5">{children}</div>
      </Grid>
    </section>
  );
}

export default async function ServicePage({ params }: PageProps<"/expertise/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const ui = getUiStrings().expertise;
  const site = getSiteSettings();
  const index = getServices().findIndex((s) => s.slug === slug);
  const next = getNextService(slug);
  const related = getCaseStudiesForService(slug);
  const eyebrow = getPage("expertise").eyebrow;

  return (
    <>
      <JsonLd data={serviceSchema(service, site)} />

      <Section spacing="none" className="pt-page-top pb-xl">
        <Eyebrow index={index + 1}>{eyebrow}</Eyebrow>
        <SplitHeading as="h1" size={7} trigger="load" className="mt-s max-w-display">
          {service.title}
        </SplitHeading>
        <Text size={2} tone="ink-2" className="mt-m">
          {service.kicker}
        </Text>
      </Section>

      <div className="layout-grid">
        <ClipMedia trigger="load" className="full-bleed">
          <Media
            src={service.image.src}
            alt={service.image.alt}
            width={service.image.width}
            height={service.image.height}
            sizes="100vw"
            aspect="landscape"
            frameClassName="md:aspect-cinema"
            priority
            grain
          />
        </ClipMedia>
      </div>

      <Section spacing="none" className="pt-2xl pb-xl">
        <Text size={3} className="font-display">
          {service.summary}
        </Text>
      </Section>

      <Section spacing="none">
        <Row label={ui.whatWeDo} id="what-we-do">
          <BodyBlocks body={service.body} />
        </Row>

        <Row label={ui.methods} id="methods">
          <ol>
            {service.methods.map((m, i) => (
              <li
                key={m.title}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-m py-s rule"
              >
                <span className="label text-ink-2 tabular-nums">{formatIndex(i + 1)}</span>
                <span className="text-step-2">{m.title}</span>
                {m.description && (
                  <Text size={0} tone="ink-2" className="col-start-2 mt-2xs">
                    {m.description}
                  </Text>
                )}
              </li>
            ))}
          </ol>
        </Row>

        {service.outcomes.length > 0 && (
          <section aria-labelledby="outcomes" className="py-2xl rule">
            <h2 id="outcomes" className="label text-ink-2">
              {ui.outcomes}
            </h2>
            <Reveal className="mt-l grid gap-l md:grid-cols-3">
              {service.outcomes.map((o, i) => (
                <div key={o} className="pt-s rule">
                  <p className="label text-ink-2">{formatIndex(i + 1)}</p>
                  <p className="mt-s font-display text-step-3">{o}</p>
                </div>
              ))}
            </Reveal>
          </section>
        )}

        {related.length > 0 && (
          <Row label={ui.relatedWork} id="related-work">
            <IndexList
              items={related.map((w) => ({
                href: `/work/${w.slug}`,
                title: w.title,
                meta: `${w.sector} · ${w.year}`,
              }))}
            />
          </Row>
        )}
      </Section>

      {next && next.slug !== service.slug && (
        <Section spacing="none" className="pb-xl">
          <Rule />
          <NextPillar service={next} label={ui.next} />
        </Section>
      )}
    </>
  );
}
