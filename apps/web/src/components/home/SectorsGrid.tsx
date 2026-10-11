import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { SECTORS } from '@/lib/data';
import Link from 'next/link';

/**
 * Sektörler — ızgara, hover'da derinlik.
 *
 * Kartlar `card-interactive` (depth.css): hover'da yükselir + kenar parıltısı,
 * reduced-motion altında yalnızca kenarlık değişir. Tab ile tam gezilir;
 * her kart tek bir bağlantı (tuzak yok).
 */
export function SectorsGrid() {
  return (
    <RevealGroup className="grid gap-px bg-[var(--color-rule)] sm:grid-cols-2 lg:grid-cols-3">
      {SECTORS.map((sector) => (
        <RevealItem key={sector.slug} className="bg-[var(--color-canvas)]">
          <Link
            href={`/sektorler/${sector.slug}`}
            className="card card-interactive surface-glow flex h-full flex-col gap-3 p-6"
          >
            <span className="basis-ref">{String(sector.order).padStart(2, '0')}</span>
            <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">
              {sector.shortTitle ?? sector.title}
            </h3>
            <p className="line-clamp-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
              {sector.summary}
            </p>
            <span className="mt-auto pt-2 text-[length:var(--text-xs)] text-[var(--color-accent)]">
              Sektör notları
            </span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
