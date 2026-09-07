'use client';

import { BurdenFields } from '@/components/dashboards/BurdenFields';
import { SkeletonText } from '@/components/ui/Skeleton';
import { UnverifiedRatesNotice } from '@/components/ui/UnverifiedRatesNotice';
import { BURDEN_DEFAULTS, type BurdenComponent, type BurdenInput, computeBurden } from '@/lib/charts/burden';
import { formatCurrency, formatPercent } from '@/lib/format';
import { site } from '@futuristax/config';
import { SUPPORTED_YEARS } from '@futuristax/tax-engine';
import dynamic from 'next/dynamic';
import { useId, useMemo, useState } from 'react';

/**
 * Yıl Karşılaştırma — aynı girdi 2024/2025/2026 oranlarıyla yan yana.
 * Fark ve yüzde değişim sütunu. Doğrulanmamış yıllar için
 * UnverifiedRatesNotice görünmeye devam eder.
 *
 * Hesap: `computeBurden` (saf) her yıl için ayrı çağrılır. Tablo semantik
 * (<th scope>), grafik tembel + aria-hidden — SR karşılığı tablo.
 */

type Values = Omit<BurdenInput, 'year'>;

const Chart = dynamic(
  () => import('./YearComparisonChart').then((m) => m.YearComparisonChart),
  { ssr: false, loading: () => <SkeletonText lines={3} /> },
);

const ROWS: { key: BurdenComponent['key'] | 'total'; label: string }[] = [
  { key: 'kv', label: 'Kurumlar vergisi' },
  { key: 'kdv', label: 'Hesaplanan KDV (brüt)' },
  { key: 'sgk', label: 'SGK işveren payı' },
  { key: 'total', label: 'Toplam yıllık yük' },
];

export function YearComparisonPanel() {
  const [values, setValues] = useState<Values>(BURDEN_DEFAULTS);
  const groupId = useId();

  const years = useMemo(
    () => SUPPORTED_YEARS.map((year) => ({ year, result: computeBurden({ ...values, year }) })),
    [values],
  );

  const set = (key: keyof Values, raw: number) => {
    const clean = Number.isFinite(raw) ? Math.max(0, raw) : 0;
    setValues((prev) => ({ ...prev, [key]: clean }));
  };

  const amountFor = (rowKey: (typeof ROWS)[number]['key'], result: ReturnType<typeof computeBurden>) =>
    rowKey === 'total'
      ? result.total
      : (result.components.find((component) => component.key === rowKey)?.annual ?? 0);

  const base = years[0];
  const latest = years[years.length - 1];
  // SUPPORTED_YEARS her zaman doludur; guard yalnızca noUncheckedIndexedAccess için.
  if (!base || !latest) return null;
  const unverified = years.filter((entry) => !entry.result.provenance.verified);

  const chartData = years.map((entry) => ({
    year: String(entry.year),
    kv: amountFor('kv', entry.result),
    kdv: amountFor('kdv', entry.result),
    sgk: amountFor('sgk', entry.result),
  }));

  return (
    <section
      aria-labelledby={`${groupId}-title`}
      className="card surface-glow overflow-hidden p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={`${groupId}-title`} className="text-[length:var(--text-xl)]">
          Yıl karşılaştırma
        </h2>
        <p className="basis-ref">
          {base.year}–{latest.year} · aynı girdi, farklı oranlar
        </p>
      </div>

      <div className="mt-6">
        <BurdenFields idPrefix={groupId} values={values} onChange={set} />
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="ledger-grid w-full text-[length:var(--text-sm)]">
          <caption className="sr-only">
            Vergi yükü kalemlerinin {base.year}, {latest.year} ve ara yıllara göre karşılaştırması;
            fark ve yüzde değişim {base.year} yılına göredir.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-medium text-[var(--color-text-secondary)]">
                Kalem
              </th>
              {years.map((entry) => (
                <th
                  key={entry.year}
                  scope="col"
                  className="px-3 py-2 text-right font-medium text-[var(--color-text-secondary)]"
                >
                  {entry.year}
                </th>
              ))}
              <th scope="col" className="px-3 py-2 text-right font-medium text-[var(--color-text-secondary)]">
                Fark
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium text-[var(--color-text-secondary)]">
                % değişim
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const baseValue = amountFor(row.key, base.result);
              const latestValue = amountFor(row.key, latest.result);
              const diff = latestValue - baseValue;
              const pct = baseValue > 0 ? diff / baseValue : 0;
              return (
                <tr key={row.key} className={row.key === 'total' ? 'font-medium' : undefined}>
                  <th scope="row" className="px-3 py-2 text-left font-normal text-[var(--color-text)]">
                    {row.label}
                  </th>
                  {years.map((entry) => (
                    <td
                      key={entry.year}
                      data-numeric
                      className="px-3 py-2 text-right text-[var(--color-text)]"
                    >
                      {formatCurrency(amountFor(row.key, entry.result))}
                    </td>
                  ))}
                  <td
                    data-numeric
                    className={`px-3 py-2 text-right ${
                      diff > 0
                        ? 'text-[var(--color-signal)]'
                        : diff < 0
                          ? 'text-[var(--color-positive)]'
                          : 'text-[var(--color-text-secondary)]'
                    }`}
                  >
                    {diff > 0 ? '+' : ''}
                    {formatCurrency(diff)}
                  </td>
                  <td
                    data-numeric
                    className="px-3 py-2 text-right text-[var(--color-text-secondary)]"
                  >
                    {diff > 0 ? '+' : ''}
                    {formatPercent(pct)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Chart data={chartData} />
      </div>

      <div className="mt-6 space-y-3 border-t border-[var(--color-rule)] pt-4">
        <p className="text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          Hesaplanan KDV brüt gösterilir (indirilecek KDV mahsubu hariç). Fark ve yüzde değişim{' '}
          {base.year} yılına görelidir.
        </p>
        {unverified.map((entry) => (
          <UnverifiedRatesNotice key={entry.year} provenance={entry.result.provenance} />
        ))}
        <p className="text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          {site.disclaimers.calculator.tr}
        </p>
      </div>
    </section>
  );
}
