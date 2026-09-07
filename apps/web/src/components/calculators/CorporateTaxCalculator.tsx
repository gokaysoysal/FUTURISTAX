'use client';

import {
  type CorporateBand,
  DEFAULT_YEAR,
  type TaxYear,
  calculateCorporateTax,
  getRates,
} from '@futuristax/tax-engine';
import { useMemo, useState } from 'react';
import { ResultLedger } from './ResultLedger';
import { SelectField, TextField, YearSelect, parseNumeric } from './fields';

/** Kurumlar vergisi — 5520 sayılı Kanun. */
export function CorporateTaxCalculator() {
  const [year, setYear] = useState<TaxYear>(DEFAULT_YEAR);
  const [commercialProfit, setCommercialProfit] = useState('1000000');
  const [disallowedExpenses, setDisallowedExpenses] = useState('0');
  const [exemptions, setExemptions] = useState('0');
  const [priorLosses, setPriorLosses] = useState('0');
  const [band, setBand] = useState<CorporateBand>('standard');
  const [applyDomesticMinimum, setApplyDomesticMinimum] = useState(false);

  const result = useMemo(
    () =>
      calculateCorporateTax(
        {
          commercialProfit: parseNumeric(commercialProfit),
          disallowedExpenses: parseNumeric(disallowedExpenses),
          exemptions: parseNumeric(exemptions),
          priorLosses: parseNumeric(priorLosses),
          band,
          applyDomesticMinimum,
        },
        getRates(year),
      ),
    [
      commercialProfit,
      disallowedExpenses,
      exemptions,
      priorLosses,
      band,
      applyDomesticMinimum,
      year,
    ],
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        <YearSelect value={year} onChange={setYear} />
        <TextField
          id="corp-profit"
          label="Ticari bilanço kârı (₺)"
          value={commercialProfit}
          onChange={setCommercialProfit}
        />
        <TextField
          id="corp-kkeg"
          label="Kanunen kabul edilmeyen giderler (₺)"
          value={disallowedExpenses}
          onChange={setDisallowedExpenses}
        />
        <TextField
          id="corp-exemptions"
          label="İstisna ve indirimler (₺)"
          value={exemptions}
          onChange={setExemptions}
        />
        <TextField
          id="corp-losses"
          label="Geçmiş yıl zararları (₺)"
          value={priorLosses}
          onChange={setPriorLosses}
        />
        <SelectField
          id="corp-band"
          label="Oran grubu"
          value={band}
          onChange={(v) => setBand(v as CorporateBand)}
          options={[
            { value: 'standard', label: 'Genel oran' },
            { value: 'financialInstitutions', label: 'Finans kuruluşları' },
            { value: 'exportIncome', label: 'İhracat kazancı (indirimli)' },
          ]}
        />
        <label className="flex items-center gap-2 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={applyDomesticMinimum}
            onChange={(event) => setApplyDomesticMinimum(event.target.checked)}
            className="size-4 accent-[var(--color-ink)]"
          />
          Yurt içi asgari kurumlar vergisi karşılaştırması yapılsın
        </label>
      </div>

      <div aria-live="polite">
        <ResultLedger result={result} />
      </div>
    </div>
  );
}
