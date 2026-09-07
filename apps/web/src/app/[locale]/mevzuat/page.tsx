import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { PageHero } from '@/components/content/PageHero';
import { RequestCta } from '@/components/content/RequestCta';
import { StatusPanel } from '@/components/ui/StatusPanel';
import {
  LEGISLATION_ARTICLES,
  LEGISLATION_CATEGORY_LABELS,
  type LegislationCategory,
} from '@/lib/data';
import { type OfficialAnnouncement, fetchOfficialAnnouncements } from '@/lib/fetchers/legislation';
import { formatIsoDate } from '@/lib/format';
import { CONTENT_IS_PLACEHOLDER } from '@futuristax/config';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mevzuat',
  description:
    'Vergi, SGK, teşvik ve raporlama konularında genel çerçeve yazıları ve resmî duyurular. ' +
    'Resmî duyurular yalnızca doğrulanan kaynaktan gösterilir.',
  alternates: { canonical: '/mevzuat' },
  openGraph: { title: 'Mevzuat', url: '/mevzuat', type: 'website' },
};

// Resmî besleme saatte bir yenilenir (ISR). Erişilemezse yedek üretilmez.
export const revalidate = 3600;

const CATEGORIES = Object.keys(LEGISLATION_CATEGORY_LABELS) as LegislationCategory[];

function isCategory(value: string | undefined): value is LegislationCategory {
  return value !== undefined && (CATEGORIES as string[]).includes(value);
}

export default async function LegislationHubPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const active = isCategory(kategori) ? kategori : null;

  const articles = active
    ? LEGISLATION_ARTICLES.filter((a) => a.category === active)
    : LEGISLATION_ARTICLES;

  let announcements: OfficialAnnouncement[] = [];
  let feedUnavailable = false;
  try {
    announcements = await fetchOfficialAnnouncements(8);
  } catch {
    feedUnavailable = true;
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <PageHero
        eyebrow="Mevzuat"
        title="Mevzuat merkezi"
        backdrop="document-grid"
        breadcrumbs={<Breadcrumbs trail={[{ name: 'Mevzuat', path: '/mevzuat' }]} />}
        lead="Aşağıdaki yazılar bir konunun genel çerçevesini anlatır; resmî duyuru değildir. Somut oran, tutar ve son tarihler için resmî kaynaklara ve danışmanınıza başvurun."
      />

      {CONTENT_IS_PLACEHOLDER ? (
        <p className="mt-8 border-l-2 border-[var(--color-rule-strong)] bg-[var(--color-surface)] px-4 py-3 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          Bu yazılar bir konunun genel çerçevesini anlatan editoryal taslaklardır — resmî duyuru,
          tebliğ ya da sirküler değildir. Firma gözden geçirmektedir.
        </p>
      ) : null}

      <nav aria-label="Kategori filtresi" className="mt-10 flex flex-wrap gap-2">
        <FilterChip href="/mevzuat" label="Tümü" active={active === null} />
        {CATEGORIES.map((category) => (
          <FilterChip
            key={category}
            href={`/mevzuat?kategori=${category}`}
            label={LEGISLATION_CATEGORY_LABELS[category]}
            active={active === category}
          />
        ))}
      </nav>

      <ul className="mt-8 divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
        {articles.map((article) => (
          <li key={article.slug} className="py-5">
            <p className="basis-ref uppercase">{LEGISLATION_CATEGORY_LABELS[article.category]}</p>
            <h2 className="mt-1 text-[length:var(--text-lg)]">
              <Link
                href={`/mevzuat/${article.slug}`}
                className="text-[var(--color-text)] hover:text-[var(--color-ink)]"
              >
                {article.title}
              </Link>
            </h2>
            <p className="mt-1.5 max-w-prose text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
              {article.summary}
            </p>
          </li>
        ))}
      </ul>

      <section aria-labelledby="official-feed" className="mt-14">
        <div className="ledger-rule pb-3">
          <p className="basis-ref uppercase">Resmî duyurular</p>
          <h2 id="official-feed" className="mt-1 text-[length:var(--text-xl)]">
            Resmî Gazete / GİB
          </h2>
        </div>

        {feedUnavailable ? (
          <div className="mt-5">
            <StatusPanel tone="error" label="Besleme" title="Resmî duyurular şu an güncellenemiyor">
              Doğrulanmış bir kaynaktan veri alınamadığı için burada duyuru göstermiyoruz — gerçek
              olmayan bir içerik üretmektense boş bırakmayı tercih ediyoruz.
            </StatusPanel>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
            {announcements.map((item) => (
              <li
                key={item.url}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="max-w-prose text-[length:var(--text-sm)] text-[var(--color-ink)] hover:text-[var(--color-ink-strong)]"
                >
                  {item.title}
                </a>
                {item.date ? (
                  <time dateTime={item.date} className="basis-ref shrink-0">
                    {formatIsoDate(item.date)}
                  </time>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <p className="basis-ref mt-3">
          Bağlantılar dış kaynağa gider. İçerik ilgili kurumun sorumluluğundadır.
        </p>
      </section>

      <div className="mt-14">
        <RequestCta />
      </div>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`border px-3 py-1.5 text-[length:var(--text-xs)] transition-colors ${
        active
          ? 'border-[var(--color-ink)] bg-[var(--color-ink-soft)] text-[var(--color-text)]'
          : 'border-[var(--color-rule)] text-[var(--color-text-secondary)] hover:border-[var(--color-rule-strong)]'
      }`}
    >
      {label}
    </Link>
  );
}
