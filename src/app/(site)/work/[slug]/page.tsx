import type { Metadata } from "next";
import NextLink from "next/link";
import { notFound } from "next/navigation";
import { ClipMedia, CountUp, Reveal, SplitHeading } from "@/components/motion";
import { BodyBlocks } from "@/components/sections";
import { Arrow, Eyebrow, Grid, Link, Media, Rule, Section, Tag, Text } from "@/components/ui";
import {
  getCaseStudies,
  getCaseStudy,
  getNextCaseStudy,
  getService,
  getTestimonial,
  getUiStrings,
  isContentPreview,
  isFeatureOn,
} from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

/** Includes placeholders: Cache Components needs at least one param at build. */
export function generateStaticParams() {
  return getCaseStudies({ includePlaceholders: true }).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const work = getCaseStudy(slug);
  if (!work) return {};
  return buildMetadata({ ...work, description: work.summary, path: `/work/${slug}` });
}

function Chapter({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-2xl first:mt-0">
      <h2 id={id} className="font-display text-step-4">
        {title}
      </h2>
      <div className="mt-m">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const work = getCaseStudy(slug);
  if (!work || !isFeatureOn("showWork") || (work.placeholder && !isContentPreview())) notFound();

  const ui = getUiStrings().work;
  const [hero, ...rest] = work.images;
  const pairs: (typeof rest)[] = [];
  for (let i = 0; i < rest.length; i += 2) pairs.push(rest.slice(i, i + 2));
  const services = work.services.map((s) => getService(s)).filter((s) => s !== undefined);
  const quote = work.testimonial ? getTestimonial(work.testimonial) : undefined;
  const next = getNextCaseStudy(slug);

  return (
    <>
      <Section spacing="none" className="pt-page-top pb-xl">
        <Eyebrow>{work.client.name ?? work.client.descriptor}</Eyebrow>
        <SplitHeading as="h1" size={7} trigger="load" className="mt-s max-w-display">
          {work.title}
        </SplitHeading>
        <Text size={2} tone="ink-2" className="mt-m">
          {work.summary}
        </Text>
      </Section>

      {hero && (
        <div className="layout-grid">
          <ClipMedia trigger="load" className="full-bleed">
            <Media
              src={hero.src}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              sizes="100vw"
              aspect="landscape"
              frameClassName="md:aspect-cinema"
              priority
              grain
            />
          </ClipMedia>
        </div>
      )}

      <Section spacing="none" className="py-2xl">
        <Grid rowGap="xl">
          <aside aria-label={ui.facts.label} className="col-span-12 md:col-span-3">
            <dl className="flex flex-col rule-b md:sticky md:top-header">
              {[
                [ui.facts.client, work.client.name ?? work.client.descriptor],
                [ui.facts.sector, work.sector],
                [ui.facts.location, work.location],
                [ui.facts.year, String(work.year)],
              ].map(([k, v]) => (
                <div key={k} className="py-s rule">
                  <dt className="label text-ink-2">{k}</dt>
                  <dd className="mt-3xs text-step-0">{v}</dd>
                </div>
              ))}
              <div className="py-s rule">
                <dt className="label text-ink-2">{ui.facts.services}</dt>
                <dd className="mt-2xs flex flex-wrap gap-2xs">
                  {services.map((s) => (
                    <NextLink key={s.slug} href={`/expertise/${s.slug}`}>
                      <Tag>{s.title}</Tag>
                    </NextLink>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          <article className="col-span-12 md:col-span-7 md:col-start-5">
            <Chapter id="challenge" title={ui.challenge}>
              <BodyBlocks body={work.challenge} />
            </Chapter>
            <Chapter id="approach" title={ui.approach}>
              <BodyBlocks body={work.approach} />
            </Chapter>
            <Chapter id="outcome" title={ui.outcome}>
              <BodyBlocks body={work.outcome} />
            </Chapter>
          </article>
        </Grid>
      </Section>

      {work.stats.length > 0 && (
        <Section theme="ink" spacing="l" aria-label={ui.results}>
          <dl className="grid gap-l md:grid-cols-3">
            {work.stats.map((s) => (
              <div key={s.label} className="flex flex-col pt-s rule">
                <dt className="order-2 mt-2xs label text-ink-2">{s.label}</dt>
                <dd className="order-1 font-display text-step-6">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </dd>
                <dd className="order-3 mt-3xs label text-stone">{s.source}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      {pairs.length > 0 && (
        <Section spacing="l" aria-label={ui.gallery}>
          <div className="flex flex-col gap-grid-gap">
            {pairs.map((pair, i) => (
              <Reveal key={i} className="grid gap-grid-gap md:grid-cols-2">
                {pair.map((img) => (
                  <Media
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    aspect={pair.length === 1 ? "wide" : "portrait"}
                    caption={img.caption}
                    className={pair.length === 1 ? "md:col-span-2" : undefined}
                  />
                ))}
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {quote && (
        <Section spacing="xl">
          <figure className="mx-auto max-w-display text-center">
            <blockquote className="font-display text-step-5">
              {getUiStrings().quote.open}
              {quote.quote}
              {getUiStrings().quote.close}
            </blockquote>
            <figcaption className="mt-m label text-ink-2">
              {[quote.attribution, quote.role, quote.org].filter(Boolean).join(", ")}
            </figcaption>
          </figure>
        </Section>
      )}

      {next && (
        <Section spacing="none" className="pb-xl">
          <Rule />
          <Link
            href={`/work/${next.slug}`}
            underline="none"
            className="group block py-2xl font-display text-step-6"
          >
            {ui.next} — <span className="link-underline">{next.title}</span> <Arrow />
          </Link>
        </Section>
      )}
    </>
  );
}
