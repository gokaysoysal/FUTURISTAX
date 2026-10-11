import { TaxBurdenPanel } from '@/components/dashboards/TaxBurdenPanel';
import { Reveal } from '@/components/motion/Reveal';
import { TOOLS } from '@/lib/tools';
import Link from 'next/link';

/**
 * Araçlar vitrini — hesaplayıcı çalışma alanına canlı önizleme.
 *
 * Solda tüm araçların derin bağlantılı listesi (her biri `/araclar/[slug]`),
 * sağda gerçek veriyle çalışan Vergi Yükü Panosu — statik ekran görüntüsü
 * değil, canlı bileşen. Pano kendi `sr-only` tablo karşılığını ve
 * `UnverifiedRatesNotice`'ı taşır.
 */
export function ToolsShowcase() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start">
      <Reveal>
        <p className="text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
          Dokuz hesaplayıcı; her biri kendi girdisi, sonuç dökümü ve grafiğiyle. Hesap mantığı
          testli vergi motorundan gelir.
        </p>
        <ul className="mt-6 grid gap-px border-y border-[var(--color-rule)] bg-[var(--color-rule)]">
          {TOOLS.map((tool) => (
            <li key={tool.slug} className="bg-[var(--color-canvas)]">
              <Link
                href={`/araclar/${tool.slug}`}
                className="flex items-baseline justify-between gap-4 px-1 py-3 text-[length:var(--text-sm)] text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)]"
              >
                <span>{tool.short}</span>
                <span aria-hidden="true" className="text-[var(--color-accent)]">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/araclar"
          className="btn btn-ghost mt-6 inline-flex px-5 py-2.5 text-[length:var(--text-sm)]"
        >
          Tüm araçlar
        </Link>
      </Reveal>

      <Reveal delay={0.08} className="surface-glow">
        <TaxBurdenPanel />
      </Reveal>
    </div>
  );
}
