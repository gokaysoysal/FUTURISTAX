import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { ContentSections } from '@/components/content/ContentSections';
import { FaqSection } from '@/components/content/FaqSection';
import { PageHero } from '@/components/content/PageHero';
import { RelatedContent, type RelatedItem } from '@/components/content/RelatedContent';
import { RequestCta } from '@/components/content/RequestCta';
import { Reveal } from '@/components/motion/Reveal';
import { ServiceJsonLd } from '@/components/seo/JsonLd';
import { getSector, getService } from '@/lib/data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/*
 * Bu rota dinamik render edilir (next-intl Server Component API'leri dinamik
 * render'a zorluyor). Bilinmeyen slug notFound() ile 404 döner.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) return {};

  const canonical = `/sektorler/${sector.slug}`;
  return {
    title: sector.seo.title,
    description: sector.seo.description,
    keywords: sector.seo.keywords ? [...sector.seo.keywords] : undefined,
    alternates: { canonical },
    openGraph: {
      title: sector.seo.title,
      description: sector.seo.description,
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

export default async function SectorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const canonical = `/sektorler/${sector.slug}`;

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <ServiceJsonLd name={sector.title} description={sector.seo.description} path={canonical} />
      <PageHero
        eyebrow="Sektör"
        title={sector.title}
        backdrop="concrete"
        breadcrumbs={
          <Breadcrumbs
            trail={[
              { name: 'Sektörler', path: '/sektorler' },
              { name: sector.title, path: canonical },
            ]}
          />
        }
        lead={sector.summary}
      />

      <Reveal className="mt-12">
        <ContentSections sections={sector.sections} />
      </Reveal>

      <div className="mt-14">
        <FaqSection items={sector.faqs} />
      </div>

      <div className="mt-14 space-y-12">
        <RelatedContent
          title="Bu sektörde öne çıkan hizmetler"
          basePath="/hizmetler"
          items={toRelated(sector.relatedServiceSlugs, 'service')}
        />
        <RelatedContent
          title="İlgili sektörler"
          basePath="/sektorler"
          items={toRelated(sector.relatedSectorSlugs, 'sector')}
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
