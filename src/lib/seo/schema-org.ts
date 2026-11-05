import type { Person, Service, SiteSettings } from "@/lib/content";
import { displayName, getPerson, getServices } from "@/lib/content";
import { siteUrl } from "./site-url";

/** schema.org builders. Placeholder values ([bracketed]) are always omitted. */
const real = (v: string | undefined) => (v && !/^\[.+\]$/.test(v) ? v : undefined);
const realList = (vs: readonly string[]) => vs.filter((v) => real(v));

export function organizationRef(site: SiteSettings) {
  return {
    "@type": "ProfessionalService",
    "@id": `${siteUrl()}/#organization`,
    name: site.name,
    url: siteUrl(),
  };
}

/** Organization + ProfessionalService for the home page. */
export function organizationSchema(site: SiteSettings) {
  const office = site.offices[0];
  const lines = office ? realList(office.lines) : [];
  const founders = site.founders.map((slug) => getPerson(slug)).filter((p) => p !== undefined);
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${siteUrl()}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: siteUrl(),
    logo: `${siteUrl()}/icons/icon-512.png`,
    description: site.seo.description,
    email: real(site.contact.email),
    telephone: site.contact.phoneHref || undefined,
    address: lines.length
      ? { "@type": "PostalAddress", streetAddress: lines.join(", "), addressCountry: "GB" }
      : undefined,
    founder: founders.length
      ? founders.map((p) => ({
          "@type": "Person",
          "@id": `${siteUrl()}/people/${p.slug}#person`,
          name: displayName(p),
        }))
      : undefined,
    areaServed: site.areaServed.length
      ? site.areaServed.map((name) => ({ "@type": "Place", name }))
      : undefined,
    knowsAbout: getServices().flatMap((s) => [s.title, ...s.methods.map((m) => m.title)]),
    sameAs: site.contact.linkedin ? [site.contact.linkedin] : undefined,
    identifier: real(site.company.number)
      ? { "@type": "PropertyValue", propertyID: "Companies House", value: site.company.number }
      : undefined,
  };
}

export function serviceSchema(service: Service, site: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl()}/expertise/${service.slug}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: `${siteUrl()}/expertise/${service.slug}`,
    provider: organizationRef(site),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.title,
      itemListElement: service.methods.map((m) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: m.title },
      })),
    },
  };
}

export function personSchema(person: Person, site: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl()}/people/${person.slug}#person`,
    name: person.name,
    honorificPrefix: person.prefix,
    honorificSuffix: person.honorifics.length ? person.honorifics.join(", ") : undefined,
    jobTitle: real(person.role),
    description: real(person.shortBio),
    url: `${siteUrl()}/people/${person.slug}`,
    image: person.portrait.placeholder ? undefined : `${siteUrl()}${person.portrait.src}`,
    alumniOf: person.alumniOf.length
      ? person.alumniOf.map((name) => ({ "@type": "EducationalOrganization", name }))
      : undefined,
    affiliation: person.affiliations.length
      ? person.affiliations.map((a) => ({ "@type": "Organization", name: a.name, url: a.url }))
      : undefined,
    worksFor: organizationRef(site),
    alternateName: displayName(person),
  };
}
