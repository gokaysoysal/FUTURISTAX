'use client';

import { DEFAULT_YEAR, type TaxYear, calculatePayrollCost, getRates } from '@futuristax/tax-engine';
import { useMemo, useState } from 'react';
import { LedgerChart } from './LedgerChart';
import { ResultLedger } from './ResultLedger';
import { TextField, YearSelect, parseNumeric } from './fields';

/**
 * SGK işveren maliyeti — 5510 sayılı Kanun.
 * Not: Gelir ve damga vergisi stopajı kümülatif matrah gerektirdiği için
 * motorun bu fonksiyonuna dahil değildir; sonuç bunu belirtir.
 */
export function PayrollCostCalculator() {
  const [year, setYear] = useState<TaxYear>(DEFAULT_YEAR);
  const [grossSalary, setGrossSalary] = useState('40000');
  const [apply5510Discount, setApply5510Discount] = useState(true);

  const result = useMemo(
    () =>
      calculatePayrollCost(
        { grossSalary: parseNumeric(grossSalary), apply5510Discount },
        getRates(year),
      ),
    [grossSalary, apply5510Discount, year],
  );

  const d = result.detail;
  const grossPay = d.employerTotalCost - d.employerSgk - d.employerUnemployment;

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        <YearSelect value={year} onChange={setYear} />
        <TextField
          id="payroll-gross"
          label="Aylık brüt ücret (₺)"
          value={grossSalary}
          onChange={setGrossSalary}
        />
        <label className="flex items-center gap-2 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
          <input
            type="checkbox"
            checked={apply5510Discount}
            onChange={(event) => setApply5510Discount(event.target.checked)}
            className="size-4 accent-[var(--color-ink)]"
          />
          5510 sayılı Kanun 5 puanlık işveren indiriminden yararlanılıyor
        </label>
      </div>

      <div aria-live="polite">
        <ResultLedger
          result={result}
          chart={
            <LedgerChart
              caption="İşveren toplam maliyetinin kırılımı"
              segments={[
                {
                  label: 'İşçiye net ödeme',
                  value: grossPay - d.employeeDeductions,
                  tone: 'positive',
                },
                {
                  label: 'İşçi kesintileri (SGK + işsizlik)',
                  value: d.employeeDeductions,
                  tone: 'muted',
                },
                { label: 'İşveren SGK payı', value: d.employerSgk, tone: 'accent' },
                { label: 'İşveren işsizlik payı', value: d.employerUnemployment, tone: 'accent' },
              ]}
            />
          }
        />
      </div>
    </div>
  );
}
