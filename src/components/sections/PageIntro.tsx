import { Eyebrow, Heading, Section, Text } from "@/components/ui";

type Props = { eyebrow?: string; title: string; intro?: string };

/** Standard page opening: eyebrow, the page's single h1, optional lede. */
export function PageIntro({ eyebrow, title, intro }: Props) {
  return (
    <Section spacing="none" className="pt-page-top pb-2xl">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading as="h1" size={7} className="mt-s">
        {title}
      </Heading>
      {intro && (
        <Text size={2} tone="ink-2" className="mt-m">
          {intro}
        </Text>
      )}
    </Section>
  );
}
