import Link from 'next/link';

export interface RelatedItem {
  slug: string;
  title: string;
  summary: string;
}

/**
 * İlgili hizmet/sektör bağlantıları. Ana sayfadaki hizmet ızgarasıyla aynı
 * defter-çizgisi düzenini kullanır (gap-px + rule zemin).
 */
export function RelatedContent({
  title,
  basePath,
  items,
}: {
  title: string;
  basePath: '/hizmetler' | '/sektorler';
  items: readonly RelatedItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section aria-label={title}>
      <div className="ledger-rule pb-3">
        <p className="basis-ref uppercase">{title}</p>
      </div>
      <ul className="mt-5 grid gap-px bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug} className="bg-[var(--color-canvas)]">
            <Link
              href={`${basePath}/${item.slug}`}
              className="block h-full p-5 transition-colors hover:bg-[var(--color-surface)]"
            >
              <h3 className="text-[length:var(--text-base)] text-[var(--color-text)]">
                {item.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
                {item.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
