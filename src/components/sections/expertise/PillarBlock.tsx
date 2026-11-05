import NextLink from "next/link";
import { ClipMedia, Reveal } from "@/components/motion";
import { Button, Eyebrow, Grid, Heading, Media, Rule, Tag, Text } from "@/components/ui";
import type { Service } from "@/lib/content";
import { cn } from "@/lib/utils/cn";

type Props = { service: Service; index: number; labels: { methods: string; explore: string } };

/** A full-width pillar: image on one side (alternating), copy on the other. */
export function PillarBlock({ service, index, labels }: Props) {
  const flip = index % 2 === 1;
  const href = `/expertise/${service.slug}`;
  const headingId = `pillar-${service.slug}`;
  return (
    <article aria-labelledby={headingId} className="group">
      <Rule draw />
      <div className="py-2xl">
        <Grid rowGap="l" className="items-center">
          <div
            className={cn(
              "col-span-12 md:col-span-7",
              flip ? "md:col-start-6 md:row-start-1" : "md:col-start-1",
            )}
          >
            <NextLink href={href} tabIndex={-1} aria-hidden className="group block">
              <ClipMedia zoom={false}>
                <div data-parallax className="overflow-hidden">
                  <Media
                    src={service.image.src}
                    alt=""
                    width={service.image.width}
                    height={service.image.height}
                    sizes="(min-width: 768px) 58vw, 100vw"
                    aspect="landscape"
                    duotone
                  />
                </div>
              </ClipMedia>
            </NextLink>
          </div>
          <Reveal
            className={cn(
              "col-span-12 md:col-span-4",
              flip ? "md:col-start-1 md:row-start-1" : "md:col-start-9",
            )}
          >
            <Eyebrow index={index + 1}>{service.kicker}</Eyebrow>
            <Heading as="h2" size={5} id={headingId} className="mt-s">
              <NextLink href={href}>{service.title}</NextLink>
            </Heading>
            <Text size={1} tone="ink-2" className="mt-m">
              {service.summary}
            </Text>
            <div className="mt-m">
              <p className="sr-only">{labels.methods}</p>
              <ul className="flex flex-wrap gap-2xs">
                {service.methods.map((m) => (
                  <li key={m.title}>
                    <Tag>{m.title}</Tag>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-l">
              <Button href={href} aria-label={`${labels.explore}: ${service.title}`}>
                {labels.explore}
              </Button>
            </div>
          </Reveal>
        </Grid>
      </div>
    </article>
  );
}
