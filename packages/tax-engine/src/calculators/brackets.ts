import type { TaxBracket } from '../types';

export interface BracketBreakdown {
  from: number;
  to: number | null;
  rate: number;
  /** Bu dilime düşen matrah tutarı */
  taxableInBracket: number;
  /** Bu dilimden doğan vergi */
  taxInBracket: number;
}

export interface ProgressiveResult {
  tax: number;
  breakdown: BracketBreakdown[];
  /** Ortalama efektif oran (matrah 0 ise 0) */
  effectiveRate: number;
  /** Son lira için geçerli marjinal oran */
  marginalRate: number;
}

/**
 * Artan oranlı tarifeye göre vergi hesaplar.
 *
 * Dilimler ardışık ve boşluksuz varsayılır. Negatif matrah 0 kabul edilir.
 */
export function applyProgressiveBrackets(
  taxableBase: number,
  brackets: readonly TaxBracket[],
): ProgressiveResult {
  const base = Math.max(0, taxableBase);
  const breakdown: BracketBreakdown[] = [];
  let tax = 0;
  let marginalRate = brackets[0]?.rate ?? 0;

  for (const bracket of brackets) {
    if (base <= bracket.from) break;

    const upper = bracket.to ?? Number.POSITIVE_INFINITY;
    const taxableInBracket = Math.min(base, upper) - bracket.from;
    if (taxableInBracket <= 0) continue;

    const taxInBracket = taxableInBracket * bracket.rate;
    tax += taxInBracket;
    marginalRate = bracket.rate;

    breakdown.push({
      from: bracket.from,
      to: bracket.to,
      rate: bracket.rate,
      taxableInBracket,
      taxInBracket,
    });
  }

  return {
    tax,
    breakdown,
    effectiveRate: base > 0 ? tax / base : 0,
    marginalRate,
  };
}
