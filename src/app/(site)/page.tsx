import type { Metadata } from "next";
import Image from "next/image";
import { HeroMedia, Reveal } from "@/components/motion";
import { Button, Container } from "@/components/ui";
import { getPage, getSiteSettings } from "@/lib/content";
import { buildMetadata, JsonLd, organizationSchema } from "@/lib/seo";

const page = getPage("home");

export const metadata: Metadata = {
  ...buildMetadata({ ...page, description: page.intro, path: "/" }),
  title: { absolute: getSiteSettings().seo.defaultTitle },
};

/**
 * Home: deliberately minimal. A full-bleed photograph, the wordmark as the
 * page title, one line of tagline and a single Explore link. No footer
 * (data-hide-footer) and the header turns light over the image.
 */
export default function HomePage() {
  const site = getSiteSettings();
  const hero = page.hero;
  return (
    <>
      <JsonLd data={organizationSchema(site)} />
      <section
        data-header-on-image
        data-hide-footer
        aria-labelledby="home-title"
        className="theme-ink relative isolate grid h-svh min-h-[32rem] overflow-hidden"
      >
        {hero && (
          <HeroMedia>
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </HeroMedia>
        )}
        {/* Legibility scrim behind the type block (functional, not decorative). */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-scrim/75 via-scrim/40 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-scrim/40 to-transparent"
        />

        {/* One left-aligned block, centred vertically: title, tagline, link. */}
        <Container className="relative self-center pt-header text-on-image">
          <div className="flex max-w-measure flex-col items-start">
            <h1 id="home-title" className="flex items-baseline gap-s leading-none">
              <span className="font-wordmark text-step-8 leading-none">{site.wordmark}</span>
              <span className="font-mono text-step-1 tracking-label uppercase">{site.lockup}</span>
            </h1>
            <Reveal className="mt-l flex flex-col items-start gap-l">
              {page.intro && <p className="text-step-1 text-on-image/90">{page.intro}</p>}
              {hero && (
                <Button href={hero.cta.href} variant="onImage" arrow>
                  {hero.cta.label}
                </Button>
              )}
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
