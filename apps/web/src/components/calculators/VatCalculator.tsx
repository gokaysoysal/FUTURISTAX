'use client';

import {
  DEFAULT_YEAR,
  type TaxYear,
  type VatBand,
  type VatDirection,
  calculateVat,
  getRates,
} from '@futuristax/tax-engine';
import { useMemo, useState } from 'react';
import { LedgerChart } from './LedgerChart';
import { ResultLedger } from './ResultLedger';
import { SelectField, TextField, YearSelect, parseNumeric } from './fields';

/**
 * KDV hesaplama — 3065 sayılı Kanun. UI hiçbir oran bilmez; calculateVat
 * saf fonksiyonu getRates(year) ile beslenir.
 */
export function VatCalculator() {
  const [year, setYear] = useState<TaxYear>(DEFAULT_YEAR);
  const [amount, setAmount] = useState('10000');
  const [direction, setDirection] = useState<VatDirection>('add');
  const [band, setBand] = useState<VatBand>('standard');

  const result = useMemo(
    () => calculateVat({ amount: parseNumeric(amount), direction, band }, getRates(year)),
    [amount, direction, band, year],
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        <YearSelect value={year} onChange={setYear} />
        <TextField
          id="vat-amount"
          label="Tutar (₺)"
          value={amount}
          onChange={setAmount}
          help={
            direction === 'add'
              ? 'KDV hariç tutarı girin; üzerine KDV eklenir.'
              : 'KDV dahil tutarı girin; içindeki KDV ayrıştırılır.'
          }
        />
        <SelectField
          id="vat-direction"
          label="Yön"
          value={direction}
          onChange={(v) => setDirection(v as VatDirection)}
          options={[
            { value: 'add', label: 'KDV ekle (hariçten dahile)' },
            { value: 'extract', label: 'KDV ayrıştır (dahilden)' },
          ]}
        />
        <SelectField
          id="vat-band"
          label="KDV oranı grubu"
          value={band}
          onChange={(v) => setBand(v as VatBand)}
          options={[
            { value: 'standard', label: 'Genel oran' },
            { value: 'reduced', label: 'İndirimli oran' },
            { value: 'basic', label: 'Temel gıda / en düşük oran' },
          ]}
        />
      </div>

      <div aria-live="polite">
        <ResultLedger
          result={result}
          chart={
            <LedgerChart
              caption="KDV dahil tutarın bileşimi"
              segments={[
                { label: 'Matrah (KDV hariç)', value: result.detail.net, tone: 'accent' },
                { label: 'Hesaplanan KDV', value: result.detail.vat, tone: 'warning' },
              ]}
            />
          }
        />
      </div>
    </div>
  );
}
