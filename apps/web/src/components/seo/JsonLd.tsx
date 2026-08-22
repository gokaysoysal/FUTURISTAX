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
