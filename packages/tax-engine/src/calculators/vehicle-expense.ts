import type { CalculationResult, RateSet } from '../types';

export interface VehicleExpenseInput {
  /** Yıllık binek araç gideri (KDV hariç) — yakıt, bakım, sigorta vb. */
  annualExpense: number;
  /** Gidere ilişkin KDV oranı */
  vatRate?: number;
}

export interface VehicleExpenseDetail {
  deductibleExpense: number;
  deductibleVat: number;
  nonDeductibleExpense: number;
  nonDeductibleVat: number;
  /** Kanunen kabul edilmeyen gider toplamı */
  disallowed: number;
  ratio: number;
}

/**
 * Binek otomobil gider kısıtı — GVK Md. 40/5.
 *
 * Giderin yalnızca `deductibleRatio` kadarı (halen %70) indirilebilir;
 * kalan kısım ve ona isabet eden KDV kanunen kabul edilmeyen giderdir.
 */
export function calculateVehicleExpense(
  input: VehicleExpenseInput,
  rates: RateSet,
): CalculationResult<VehicleExpenseDetail> {
  const ratio = rates.vehicleExpense.deductibleRatio;
  const vatRate = input.vatRate ?? rates.vat.standard;
  const expense = Math.max(0, input.annualExpense);
  const vat = expense * vatRate;

  const deductibleExpense = expense * ratio;
  const deductibleVat = vat * ratio;
  const nonDeductibleExpense = expense - deductibleExpense;
  const nonDeductibleVat = vat - deductibleVat;

  return {
    headline: {
      label: 'Kanunen kabul edilmeyen gider',
      value: nonDeductibleExpense + nonDeductibleVat,
      kind: 'currency',
    },
    steps: [
      { label: 'Toplam gider (KDV hariç)', value: expense, kind: 'currency' },
      { label: 'Hesaplanan KDV', value: vat, kind: 'currency' },
      { label: 'İndirilebilir gider', value: deductibleExpense, kind: 'currency', basis: 'GVK Md. 40/5', emphasis: 'positive' },
      { label: 'İndirilebilir KDV', value: deductibleVat, kind: 'currency', emphasis: 'positive' },
      { label: 'KKEG — gider', value: nonDeductibleExpense, kind: 'currency', emphasis: 'warning' },
      { label: 'KKEG — KDV', value: nonDeductibleVat, kind: 'currency', emphasis: 'warning' },
    ],
    detail: {
      deductibleExpense,
      deductibleVat,
      nonDeductibleExpense,
      nonDeductibleVat,
      disallowed: nonDeductibleExpense + nonDeductibleVat,
      ratio,
    },
    provenance: rates.provenance,
  };
}
