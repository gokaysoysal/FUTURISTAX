import { describe, expect, it } from 'vitest';
import { applyProgressiveBrackets } from '../calculators/brackets';
import type { TaxBracket } from '../types';

const brackets: TaxBracket[] = [
  { from: 0, to: 100, rate: 0.1 },
  { from: 100, to: 200, rate: 0.2 },
  { from: 200, to: null, rate: 0.3 },
];

describe('artan oranlı tarife', () => {
  it('ilk dilim içinde kalırsa tek oran uygular', () => {
    const r = applyProgressiveBrackets(50, brackets);
    expect(r.tax).toBeCloseTo(5, 9);
    expect(r.marginalRate).toBe(0.1);
    expect(r.breakdown).toHaveLength(1);
  });

  it('dilim sınırında doğru hesaplar', () => {
    expect(applyProgressiveBrackets(100, brackets).tax).toBeCloseTo(10, 9);
  });

  it('birden fazla dilime yayılır', () => {
    // 100*0.1 + 100*0.2 + 50*0.3 = 10 + 20 + 15 = 45
    const r = applyProgressiveBrackets(250, brackets);
    expect(r.tax).toBeCloseTo(45, 9);
    expect(r.breakdown).toHaveLength(3);
    expect(r.marginalRate).toBe(0.3);
    expect(r.effectiveRate).toBeCloseTo(0.18, 9);
  });

  it('sıfır ve negatif matrahı sıfır vergiye çevirir', () => {
    expect(applyProgressiveBrackets(0, brackets).tax).toBe(0);
    expect(applyProgressiveBrackets(-100, brackets).tax).toBe(0);
    expect(applyProgressiveBrackets(0, brackets).effectiveRate).toBe(0);
  });
});
