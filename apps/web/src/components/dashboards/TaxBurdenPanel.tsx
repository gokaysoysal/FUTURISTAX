'use client';

import { Counter } from '@/components/motion/Counter';
import { SkeletonText } from '@/components/ui/Skeleton';
import { UnverifiedRatesNotice } from '@/components/ui/UnverifiedRatesNotice';
import { type BurdenInput, computeBurden } from '@/lib/charts/burden';
import { formatCurrency, formatPercent } from '@/lib/format';
import { site } from '@futuristax/config';
import { DEFAULT_YEAR } from '@futuristax/tax-engine';
import dynamic from 'next/dynamic';
import { useId, useMemo, useState } from 'react';

/**
 * Vergi Yükü Panosu — ana sayfa etkileşimli bileşeni.
 *
 * Kullanıcı ciro, kâr, ortalama brüt ücret ve çalışan sayısını girer;
 * kurumlar vergisi + KDV + SGK yükünü dağılım ve yıl içi kümülatif olarak
 * görür. Hesap tümüyle `@futuristax/tax-engine` + `lib/charts/burden` (saf).
 *
 * Erişilebilirlik:
 * - Girdiler native range+number; klavyeyle tam çalışır.
 * - Grafik tembel yüklenir ve `aria-hidden`; VERİ KARŞILIĞI sr-only tablodur,
 *   her zaman DOM'da (yükleme içeriği geciktirmez).
 * - Doğrulanmamış yıl için UnverifiedRatesNotice görünür.
 */

const Charts = dynamic(
  () => import('./TaxBurdenCharts').then((m) => m.TaxBurdenCharts),
  { ssr: false, loading: () => <SkeletonText lines={4} className="sm:col-span-2" /> },
);

const FIELDS = [
  { key: 'revenue', label: 'Yıllık ciro', min: 0, max: 50_000_000, step: 250_000 },
  { key: 'profit', label: 'Yıllık ticari kâr', min: 0, max: 15_000_000, step: 100_000 },
  { key: 'avgGross', label: 'Ortalama aylık brüt ücret', min: 0, max: 300_000, step: 5_000 },
  { key: 'headcount', label: 'Çalışan sayısı', min: 0, max: 500, step: 1 },
] as const;

const DEFAULTS: Omit<BurdenInput, 'year'> = {
  revenue: 6_000_000,
  profit: 900_000,
  avgGross: 45_000,
  headcount: 8,
};

export function TaxBurdenPanel() {
  const [values, setValues] = useState<Omit<BurdenInput, 'year'>>(DEFAULTS);
  const groupId = useId();

  const result = useMemo(
    () => computeBurden({ ...values, year: DEFAULT_YEAR }),
    [values],
  );

  const set = (key: keyof typeof DEFAULTS, raw: number) => {
    const clean = Number.isFinite(raw) ? Math.max(0, raw) : 0;
    setValues((prev) => ({ ...prev, [key]: clean }));
  };

  return (
    <section
      aria-labelledby={`${groupId}-title`}
      className="card surface-glow overflow-hidden p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={`${groupId}-title`} className="text-[length:var(--text-xl)]">
          Vergi Yükü Panosu
        </h2>
        <p className="basis-ref">Kurumlar vergisi · KDV · SGK · {DEFAULT_YEAR}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const id = `${groupId}-${field.key}`;
          const value = values[field.key];
          return (
            <div key={field.key}>
              <label
                htmlFor={id}
                className="flex items-baseline justify-between gap-2 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]"
              >
                <span>{field.label}</span>
                <span data-numeric className="text-[var(--color-text)]">
                  {field.key === 'headcount' ? value : formatCurrency(value)}
                </span>
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id={id}
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={value}
                  onChange={(event) => set(field.key, event.target.valueAsNumber)}
                  className="h-1 flex-1 accent-[var(--color-accent)]"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={value}
                  onChange={(event) => set(field.key, event.target.valueAsNumber)}
                  aria-label={`${field.label} (sayısal giriş)`}
                  data-numeric
                  className="w-28 border border-[var(--color-rule)] bg-[var(--color-surface)] px-2 py-1 text-right text-[length:var(--text-sm)] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-1">
        <p className="text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
          Toplam yıllık yük
        </p>
        <Counter
          value={Math.round(result.total)}
          format={(n) => formatCurrency(n)}
          className="font-[family-name:var(--font-display)] text-[length:var(--text-3xl)] text-[var(--color-text)]"
        />
        <p className="text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
          ciroya oran{' '}
          <span data-numeric className="text-[var(--color-text)]">
            {formatPercent(result.effectiveOnRevenue)}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <Charts components={result.components} timeline={result.timeline} />
      </div>

      {/* Ekran okuyucu karşılığı — grafiklerin erişilebilir tablo eşleniği */}
      <table className="sr-only">
        <caption>Vergi yükü dağılımı ve yıl içi kümülatif tahmini</caption>
        <thead>
          <tr>
            <th scope="col">Kalem</th>
            <th scope="col">Yıllık tutar</th>
            <th scope="col">Pay</th>
          </tr>
        </thead>
        <tbody>
          {result.components.map((item) => (
            <tr key={item.key}>
              <th scope="row">{item.label}</th>
              <td>{formatCurrency(item.annual)}</td>
              <td>{formatPercent(item.share)}</td>
            </tr>
          ))}
          <tr>
            <th scope="row">Toplam</th>
            <td>{formatCurrency(result.total)}</td>
            <td>{formatPercent(1)}</td>
          </tr>
        </tbody>
      </table>
      <table className="sr-only">
        <caption>Yıl içi kümülatif tahmini vergi çıkışı (eşit dağıtım varsayımı)</caption>
        <thead>
          <tr>
            <th scope="col">Ay</th>
            <th scope="col">Kümülatif tutar</th>
          </tr>
        </thead>
        <tbody>
          {result.timeline.map((row) => (
            <tr key={row.month}>
              <th scope="row">{row.label}</th>
              <td>{formatCurrency(row.cumulative)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 space-y-3 border-t border-[var(--color-rule)] pt-4">
        <p className="text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          Hesaplanan KDV, ciro üzerinden standart oranla ve <strong>brüt</strong> gösterilir;
          indirilecek KDV mahsubu dâhil değildir. Yıl içi dağılım eşit varsayımlıdır, geçici
          vergi dönemleri yaklaşık gösterilir.
        </p>
        <UnverifiedRatesNotice provenance={result.provenance} />
        <p className="text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          {site.disclaimers.calculator.tr}
        </p>
      </div>
    </section>
  );
}
