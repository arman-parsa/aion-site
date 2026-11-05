import { Heading, Section } from "@/components/ui";
import { getPage } from "@/lib/content";

export default function HomePage() {
  const page = getPage("home");
  return (
    <Section spacing="none" className="grid min-h-dvh items-center">
      <Heading as="h1" size={6}>
        {page.title}
      </Heading>
    </Section>
  );
}
