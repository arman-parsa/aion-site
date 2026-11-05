import type { Metadata } from "next";
import { OfficeStatus } from "@/components/layout/OfficeStatus";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { Grid, Link, Section } from "@/components/ui";
import { getPage, getSiteSettings, getUiStrings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { submitContact } from "./actions";

const page = getPage("contact");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.seo.description,
  path: "/contact",
});

export default function ContactPage() {
  const site = getSiteSettings();
  const ui = getUiStrings();
  const c = ui.contact;
  const office = site.offices[0];

  return (
    <Section spacing="none" className="pt-page-top pb-3xl" data-hide-footer-cta>
      <Grid rowGap="2xl" className="items-start">
        <div className="col-span-12 lg:col-span-6">
          {page.eyebrow && <p className="label text-ink-2">{page.eyebrow}</p>}
          <h1 className="mt-s font-display text-step-8">{page.title}</h1>

          <h2 className="mt-2xl label text-ink-2">{c.directHeading}</h2>
          <dl className="mt-s rule-b">
            <div className="py-s rule">
              <dt className="label text-ink-2">{c.email}</dt>
              <dd className="mt-3xs text-step-2 wrap-anywhere">
                <Link href={`mailto:${site.contact.email}`} underline="rest">
                  {site.contact.email}
                </Link>
              </dd>
            </div>
            <div className="py-s rule">
              <dt className="label text-ink-2">{c.phone}</dt>
              <dd className="mt-3xs text-step-2">
                {site.contact.phoneHref ? (
                  <Link href={`tel:${site.contact.phoneHref}`} underline="rest">
                    {site.contact.phone}
                  </Link>
                ) : (
                  site.contact.phone
                )}
              </dd>
            </div>
            {office && (
              <div className="py-s rule">
                <dt className="label text-ink-2">{c.office}</dt>
                <dd className="mt-3xs text-step-1">
                  <address className="not-italic">
                    {office.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                  </address>
                  <div className="mt-s">
                    <OfficeStatus
                      hours={site.officeHours}
                      label={ui.footer.officeHours}
                      open={ui.footer.open}
                      closed={ui.footer.closed}
                    />
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <ContactForm
            action={submitContact}
            copy={c}
            privacyHref="/privacy"
            turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          />
        </div>
      </Grid>
    </Section>
  );
}
