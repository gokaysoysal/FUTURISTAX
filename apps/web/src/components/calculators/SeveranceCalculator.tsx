'use client';

import { DEFAULT_YEAR, type TaxYear, calculateSeverance, getRates } from '@futuristax/tax-engine';
import { useMemo, useState } from 'react';
import { LedgerChart } from './LedgerChart';
import { ResultLedger } from './ResultLedger';
import { TextField, YearSelect, parseNumeric } from './fields';

/**
 * Kıdem tazminatı — 1475 sayılı Kanun Md. 14. Her tam hizmet yılı için 30
 * günlük giydirilmiş brüt ücret; ücret yasal tavanı aşamaz.
 */
export function SeveranceCalculator() {
  const [year, setYear] = useState<TaxYear>(DEFAULT_YEAR);
  const [grossSalary, setGrossSalary] = useState('50000');
  const [years, setYears] = useState('5');
  const [months, setMonths] = useState('0');
  const [days, setDays] = useState('0');

  const result = useMemo(
    () =>
      calculateSeverance(
        {
          grossSalary: parseNumeric(grossSalary),
          years: parseNumeric(years),
          months: parseNumeric(months),
          days: parseNumeric(days),
        },
        getRates(year),
      ),
    [grossSalary, years, months, days, year],
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        <YearSelect value={year} onChange={setYear} />
        <TextField
          id="sev-gross"
          label="Giydirilmiş aylık brüt ücret (₺)"
          value={grossSalary}
          onChange={setGrossSalary}
          help="Çıplak ücrete düzenli yan hakların (yol, yemek, ikramiye payı…) eklenmiş hâli."
        />
        <div className="grid grid-cols-3 gap-3">
          <TextField
            id="sev-years"
            label="Yıl"
            value={years}
            onChange={setYears}
            inputMode="numeric"
          />
          <TextField
            id="sev-months"
            label="Ay"
            value={months}
            onChange={setMonths}
            inputMode="numeric"
          />
          <TextField
            id="sev-days"
            label="Gün"
            value={days}
            onChange={setDays}
            inputMode="numeric"
          />
        </div>
      </div>

      <div aria-live="polite">
        <ResultLedger
          result={result}
          chart={
            <LedgerChart
              caption="Brüt kıdem tazminatının dağılımı"
              segments={[
                { label: 'Net ödenecek', value: result.detail.netSeverance, tone: 'positive' },
                { label: 'Damga vergisi', value: result.detail.stampDuty, tone: 'warning' },
              ]}
            />
          }
        />
      </div>
    </div>
  );
}
