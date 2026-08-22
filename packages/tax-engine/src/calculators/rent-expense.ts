import type { CalculationResult, RateSet } from '../types';

export interface RentExpenseInput {
  /** Aylık kiralama bedeli (KDV hariç) */
  monthlyRent: number;
  /** Kiralama süresi, ay */
  months?: number;
}

export interface RentExpenseDetail {
  cap: number;
  deductibleMonthly: number;
  excessMonthly: number;
  deductibleTotal: number;
  disallowedTotal: number;
  months: number;
}

/**
 * Binek otomobil kiralama gider sınırı — GVK Md. 40/1.
 *
 * Aylık kira bedelinin yasal üst sınırı aşan kısmı gider yazılamaz;
 * aşan tutara isabet eden KDV de indirilemez ve KKEG'e eklenir.
 */
export function calculateRentExpense(
  input: RentExpenseInput,
  rates: RateSet,
): CalculationResult<RentExpenseDetail> {
  const cap = rates.vehicleExpense.monthlyRentCap;
  const months = input.months ?? 12;
  const rent = Math.max(0, input.monthlyRent);

  const deductibleMonthly = Math.min(rent, cap);
  const excessMonthly = Math.max(0, rent - cap);
  const excessVat = excessMonthly * rates.vat.standard;

  const deductibleTotal = deductibleMonthly * months;
  const disallowedTotal = (excessMonthly + excessVat) * months;

  return {
    headline: { label: 'Yıllık KKEG', value: disallowedTotal, kind: 'currency' },
    steps: [
      { label: 'Aylık kira bedeli', value: rent, kind: 'currency' },
      { label: 'Yasal aylık üst sınır', value: cap, kind: 'currency', basis: 'GVK Md. 40/1' },
      { label: 'Aylık indirilebilir tutar', value: deductibleMonthly, kind: 'currency', emphasis: 'positive' },
      { label: 'Aylık aşan tutar', value: excessMonthly, kind: 'currency', emphasis: 'warning' },
      { label: 'Aşan tutara isabet eden KDV', value: excessVat, kind: 'currency', emphasis: 'warning' },
      { label: `${months} aylık toplam indirilebilir`, value: deductibleTotal, kind: 'currency' },
    ],
    detail: { cap, deductibleMonthly, excessMonthly, deductibleTotal, disallowedTotal, months },
    provenance: rates.provenance,
  };
}
