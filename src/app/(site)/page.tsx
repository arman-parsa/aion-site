import { Heading, Section } from "@/components/ui";
import { getHome } from "@/lib/content";

export default function HomePage() {
  const { placeholder } = getHome();
  return (
    <Section spacing="none" className="grid min-h-dvh items-center">
      <Heading as="h1" size={6}>
        {placeholder}
      </Heading>
    </Section>
  );
}
