'use client';

import { fadeIn } from '@/lib/motion';
import { TOOLS, getTool } from '@/lib/tools';
import { site } from '@futuristax/config';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { type ComponentType, useCallback, useEffect, useState } from 'react';
import { CorporateTaxCalculator } from './CorporateTaxCalculator';
import { CurrencyConverter } from './CurrencyConverter';
import { IncomeTaxCalculator } from './IncomeTaxCalculator';
import { InflationCalculator } from './InflationCalculator';
import { PayrollCostCalculator } from './PayrollCostCalculator';
import { RentExpenseCalculator } from './RentExpenseCalculator';
import { SeveranceCalculator } from './SeveranceCalculator';
import { ToolSelector } from './ToolSelector';
import { VatCalculator } from './VatCalculator';
import { VehicleExpenseCalculator } from './VehicleExpenseCalculator';

/**
 * ARAÇLAR ÇALIŞMA ALANI — dokuz hesaplayıcı tek yüzeyde.
 *
 * - Üstte `ToolSelector` (tablist); araç değişince panel akışkan geçiş yapar
 *   (`prefers-reduced-motion`: anında).
 * - HER ARAÇ BAĞIMSIZ: kendi girdi alanları, kendi sonuç dökümü, kendi gerçek
 *   sonucunu gösteren grafiği (LedgerChart). Yıl seçici ve UnverifiedRatesNotice
 *   her aracın kendi içinde.
 * - Her aracın kendi URL'i var: seçim `history.pushState` ile `/araclar/[slug]`'a
 *   yazılır, geri/ileri düğmesi (`popstate`) senkronlanır — derin link + paylaşım.
 * - HowTo ve SSS içeriği aktif araca göre burada (istemci) render edilir ki
 *   araç değişince güncellensin; ilk sunucu render'ı SEO için doğru araçla gelir.
 */
const MAP: Record<string, ComponentType> = {
  kdv: VatCalculator,
  'gelir-vergisi': IncomeTaxCalculator,
  'kurumlar-vergisi': CorporateTaxCalculator,
  'binek-arac-gider-kisiti': VehicleExpenseCalculator,
  'binek-arac-kira-siniri': RentExpenseCalculator,
  'sgk-isveren-maliyeti': PayrollCostCalculator,
  'kidem-tazminati': SeveranceCalculator,
  'tufe-guncelleme': InflationCalculator,
  'kur-cevirici': CurrencyConverter,
};

const FALLBACK_SLUG = TOOLS[0]?.slug ?? 'kdv';

const slugFromPath = (path: string): string | null => {
  const match = path.match(/\/araclar\/([^/?#]+)/);
  return match?.[1] ?? null;
};

export function ToolWorkspace({ initialSlug }: { initialSlug: string }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [active, setActive] = useState(() => (MAP[initialSlug] ? initialSlug : FALLBACK_SLUG));

  const select = useCallback(
    (slug: string) => {
      if (!MAP[slug] || slug === active) return;
      setActive(slug);
      const base = (pathname ?? '/araclar').replace(/\/araclar(\/[^/?#]+)?.*$/, '/araclar');
      window.history.pushState(null, '', `${base}/${slug}`);
    },
    [active, pathname],
  );

  useEffect(() => {
    const sync = () => {
      const slug = slugFromPath(window.location.pathname);
      setActive(slug && MAP[slug] ? slug : FALLBACK_SLUG);
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  const tool = getTool(active);
  const Calculator = MAP[active] ?? VatCalculator;

  return (
    <div>
      <ToolSelector tools={TOOLS} active={active} onSelect={select} />

      <div
        id="tool-panel"
        role="tabpanel"
        aria-labelledby={`tool-tab-${active}`}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: APG tabpanel deseni — panel odaklanabilir olmalı ki sekmeden sonra klavye kullanıcısı içeriğe geçebilsin
        tabIndex={0}
        className="mt-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
      >
        {tool ? (
          <header className="ledger-rule pb-4">
            <p className="basis-ref uppercase">Araç · {tool.basis}</p>
            <h2 className="mt-1 text-[length:var(--text-2xl)] text-[var(--color-text)]">
              {tool.title}
            </h2>
            <p className="mt-3 max-w-prose text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
              {tool.intro}
            </p>
          </header>
        ) : null}

        <div className="mt-8">
          {reduce ? (
            <Calculator key={active} />
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                variants={fadeIn}
                initial="hidden"
                animate="shown"
                exit="hidden"
              >
                <Calculator />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {tool ? (
          <div className="mt-14 space-y-14">
            <section aria-label="Nasıl kullanılır">
              <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">
                Nasıl kullanılır
              </h3>
              <ol className="mt-5 space-y-3">
                {tool.howTo.steps.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]"
                  >
                    <span
                      aria-hidden="true"
                      className="basis-ref shrink-0 pt-0.5 tabular-nums text-[var(--color-text-muted)]"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {tool.faqs.length > 0 ? (
              <section aria-label="Sık sorulan sorular">
                <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">
                  Sık sorulan sorular
                </h3>
                <dl className="mt-5 divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
                  {tool.faqs.map((item) => (
                    <div key={item.question} className="py-4">
                      <dt className="text-[length:var(--text-sm)] font-medium text-[var(--color-text)]">
                        {item.question}
                      </dt>
                      <dd className="mt-2 max-w-prose text-[length:var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
                        {item.answer}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <p className="text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
              {site.disclaimers.calculator.tr}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
