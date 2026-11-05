import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClipMedia, SplitHeading } from "@/components/motion";
import { BodyBlocks } from "@/components/sections";
import { RuledList } from "@/components/sections/people";
import { Button, Grid, Link, Media, Section, Text } from "@/components/ui";
import { displayName, getPeople, getPerson, getSiteSettings, getUiStrings } from "@/lib/content";
import { buildMetadata, JsonLd, personSchema } from "@/lib/seo";

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
  const ui = getUiStrings().people;
  const site = getSiteSettings();

  return (
    <>
      <JsonLd data={personSchema(person, site)} />
      <Section spacing="none" className="pt-page-top pb-3xl">
        <Grid rowGap="xl">
          <div className="col-span-12 md:col-span-5">
            <div className="md:sticky md:top-header">
              <ClipMedia trigger="load">
                <Media
                  src={person.portrait.src}
                  alt={person.portrait.alt}
                  width={person.portrait.width}
                  height={person.portrait.height}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  aspect="portrait"
                  duotone
                  priority
                />
              </ClipMedia>
            </div>
          </div>

          <article className="col-span-12 md:col-span-6 md:col-start-7">
            <SplitHeading as="h1" size={6} trigger="load">
              {displayName(person)}
            </SplitHeading>
            {person.honorifics.length > 0 && (
              <p className="mt-s label text-ink-2">{person.honorifics.join(", ")}</p>
            )}
            <p className="mt-2xs text-step-1">{person.role}</p>

            <Text size={3} className="mt-xl font-display">
              {person.shortBio}
            </Text>

            <BodyBlocks body={person.longBio} className="mt-xl" />

            <RuledList id="credentials" title={ui.credentials} items={person.credentials} />
            <RuledList
              id="affiliations"
              title={ui.affiliations}
              items={person.affiliations.map((a) => {
                const text = a.role ? `${a.name}, ${a.role}` : a.name;
                return a.url ? <Link href={a.url}>{text}</Link> : text;
              })}
            />

            <div className="mt-2xl">
              <Button href="/people" arrow={false}>
                {ui.back}
              </Button>
            </div>
          </article>
        </Grid>
      </Section>
    </>
  );
}
