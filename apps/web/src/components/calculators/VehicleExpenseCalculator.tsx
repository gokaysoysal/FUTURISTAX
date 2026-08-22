'use client';

import {
  DEFAULT_YEAR,
  SUPPORTED_YEARS,
  type TaxYear,
  calculateVehicleExpense,
  getRates,
} from '@futuristax/tax-engine';
import { useMemo, useState } from 'react';
import { ResultLedger } from './ResultLedger';

/**
 * Binek araç gider kısıtı hesaplayıcısı — GVK Md. 40/5.
 *
 * Örnek desen: UI hiçbir vergi kuralı bilmez. Oranları `getRates(year)` ile
 * alır, saf fonksiyona geçirir, dönen sonucu render eder. Oran değişince bu
 * dosyaya dokunulmaz.
 */
export function VehicleExpenseCalculator() {
  const [year, setYear] = useState<TaxYear>(DEFAULT_YEAR);
  const [annualExpense, setAnnualExpense] = useState('100000');

  const result = useMemo(() => {
    const amount = Number.parseFloat(annualExpense.replace(',', '.'));
    return calculateVehicleExpense(
      { annualExpense: Number.isFinite(amount) ? amount : 0 },
      getRates(year),
    );
  }, [annualExpense, year]);

  const fieldClass =
    'w-full border border-[var(--color-rule)] bg-[var(--color-sunken)] px-3 py-2.5 ' +
    'text-[length:var(--text-sm)] text-[var(--color-text)] ' +
    'focus:border-[var(--color-ink)] focus:outline-none';

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="vehicle-year"
            className="mb-1.5 block text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
          >
            Vergi yılı
          </label>
          <select
            id="vehicle-year"
            className={fieldClass}
            value={year}
            onChange={(event) => setYear(Number(event.target.value) as TaxYear)}
          >
            {SUPPORTED_YEARS.map((supported) => (
              <option key={supported} value={supported}>
                {supported}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="vehicle-expense"
            className="mb-1.5 block text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
          >
            Yıllık gider tutarı (KDV hariç, ₺)
          </label>
          <input
            id="vehicle-expense"
            type="text"
            inputMode="decimal"
            data-numeric
            className={fieldClass}
            value={annualExpense}
            onChange={(event) => setAnnualExpense(event.target.value)}
            aria-describedby="vehicle-expense-help"
          />
          <p
            id="vehicle-expense-help"
            className="mt-1.5 text-[length:var(--text-xs)] text-[var(--color-text-muted)]"
          >
            Yakıt, bakım, sigorta ve benzeri binek otomobil giderlerinin yıllık toplamı.
          </p>
        </div>
      </div>

      <div aria-live="polite">
        <ResultLedger result={result} />
      </div>
    </div>
  );
}
