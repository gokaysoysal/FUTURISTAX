import { Reveal } from '@/components/motion/Reveal';
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
      <Reveal>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`${basePath}/${item.slug}`}
                className="card card-interactive surface-glow block h-full p-5"
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
      </Reveal>
    </section>
  );
}
