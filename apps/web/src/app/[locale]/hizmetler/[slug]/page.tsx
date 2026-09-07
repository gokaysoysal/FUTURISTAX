import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { ContentSections } from '@/components/content/ContentSections';
import { FaqSection } from '@/components/content/FaqSection';
import { RelatedContent, type RelatedItem } from '@/components/content/RelatedContent';
import { RequestCta } from '@/components/content/RequestCta';
import { ServiceJsonLd } from '@/components/seo/JsonLd';
import { getSector, getService } from '@/lib/data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/*
 * Bu rota dinamik render edilir. Diğer tüm sayfalar gibi: next-intl'in Server
 * Component API'leri şu an dinamik render'a zorluyor (bkz. build hatası
 * "opts into dynamic rendering"). Statik üretim setRequestLocale ile mümkün
 * ama bu tüm sayfaları kapsayan ayrı bir iştir. Bilinmeyen slug notFound() ile
 * 404 döner.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const canonical = `/hizmetler/${service.slug}`;
  return {
    title: service.seo.title,
    description: service.seo.description,
    keywords: service.seo.keywords ? [...service.seo.keywords] : undefined,
    alternates: { canonical },
    openGraph: {
      title: service.seo.title,
      description: service.seo.description,
      url: canonical,
      type: 'article',
    },
  };
}

function toRelated(slugs: readonly string[], kind: 'service' | 'sector'): RelatedItem[] {
  const lookup = kind === 'service' ? getService : getSector;
  return slugs
    .map((slug) => lookup(slug))
    .filter((record): record is NonNullable<typeof record> => Boolean(record))
    .map((record) => ({ slug: record.slug, title: record.title, summary: record.summary }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const canonical = `/hizmetler/${service.slug}`;

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <ServiceJsonLd name={service.title} description={service.seo.description} path={canonical} />
      <Breadcrumbs
        trail={[
          { name: 'Hizmetler', path: '/hizmetler' },
          { name: service.title, path: canonical },
        ]}
      />

      <header className="ledger-rule mt-6 pb-4">
        <p className="basis-ref uppercase">Hizmet</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">{service.title}</h1>
      </header>

      <p className="mt-6 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
        {service.summary}
      </p>

      <div className="mt-12">
        <ContentSections sections={service.sections} />
      </div>

      <div className="mt-14">
        <FaqSection items={service.faqs} />
      </div>

      <div className="mt-14 space-y-12">
        <RelatedContent
          title="İlgili hizmetler"
          basePath="/hizmetler"
          items={toRelated(service.relatedServiceSlugs, 'service')}
        />
        <RelatedContent
          title="Öne çıktığı sektörler"
          basePath="/sektorler"
          items={toRelated(service.relatedSectorSlugs, 'sector')}
        />
      </div>

      <p className="mt-10 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
        Bu sayfadaki açıklamalar genel bilgilendirme amaçlıdır ve mali müşavirlik hizmeti yerine
        geçmez. İçerik firma tarafından gözden geçirilmektedir.
      </p>

      <div className="mt-10">
        <RequestCta />
      </div>
    </div>
  );
}
