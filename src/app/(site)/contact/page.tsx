import type { Metadata } from "next";
import { OfficeStatus } from "@/components/layout/OfficeStatus";
import { Reveal, SplitHeading } from "@/components/motion";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { Container, Link } from "@/components/ui";
import { getPage, getSiteSettings, getUiStrings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { submitContact } from "./actions";

const page = getPage("contact");

export const metadata: Metadata = buildMetadata({
  ...page,
  description: page.seo.description,
  path: "/contact",
});

/**
 * One screen, two columns split by a hairline: who to reach on the left, the
 * form on the right. No footer (the details are all here already).
 */
export default function ContactPage() {
  const site = getSiteSettings();
  const ui = getUiStrings();
  const c = ui.contact;
  const office = site.offices[0];

  return (
    <section aria-labelledby="contact-title" className="theme-paper">
      <Container>
        {/* Starts below the header so the dividing line never runs behind the nav. */}
        <div className="mt-header grid min-h-screen-below-header grid-cols-1 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-2xl pt-2xl pb-xl lg:border-e lg:border-solid lg:border-rule lg:pe-xl">
            <SplitHeading
              as="h1"
              id="contact-title"
              size={7}
              trigger="load"
              className="max-w-display"
            >
              {page.title}
            </SplitHeading>

            <Reveal className="flex flex-col gap-s text-step-1">
              {office && (
                <address className="not-italic">
                  {office.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              )}
              <div className="flex flex-col">
                {site.contact.phoneHref ? (
                  <Link
                    href={`tel:${site.contact.phoneHref}`}
                    underline="rest"
                    className="self-start"
                  >
                    {site.contact.phone}
                  </Link>
                ) : (
                  <span>{site.contact.phone}</span>
                )}
                <Link
                  href={`mailto:${site.contact.email}`}
                  underline="rest"
                  className="mt-2xs self-start wrap-anywhere"
                >
                  {site.contact.email}
                </Link>
              </div>
              <div className="mt-s">
                <OfficeStatus
                  hours={site.officeHours}
                  label={ui.footer.officeHours}
                  open={ui.footer.open}
                  closed={ui.footer.closed}
                />
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col justify-center pt-xl pb-xl lg:ps-xl lg:pt-2xl">
            <ContactForm
              action={submitContact}
              copy={{
                formHeading: c.formHeading,
                fields: c.fields,
                enquiryTypes: c.enquiryTypes,
                submit: c.submit,
                sending: c.sending,
                errors: {
                  name: c.errors.name,
                  email: c.errors.email,
                  enquiryType: c.errors.enquiryType,
                  messageShort: c.errors.messageShort,
                  messageLong: c.errors.messageLong,
                  consent: c.errors.consent,
                  summary: c.errors.summary,
                },
              }}
              privacyHref="/privacy"
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
