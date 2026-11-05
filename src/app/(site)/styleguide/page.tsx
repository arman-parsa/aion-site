import type { Metadata } from "next";
import placeholderLandscape from "../../../../public/images/placeholders/plate-landscape.jpg";
import placeholderPortrait from "../../../../public/images/placeholders/plate-portrait.jpg";
import {
  Button,
  Container,
  Eyebrow,
  Grid,
  Heading,
  Link,
  Media,
  Rule,
  Section,
  Text,
  stepClasses,
} from "@/components/ui";
import { getStyleguide } from "@/lib/content";
import { gridGap, gutter, spaceScale, typeMetrics, typeScale } from "@/styles/tokens";

const copy = getStyleguide();

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "paper", className: "bg-paper", paper: "#F2EFE9", ink: "#141414" },
  { name: "paper-2", className: "bg-paper-2", paper: "#E8E3DA", ink: "#1F1F1E" },
  { name: "ink", className: "bg-ink", paper: "#141414", ink: "#F2EFE9" },
  { name: "ink-2", className: "bg-ink-2", paper: "#3A3A38", ink: "#C9C4BA" },
  { name: "stone", className: "bg-stone", paper: "#8C877E", ink: "#8C877E" },
  { name: "rule", className: "bg-rule", paper: "ink / 15%", ink: "ink / 15%" },
  { name: "accent", className: "bg-accent", paper: "#B4532A", ink: "#B4532A" },
  { name: "accent-text", className: "bg-accent-text", paper: "#A04822", ink: "#D4774E" },
  { name: "accent-ink", className: "bg-accent-ink", paper: "#FFFFFF", ink: "#FFFFFF" },
] as const;

const easings = [
  {
    name: "--ease-out-expo",
    className: "ease-out-expo",
    value: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  {
    name: "--ease-in-out-quart",
    className: "ease-in-out-quart",
    value: "cubic-bezier(0.76, 0, 0.24, 1)",
  },
] as const;

const durations = [
  { name: "fast", className: "duration-fast", value: "200ms" },
  { name: "base", className: "duration-base", value: "400ms" },
  { name: "slow", className: "duration-slow", value: "800ms" },
  { name: "slower", className: "duration-slower", value: "1200ms" },
] as const;

const familyClasses = ["font-display", "font-sans", "font-mono"] as const;

function SectionHead({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div className="mb-l">
      <Eyebrow index={index}>{children}</Eyebrow>
      <Rule className="mt-xs" />
    </div>
  );
}

function Swatches({ theme = "paper" }: { theme?: "paper" | "ink" }) {
  return (
    <ul className="grid grid-cols-2 gap-grid-gap md:grid-cols-3 lg:grid-cols-5">
      {swatches.map((s) => (
        <li key={s.name}>
          <div
            className={`${s.className} aspect-landscape border-hairline border-solid border-rule`}
          />
          <p className="mt-2xs label">{s.name}</p>
          <p className="label text-ink-2">{s[theme]}</p>
        </li>
      ))}
    </ul>
  );
}

export default function StyleguidePage() {
  const p = copy.primitives;
  return (
    <>
      <Section spacing="xl">
        <Eyebrow>AION / {copy.meta.title}</Eyebrow>
        <Heading as="h1" size={8} className="mt-m">
          {copy.title}
        </Heading>
        <Text size={2} tone="ink-2" className="mt-m">
          {copy.intro}
        </Text>
      </Section>

      {/* Colour */}
      <Section spacing="l" aria-labelledby="sg-colour">
        <SectionHead index={1}>
          <span id="sg-colour">{copy.sections.colour}</span>
        </SectionHead>
        <Swatches />
        <Text size={-1} tone="ink-2" className="mt-m">
          {copy.colourNote}
        </Text>
      </Section>

      <Section theme="ink" spacing="l" aria-label={`${copy.sections.colour}: theme-ink`}>
        <Eyebrow>.theme-ink</Eyebrow>
        <Heading as="h2" size={5} className="mt-s">
          {p.headingInk}, <em>{copy.sampleItalic}</em>.
        </Heading>
        <div className="mt-l">
          <Swatches theme="ink" />
        </div>
      </Section>

      {/* Type scale */}
      <Section spacing="l" aria-labelledby="sg-type">
        <SectionHead index={2}>
          <span id="sg-type">{copy.sections.type}</span>
        </SectionHead>
        <ol className="flex flex-col">
          {[...typeScale].reverse().map((t) => {
            const m = typeMetrics(t.step);
            return (
              <li key={t.step} className="grid-12 items-baseline gap-y-2xs py-s rule">
                <div className="col-span-12 md:col-span-3">
                  <p className="label">step-{t.step}</p>
                  <p className="label text-ink-2">
                    {t.minPx}px → {t.maxPx}px · lh {m.leading} · ls {m.tracking}
                  </p>
                </div>
                <p
                  className={`${stepClasses[t.step]} ${t.step >= 3 ? "font-display" : "font-sans"} col-span-12 max-w-none md:col-span-9`}
                >
                  {copy.sample}
                  {t.step >= 3 && (
                    <>
                      , <em>{copy.sampleItalic}</em>
                    </>
                  )}
                </p>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section spacing="l" aria-labelledby="sg-families">
        <SectionHead index={3}>
          <span id="sg-families">{copy.sections.families}</span>
        </SectionHead>
        <Grid rowGap="l">
          {copy.families.map((f, i) => (
            <div key={f.token} className="col-span-12 md:col-span-4">
              <p className="label text-ink-2">
                {f.token} · {f.name}
              </p>
              <p className={`${familyClasses[i]} mt-xs text-step-3`}>{f.sample}</p>
            </div>
          ))}
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <Text size={0}>{copy.paragraph}</Text>
          </div>
        </Grid>
      </Section>

      {/* Space */}
      <Section spacing="l" aria-labelledby="sg-space">
        <SectionHead index={4}>
          <span id="sg-space">{copy.sections.space}</span>
        </SectionHead>
        <ul className="flex flex-col gap-xs">
          {[
            ...spaceScale,
            { name: "gutter", minPx: 20, maxPx: 48, clamp: gutter },
            { name: "grid-gap", minPx: 12, maxPx: 32, clamp: gridGap },
          ].map((s) => (
            <li key={s.name} className="grid-12 items-center">
              <p className="col-span-6 label md:col-span-2">--space-{s.name}</p>
              <p className="col-span-6 label text-ink-2 md:col-span-3">
                {s.minPx}px → {s.maxPx}px
              </p>
              <div className="col-span-12 md:col-span-7">
                <div
                  className="h-xs bg-accent"
                  style={{ inlineSize: `var(--spacing-${s.name})` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Grid */}
      <Section spacing="l" aria-labelledby="sg-grid">
        <SectionHead index={5}>
          <span id="sg-grid">{copy.sections.grid}</span>
        </SectionHead>
        <Grid rowGap="s">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="col-span-1 bg-paper-2 py-s text-center label">
              {i + 1}
            </div>
          ))}
          <div className="col-span-12 bg-paper-2 p-s label md:col-span-8">col-span-8</div>
          <div className="col-span-12 bg-paper-2 p-s label md:col-span-4">col-span-4</div>
          <div className="col-span-12 bg-paper-2 p-s label md:col-span-6 md:col-start-4">
            col-start-4 · span-6
          </div>
        </Grid>
        <div className="breakout mt-m bg-paper-2 p-s label">.breakout</div>
        <div className="full-bleed mt-m">
          <Media src={placeholderLandscape} alt={p.imageAlt} sizes="100vw" aspect="cinema" grain />
          <p className="px-gutter pt-2xs label text-ink-2">
            .full-bleed + Media aspect=cinema grain
          </p>
        </div>
      </Section>

      {/* Motion */}
      <Section spacing="l" aria-labelledby="sg-motion">
        <SectionHead index={6}>
          <span id="sg-motion">{copy.sections.motion}</span>
        </SectionHead>
        <Grid rowGap="m">
          {easings.map((e) => (
            <div key={e.name} className="group col-span-12 md:col-span-6">
              <p className="label">{e.name}</p>
              <p className="label text-ink-2">{e.value}</p>
              <div className="mt-s pt-s rule">
                <div
                  className={`h-s w-s bg-accent transition-transform duration-slower ${e.className} group-hover:translate-x-[calc(100cqi-100%)]`}
                />
              </div>
            </div>
          ))}
          {durations.map((d) => (
            <div key={d.name} className="group col-span-6 md:col-span-3">
              <p className="label">
                {d.name} · {d.value}
              </p>
              <div className="mt-xs h-2xs bg-rule">
                <div
                  className={`h-2xs origin-left scale-x-0 bg-ink transition-transform ease-out-expo group-hover:scale-x-100 ${d.className}`}
                />
              </div>
            </div>
          ))}
        </Grid>
      </Section>

      {/* Primitives */}
      <Section spacing="l" aria-labelledby="sg-primitives">
        <SectionHead index={7}>
          <span id="sg-primitives">{copy.sections.primitives}</span>
        </SectionHead>
        <Grid rowGap="xl">
          <div className="col-span-12 md:col-span-4">
            <p className="label text-ink-2">Eyebrow</p>
            <Eyebrow index={1} className="mt-s">
              {p.eyebrow}
            </Eyebrow>
          </div>
          <div className="col-span-12 flex flex-wrap items-center gap-m md:col-span-8">
            <Button variant="primary" href="/styleguide#sg-primitives">
              {p.buttons.primary}
            </Button>
            <Button variant="ghost" arrow>
              {p.buttons.ghost}
            </Button>
            <Button href="/styleguide#sg-type">{p.buttons.text}</Button>
          </div>
          <div className="col-span-12 flex flex-wrap gap-m md:col-span-8 md:col-start-5">
            <Link href="/styleguide">{p.links.internal}</Link>
            <Link href="https://www.rics.org">{p.links.external}</Link>
            <Link href="/styleguide" underline="rest">
              {p.links.rest}
            </Link>
          </div>
          <div className="col-span-12">
            <p className="label text-ink-2">Rule</p>
            <Rule className="mt-s" />
            <Rule tone="ink" className="mt-s" />
            <Rule tone="accent" className="mt-s" />
          </div>
          <div className="col-span-12 md:col-span-7">
            <Media
              src={placeholderLandscape}
              alt={p.imageAlt}
              sizes="(min-width: 768px) 58vw, 100vw"
              aspect="landscape"
              caption={p.caption}
              grain
            />
          </div>
          <div className="col-span-8 md:col-span-4 md:col-start-9">
            <Media
              src={placeholderPortrait}
              alt={p.portraitAlt}
              sizes="(min-width: 768px) 33vw, 66vw"
              aspect="portrait"
              mono
            />
          </div>
        </Grid>
      </Section>
      <Container className="pb-2xl">
        <Rule />
      </Container>
    </>
  );
}
