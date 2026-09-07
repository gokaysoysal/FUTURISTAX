import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Link from 'next/link';

export interface Crumb {
  name: string;
  /** Kök göreli yol, örn. /hizmetler/vergi-danismanligi */
  path: string;
}

/**
 * Görünür kırıntı navigasyonu + BreadcrumbList JSON-LD.
 *
 * "Ana sayfa" ilk basamak olarak otomatik eklenir; `trail` yalnızca sonraki
 * basamakları taşır. Son basamak bağlantı değildir (aria-current="page").
 */
export function Breadcrumbs({ trail }: { trail: readonly Crumb[] }) {
  const full: Crumb[] = [{ name: 'Ana sayfa', path: '/' }, ...trail];

  return (
    <>
      <BreadcrumbJsonLd trail={full} />
      <nav aria-label="Kırıntı navigasyonu">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          {full.map((crumb, index) => {
            const last = index === full.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-x-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {last ? (
                  <span aria-current="page" className="text-[var(--color-text-secondary)]">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.path} className="link-underline hover:text-[var(--color-text)]">
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
