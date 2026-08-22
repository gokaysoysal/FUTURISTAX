import type { CalculationResult, RateSet } from '../types';

export interface SeveranceInput {
  /** Giydirilmiş aylık brüt ücret */
  grossSalary: number;
  /** Toplam hizmet süresi, tam yıl */
  years: number;
  /** Yıl artığı, ay */
  months?: number;
  /** Yıl artığı, gün */
  days?: number;
}

export interface SeveranceDetail {
  cappedSalary: number;
  cap: number;
  capApplied: boolean;
  totalServiceDays: number;
  grossSeverance: number;
  stampDuty: number;
  netSeverance: number;
}

const DAYS_PER_YEAR = 365;

/**
 * Kıdem tazminatı — 1475 sayılı Kanun Md. 14.
 *
 * Her tam hizmet yılı için 30 günlük giydirilmiş brüt ücret ödenir.
 * Hesaba esas ücret yasal tavanı aşamaz. Kıdem tazminatı gelir vergisinden
 * istisnadır; yalnızca damga vergisi kesilir.
 */
export function calculateSeverance(
  input: SeveranceInput,
  rates: RateSet,
): CalculationResult<SeveranceDetail> {
  const cap = rates.severance.cap;
  const salary = Math.max(0, input.grossSalary);
  const cappedSalary = Math.min(salary, cap);

  const totalServiceDays =
    Math.max(0, input.years) * DAYS_PER_YEAR +
    Math.max(0, input.months ?? 0) * 30 +
    Math.max(0, input.days ?? 0);

  const grossSeverance = (cappedSalary * totalServiceDays) / DAYS_PER_YEAR;
  const stampDuty = grossSeverance * rates.severance.stampDutyRate;
  const netSeverance = grossSeverance - stampDuty;

  return {
    headline: { label: 'Net kıdem tazminatı', value: netSeverance, kind: 'currency' },
    steps: [
      { label: 'Giydirilmiş brüt ücret', value: salary, kind: 'currency' },
      { label: 'Kıdem tazminatı tavanı', value: cap, kind: 'currency', basis: '1475 Md. 14' },
      { label: 'Hesaba esas ücret', value: cappedSalary, kind: 'currency', emphasis: salary > cap ? 'warning' : 'neutral' },
      { label: 'Toplam hizmet süresi (gün)', value: totalServiceDays, kind: 'number' },
      { label: 'Brüt kıdem tazminatı', value: grossSeverance, kind: 'currency' },
      { label: 'Damga vergisi', value: stampDuty, kind: 'currency', emphasis: 'warning' },
      { label: 'Net ödenecek', value: netSeverance, kind: 'currency', emphasis: 'positive' },
    ],
    detail: {
      cappedSalary,
      cap,
      capApplied: salary > cap,
      totalServiceDays,
      grossSeverance,
      stampDuty,
      netSeverance,
    },
    provenance: rates.provenance,
  };
}
