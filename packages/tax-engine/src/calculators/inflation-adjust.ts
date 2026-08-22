import type { CalculationResult, RateProvenance } from '../types';

/**
 * TÜFE endeks değerleri. Kaynak: TÜİK.
 *
 * ⚠️ DOĞRULANMAMIŞ — yayına almadan önce TÜİK'ten teyit edilmeli.
 * Endeks tabanı: 2003 = 100.
 *
 * Bu tablo bilinçli olarak kod içinde tutulur; TÜİK API'si stabil değil ve
 * geçmiş endeks değerleri revize edilebildiği için yayın anındaki değerin
 * sabitlenmesi tercih edilir.
 */
export const CPI_INDEX: Readonly<Record<number, number>> = {
  2019: 440.5,
  2020: 504.81,
  2021: 686.95,
  2022: 1128.45,
  2023: 1859.38,
  2024: 2684.55,
};

export const CPI_PROVENANCE: RateProvenance = {
  year: 2024,
  verified: false,
  source: null,
  checkedAt: null,
  notes: 'TÜİK TÜFE yıl sonu endeks değerleri doğrulanmalı. 2025 ve sonrası eksik.',
};

export interface InflationInput {
  amount: number;
  fromYear: number;
  toYear: number;
}

export interface InflationDetail {
  adjustedAmount: number;
  cumulativeRate: number;
  fromIndex: number;
  toIndex: number;
  purchasingPowerLoss: number;
}

export function availableCpiYears(): number[] {
  return Object.keys(CPI_INDEX)
    .map(Number)
    .sort((a, b) => a - b);
}

/** TÜFE'ye göre satın alma gücü güncellemesi */
export function calculateInflationAdjustment(
  input: InflationInput,
): CalculationResult<InflationDetail> {
  const fromIndex = CPI_INDEX[input.fromYear];
  const toIndex = CPI_INDEX[input.toYear];

  if (fromIndex === undefined || toIndex === undefined) {
    throw new Error(
      `TÜFE endeks verisi bulunamadı: ${input.fromYear}–${input.toYear}. ` +
        `Mevcut yıllar: ${availableCpiYears().join(', ')}`,
    );
  }

  const factor = toIndex / fromIndex;
  const adjustedAmount = input.amount * factor;
  const cumulativeRate = factor - 1;

  return {
    headline: { label: 'Güncellenmiş değer', value: adjustedAmount, kind: 'currency' },
    steps: [
      { label: `${input.fromYear} tutarı`, value: input.amount, kind: 'currency' },
      { label: `${input.fromYear} TÜFE endeksi`, value: fromIndex, kind: 'number' },
      { label: `${input.toYear} TÜFE endeksi`, value: toIndex, kind: 'number' },
      { label: 'Kümülatif enflasyon', value: cumulativeRate, kind: 'percent', emphasis: 'warning' },
      { label: `${input.toYear} karşılığı`, value: adjustedAmount, kind: 'currency', emphasis: 'positive' },
    ],
    detail: {
      adjustedAmount,
      cumulativeRate,
      fromIndex,
      toIndex,
      purchasingPowerLoss: adjustedAmount - input.amount,
    },
    provenance: CPI_PROVENANCE,
  };
}
