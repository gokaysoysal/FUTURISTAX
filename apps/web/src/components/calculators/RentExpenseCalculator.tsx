'use client';

import { DEFAULT_YEAR, type TaxYear, calculateRentExpense, getRates } from '@futuristax/tax-engine';
import { useMemo, useState } from 'react';
import { LedgerChart } from './LedgerChart';
import { ResultLedger } from './ResultLedger';
import { TextField, YearSelect, parseNumeric } from './fields';

/** Binek araç kira sınırı — GVK Md. 40/1. */
export function RentExpenseCalculator() {
  const [year, setYear] = useState<TaxYear>(DEFAULT_YEAR);
  const [monthlyRent, setMonthlyRent] = useState('30000');
  const [months, setMonths] = useState('12');

  const result = useMemo(
    () =>
      calculateRentExpense(
        { monthlyRent: parseNumeric(monthlyRent), months: parseNumeric(months) || 12 },
        getRates(year),
      ),
    [monthlyRent, months, year],
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        <YearSelect value={year} onChange={setYear} />
        <TextField
          id="rent-monthly"
          label="Aylık kira bedeli (KDV hariç, ₺)"
          value={monthlyRent}
          onChange={setMonthlyRent}
        />
        <TextField
          id="rent-months"
          label="Kiralama süresi (ay)"
          value={months}
          onChange={setMonths}
          inputMode="numeric"
        />
      </div>

      <div aria-live="polite">
        <ResultLedger
          result={result}
          chart={
            <LedgerChart
              caption="Aylık kira bedelinin sınır dağılımı"
              segments={[
                {
                  label: 'Aylık indirilebilir',
                  value: result.detail.deductibleMonthly,
                  tone: 'positive',
                },
                { label: 'Aylık aşan (KKEG)', value: result.detail.excessMonthly, tone: 'warning' },
              ]}
            />
          }
        />
      </div>
    </div>
  );
}
