import type { CalculationResult, RateSet } from '../types';
import { applyProgressiveBrackets, type BracketBreakdown } from './brackets';

export type IncomeKind = 'employment' | 'other';

export interface IncomeTaxInput {
  /** Yıllık gayrisafi gelir */
  grossIncome: number;
  /** İndirilebilir giderler ve indirimler */
  deductions?: number;
  kind: IncomeKind;
}

export interface IncomeTaxDetail {
  taxableBase: number;
  tax: number;
  netIncome: number;
  effectiveRate: number;
  marginalRate: number;
  breakdown: BracketBreakdown[];
}

/** Gelir vergisi — GVK Md. 103 artan oranlı tarife */
export function calculateIncomeTax(
  input: IncomeTaxInput,
  rates: RateSet,
): CalculationResult<IncomeTaxDetail> {
  const brackets =
    input.kind === 'employment' ? rates.employmentIncomeBrackets : rates.incomeTaxBrackets;

  const deductions = input.deductions ?? 0;
  const taxableBase = Math.max(0, input.grossIncome - deductions);
  const result = applyProgressiveBrackets(taxableBase, brackets);

  return {
    headline: { label: 'Hesaplanan gelir vergisi', value: result.tax, kind: 'currency' },
    steps: [
      { label: 'Gayrisafi gelir', value: input.grossIncome, kind: 'currency' },
      { label: 'İndirimler', value: -deductions, kind: 'currency' },
      { label: 'Vergi matrahı', value: taxableBase, kind: 'currency' },
      { label: 'Hesaplanan vergi', value: result.tax, kind: 'currency', basis: 'GVK Md. 103' },
      { label: 'Efektif vergi oranı', value: result.effectiveRate, kind: 'percent' },
      { label: 'Marjinal oran', value: result.marginalRate, kind: 'percent' },
      { label: 'Net kalan', value: taxableBase - result.tax, kind: 'currency', emphasis: 'positive' },
    ],
    detail: {
      taxableBase,
      tax: result.tax,
      netIncome: taxableBase - result.tax,
      effectiveRate: result.effectiveRate,
      marginalRate: result.marginalRate,
      breakdown: result.breakdown,
    },
    provenance: rates.provenance,
  };
}
