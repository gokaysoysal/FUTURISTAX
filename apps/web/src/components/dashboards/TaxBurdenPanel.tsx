'use client';

import { BurdenFields } from '@/components/dashboards/BurdenFields';
import { Counter } from '@/components/motion/Counter';
import { SkeletonText } from '@/components/ui/Skeleton';
import { UnverifiedRatesNotice } from '@/components/ui/UnverifiedRatesNotice';
import { BURDEN_DEFAULTS, type BurdenInput, computeBurden } from '@/lib/charts/burden';
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

const Charts = dynamic(() => import('./TaxBurdenCharts').then((m) => m.TaxBurdenCharts), {
  ssr: false,
  loading: () => <SkeletonText lines={4} className="sm:col-span-2" />,
});

export function TaxBurdenPanel() {
  const [values, setValues] = useState<Omit<BurdenInput, 'year'>>(BURDEN_DEFAULTS);
  const groupId = useId();

  const result = useMemo(() => computeBurden({ ...values, year: DEFAULT_YEAR }), [values]);

  const set = (key: keyof Omit<BurdenInput, 'year'>, raw: number) => {
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

      <div className="mt-6">
        <BurdenFields idPrefix={groupId} values={values} onChange={set} />
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
          indirilecek KDV mahsubu dâhil değildir. Yıl içi dağılım eşit varsayımlıdır, geçici vergi
          dönemleri yaklaşık gösterilir.
        </p>
        <UnverifiedRatesNotice provenance={result.provenance} />
        <p className="text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          {site.disclaimers.calculator.tr}
        </p>
      </div>
    </section>
  );
}
