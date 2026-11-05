import { Button, Section } from "@/components/ui";
import { getNavigation, getPage, getUiStrings } from "@/lib/content";
import { PageIntro } from "./PageIntro";

export function NotFoundContent() {
  const page = getPage("notFound");
  const ui = getUiStrings();
  const nav = getNavigation();
  return (
    <>
      <PageIntro eyebrow={page.eyebrow} title={page.title} intro={page.intro} />
      <Section spacing="none" className="pb-3xl" aria-label={ui.notFound.links}>
        <ul className="flex flex-wrap gap-x-l gap-y-s">
          <li>
            <Button href="/">{ui.notFound.home}</Button>
          </li>
          {nav.primary.map((item) => (
            <li key={item.href}>
              <Button href={item.href}>{item.label}</Button>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
