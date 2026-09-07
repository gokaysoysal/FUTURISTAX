import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { ContentSections } from '@/components/content/ContentSections';
import { PageHero } from '@/components/content/PageHero';
import { RelatedContent, type RelatedItem } from '@/components/content/RelatedContent';
import { RequestCta } from '@/components/content/RequestCta';
import { Reveal } from '@/components/motion/Reveal';
import { ArticleJsonLd } from '@/components/seo/JsonLd';
import { LEGISLATION_CATEGORY_LABELS, getArticle, getService } from '@/lib/data';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/* Dinamik render (next-intl). Bilinmeyen slug notFound(). */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const canonical = `/mevzuat/${article.slug}`;
  return {
    title: article.seo.title,
    description: article.seo.description,
    keywords: article.seo.keywords ? [...article.seo.keywords] : undefined,
    alternates: { canonical },
    openGraph: {
      title: article.seo.title,
      description: article.seo.description,
      url: canonical,
      type: 'article',
    },
  };
}

export default async function LegislationArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const canonical = `/mevzuat/${article.slug}`;

  const relatedArticles: RelatedItem[] = article.relatedArticleSlugs
    .map((s) => getArticle(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => ({ slug: a.slug, title: a.title, summary: a.summary }));

  const relatedServices: RelatedItem[] = article.relatedServiceSlugs
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({ slug: s.slug, title: s.title, summary: s.summary }));

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <ArticleJsonLd
        headline={article.title}
        description={article.seo.description}
        path={canonical}
        datePublished={article.publishedAt}
        dateModified={article.updatedAt}
      />
      <PageHero
        eyebrow={`Mevzuat · ${LEGISLATION_CATEGORY_LABELS[article.category]}`}
        title={article.title}
        backdrop="document-grid"
        breadcrumbs={
          <Breadcrumbs
            trail={[
              { name: 'Mevzuat', path: '/mevzuat' },
              { name: article.title, path: canonical },
            ]}
          />
        }
        lead={article.summary}
      />

      <Reveal className="mt-12">
        <ContentSections sections={article.sections} />
      </Reveal>

      <p className="mt-10 border-l-2 border-[var(--color-rule-strong)] bg-[var(--color-surface)] px-4 py-3 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
        Bu yazı genel bilgilendirme amaçlıdır, resmî duyuru veya mali müşavirlik hizmeti yerine
        geçmez. Somut oran, tutar ve son tarihler için resmî kaynaklara ve danışmanınıza başvurun.
        İçerik firma tarafından gözden geçirilmektedir.
      </p>

      {relatedArticles.length > 0 ? (
        <div className="mt-12">
          <div className="ledger-rule pb-3">
            <p className="basis-ref uppercase">İlgili yazılar</p>
          </div>
          <ul className="mt-4 space-y-2">
            {relatedArticles.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/mevzuat/${item.slug}`}
                  className="text-[length:var(--text-sm)] text-[var(--color-ink)] hover:text-[var(--color-ink-strong)]"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-12">
        <RelatedContent title="İlgili hizmetler" basePath="/hizmetler" items={relatedServices} />
      </div>

      <div className="mt-12">
        <RequestCta />
      </div>
    </div>
  );
}
