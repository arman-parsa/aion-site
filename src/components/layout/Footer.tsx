import { Arrow, Container, Link, Rule } from "@/components/ui";
import { getUiStrings, getNavigation, getSiteSettings } from "@/lib/content";
import { CopyrightYear } from "./CopyrightYear";
import { OfficeStatus } from "./OfficeStatus";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="col-span-6 md:col-span-3">
      <h2 className="label text-ink-2">{title}</h2>
      <div className="mt-s text-step-0 wrap-anywhere">{children}</div>
    </div>
  );
}

export function Footer() {
  const copy = getUiStrings().footer;
  const site = getSiteSettings();
  const nav = getNavigation();

  return (
    <footer id="site-footer" className="theme-ink pt-3xl pb-m">
      <Container>
        <Link href={copy.ctaHref} underline="none" className="group block font-display text-step-8">
          <span className="link-underline">{copy.cta}</span>{" "}
          <Arrow className="align-baseline text-step-5" />
        </Link>

        <Rule className="mt-2xl" />

        <div className="mt-l grid-12 gap-y-xl">
          <Column title={copy.columns.navigation}>
            <ul className="flex flex-col gap-2xs">
              {nav.primary.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </Column>
          <Column title={copy.columns.contact}>
            <ul className="flex flex-col gap-2xs">
              <li>
                <Link href={`mailto:${site.contact.email}`}>{site.contact.email}</Link>
              </li>
              <li>
                {site.contact.phoneHref ? (
                  <Link href={`tel:${site.contact.phoneHref}`}>{site.contact.phone}</Link>
                ) : (
                  site.contact.phone
                )}
              </li>
              {site.contact.linkedin && (
                <li>
                  <Link href={site.contact.linkedin}>LinkedIn</Link>
                </li>
              )}
            </ul>
          </Column>
          <Column title={copy.columns.offices}>
            {site.offices.map((office) => (
              <address key={office.name} className="not-italic">
                <span className="block label text-ink-2">{office.name}</span>
                {office.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            ))}
            <div className="mt-s">
              <OfficeStatus
                hours={site.officeHours}
                label={copy.officeHours}
                open={copy.open}
                closed={copy.closed}
              />
            </div>
          </Column>
          <Column title={copy.columns.legal}>
            <ul className="flex flex-col gap-2xs">
              {nav.legal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </Column>
        </div>

        <Rule className="mt-2xl" />

        <div className="mt-s flex flex-wrap items-baseline justify-between gap-x-m gap-y-2xs label text-ink-2">
          <p className="max-w-none">
            © {site.legalName} <CopyrightYear /> · {copy.companyNo} {site.company.number} ·{" "}
            {copy.registeredOffice}: {site.company.registeredOffice}
          </p>
          <a href="#top" className="group link-underline text-ink">
            {copy.backToTop} <Arrow direction="up" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
