import type { Person, Service, SiteSettings } from "@/lib/content";
import { displayName } from "@/lib/content";

/** schema.org builders. Placeholder values ([bracketed]) are omitted. */
const real = (v: string | undefined) => (v && !/^\[.+\]$/.test(v) ? v : undefined);

export function organizationRef(site: SiteSettings) {
  return {
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
  };
}

export function serviceSchema(service: Service, site: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}/expertise/${service.slug}#service`,
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: `${site.url}/expertise/${service.slug}`,
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
    "@id": `${site.url}/people/${person.slug}#person`,
    name: person.name,
    honorificPrefix: person.prefix,
    honorificSuffix: person.honorifics.length ? person.honorifics.join(", ") : undefined,
    jobTitle: real(person.role),
    description: real(person.shortBio),
    url: `${site.url}/people/${person.slug}`,
    image: person.portrait.placeholder ? undefined : `${site.url}${person.portrait.src}`,
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
