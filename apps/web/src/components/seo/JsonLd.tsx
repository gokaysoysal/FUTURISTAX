import { site } from '@futuristax/config';

/**
 * Yapılandırılmış veri. Eski sitede hiç yoktu.
 * Google'ın firmayı yerel bir profesyonel hizmet sağlayıcı olarak tanıması için gerekli.
 */

function Script({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Veri kendi sabitlerimizden gelir, kullanıcı girdisi içermez.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${site.urls.production}/#organization`,
        name: site.brand.name,
        description: site.brand.tagline.tr,
        url: site.urls.production,
        email: site.contact.email,
        telephone: site.contact.phoneE164,
        foundingDate: String(site.brand.foundedYear),
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.contact.address.street,
          addressLocality: site.contact.address.district,
          addressRegion: site.contact.address.city,
          postalCode: site.contact.address.postalCode,
          addressCountry: site.contact.address.country,
        },
        founder: { '@type': 'Person', name: site.founder.name, jobTitle: site.founder.title.tr },
        areaServed: { '@type': 'Country', name: 'Türkiye' },
        knowsLanguage: ['tr', 'en'],
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        name,
        description,
        serviceType: name,
        url: `${site.urls.production}${path}`,
        provider: {
          '@type': 'ProfessionalService',
          '@id': `${site.urls.production}/#organization`,
          name: site.brand.name,
        },
        areaServed: { '@type': 'Country', name: 'Türkiye' },
        availableLanguage: ['tr', 'en'],
      }}
    />
  );
}

export function HowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description?: string;
  steps: readonly string[];
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name,
        ...(description ? { description } : {}),
        step: steps.map((text, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          text,
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  headline,
  description,
  path,
  datePublished,
  dateModified,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline,
        description,
        url: `${site.urls.production}${path}`,
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        publisher: {
          '@type': 'Organization',
          '@id': `${site.urls.production}/#organization`,
          name: site.brand.name,
        },
        author: { '@type': 'Organization', name: site.brand.name },
        inLanguage: 'tr',
      }}
    />
  );
}

export function BreadcrumbJsonLd({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <Script
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${site.urls.production}${crumb.path}`,
        })),
      }}
    />
  );
}
