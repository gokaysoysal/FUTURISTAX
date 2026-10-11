'use client';

import { StatusPanel } from '@/components/ui/StatusPanel';
import { availableCpiYears, calculateInflationAdjustment } from '@futuristax/tax-engine';
import { useMemo, useState } from 'react';
import { LedgerChart } from './LedgerChart';
import { ResultLedger } from './ResultLedger';
import { SelectField, TextField, parseNumeric } from './fields';

/**
 * TÜFE güncelleme — TÜİK yıl sonu endeksine göre satın alma gücü.
 * Endeks verisi motorda tutulur (CPI_INDEX) ve DOĞRULANMAMIŞTIR; sonuç
 * bloğundaki uyarı bandı bunu gösterir. 2025 ve sonrası henüz eksik.
 */
export function InflationCalculator() {
  const years = availableCpiYears();
  const yearOptions = years.map((y) => ({ value: String(y), label: String(y) }));

  const [amount, setAmount] = useState('100000');
  const [fromYear, setFromYear] = useState(String(years[0] ?? ''));
  const [toYear, setToYear] = useState(String(years[years.length - 1] ?? ''));

  const result = useMemo(() => {
    try {
      return calculateInflationAdjustment({
        amount: parseNumeric(amount),
        fromYear: Number(fromYear),
        toYear: Number(toYear),
      });
    } catch {
      return null;
    }
  }, [amount, fromYear, toYear]);

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        <TextField id="cpi-amount" label="Tutar (₺)" value={amount} onChange={setAmount} />
        <div className="grid grid-cols-2 gap-3">
          <SelectField
            id="cpi-from"
            label="Başlangıç yılı"
            value={fromYear}
            onChange={setFromYear}
            options={yearOptions}
          />
          <SelectField
            id="cpi-to"
            label="Güncellenecek yıl"
            value={toYear}
            onChange={setToYear}
            options={yearOptions}
          />
        </div>
      </div>

      <div aria-live="polite">
        {result ? (
          <ResultLedger
            result={result}
            chart={
              <LedgerChart
                caption="Güncellenmiş değerin nominal + kayıp bileşimi"
                segments={[
                  {
                    label: 'Nominal tutar',
                    value: result.detail.adjustedAmount - result.detail.purchasingPowerLoss,
                    tone: 'accent',
                  },
                  {
                    label: 'Satın alma gücü kaybı',
                    value: result.detail.purchasingPowerLoss,
                    tone: 'warning',
                  },
                ]}
              />
            }
          />
        ) : (
          <StatusPanel
            tone="empty"
            label="TÜFE"
            title="Seçilen yıllar için TÜFE endeks verisi bulunmuyor"
          />
        )}
      </div>
    </div>
  );
}
