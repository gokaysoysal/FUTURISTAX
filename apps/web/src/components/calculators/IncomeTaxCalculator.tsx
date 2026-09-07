'use client';

import {
  DEFAULT_YEAR,
  type IncomeKind,
  type TaxYear,
  calculateIncomeTax,
  getRates,
} from '@futuristax/tax-engine';
import { useMemo, useState } from 'react';
import { ResultLedger } from './ResultLedger';
import { SelectField, TextField, YearSelect, parseNumeric } from './fields';

/** Gelir vergisi — GVK Md. 103 artan oranlı tarife. */
export function IncomeTaxCalculator() {
  const [year, setYear] = useState<TaxYear>(DEFAULT_YEAR);
  const [grossIncome, setGrossIncome] = useState('600000');
  const [deductions, setDeductions] = useState('0');
  const [kind, setKind] = useState<IncomeKind>('other');

  const result = useMemo(
    () =>
      calculateIncomeTax(
        {
          grossIncome: parseNumeric(grossIncome),
          deductions: parseNumeric(deductions),
          kind,
        },
        getRates(year),
      ),
    [grossIncome, deductions, kind, year],
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        <YearSelect value={year} onChange={setYear} />
        <SelectField
          id="income-kind"
          label="Gelir türü"
          value={kind}
          onChange={(v) => setKind(v as IncomeKind)}
          options={[
            { value: 'other', label: 'Ücret dışı gelir (ticari, serbest meslek, kira…)' },
            { value: 'employment', label: 'Ücret geliri' },
          ]}
        />
        <TextField
          id="income-gross"
          label="Yıllık gayrisafi gelir (₺)"
          value={grossIncome}
          onChange={setGrossIncome}
        />
        <TextField
          id="income-deductions"
          label="İndirimler ve giderler (₺)"
          value={deductions}
          onChange={setDeductions}
          help="Matrahtan düşülebilecek gider ve indirimlerin toplamı."
        />
      </div>

      <div aria-live="polite">
        <ResultLedger result={result} />
      </div>
    </div>
  );
}
