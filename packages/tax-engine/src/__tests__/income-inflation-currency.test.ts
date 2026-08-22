import { describe, expect, it } from 'vitest';
import { type ExchangeRateTable, convertCurrency } from '../calculators/currency';
import { calculateIncomeTax } from '../calculators/income-tax';
import { calculateInflationAdjustment } from '../calculators/inflation-adjust';
import { getRates } from '../rates';

const rates = getRates(2025);

describe('gelir vergisi', () => {
  it('ücret ve ücret dışı tarifeleri ayırır', () => {
    const wage = calculateIncomeTax({ grossIncome: 1_000_000, kind: 'employment' }, rates);
    const other = calculateIncomeTax({ grossIncome: 1_000_000, kind: 'other' }, rates);
    expect(wage.detail.tax).toBeLessThan(other.detail.tax);
  });

  it('indirimleri matrahtan düşer', () => {
    const r = calculateIncomeTax(
      { grossIncome: 500_000, deductions: 100_000, kind: 'other' },
      rates,
    );
    expect(r.detail.taxableBase).toBe(400_000);
  });

  it('efektif oran marjinal orandan küçüktür', () => {
    const r = calculateIncomeTax({ grossIncome: 2_000_000, kind: 'other' }, rates);
    expect(r.detail.effectiveRate).toBeLessThan(r.detail.marginalRate);
  });
});

describe('enflasyon güncellemesi', () => {
  it('endeks oranına göre tutarı yükseltir', () => {
    const r = calculateInflationAdjustment({ amount: 10_000, fromYear: 2020, toYear: 2024 });
    expect(r.detail.adjustedAmount).toBeGreaterThan(10_000);
    expect(r.detail.cumulativeRate).toBeGreaterThan(0);
  });

  it('aynı yılda değeri korur', () => {
    const r = calculateInflationAdjustment({ amount: 10_000, fromYear: 2022, toYear: 2022 });
    expect(r.detail.adjustedAmount).toBeCloseTo(10_000, 6);
    expect(r.detail.cumulativeRate).toBeCloseTo(0, 9);
  });

  it('veri olmayan yılda sessizce uydurmaz, hata verir', () => {
    expect(() =>
      calculateInflationAdjustment({ amount: 1, fromYear: 1999, toYear: 2024 }),
    ).toThrow();
  });
});

describe('kur çevirimi', () => {
  const table: ExchangeRateTable = {
    tryPerUnit: { USD: 40, EUR: 44 },
    asOf: '2026-08-21',
    source: 'TCMB',
  };

  it('yabancı paradan TLye çevirir', () => {
    expect(convertCurrency({ amount: 100, from: 'USD', to: 'TRY' }, table).amount).toBeCloseTo(
      4000,
      6,
    );
  });

  it('TLden yabancı paraya çevirir', () => {
    expect(convertCurrency({ amount: 4000, from: 'TRY', to: 'USD' }, table).amount).toBeCloseTo(
      100,
      6,
    );
  });

  it('çapraz kur hesaplar', () => {
    const r = convertCurrency({ amount: 110, from: 'USD', to: 'EUR' }, table);
    expect(r.amount).toBeCloseTo(100, 6);
  });

  it('bilinmeyen para biriminde hata verir', () => {
    expect(() => convertCurrency({ amount: 1, from: 'XYZ', to: 'TRY' }, table)).toThrow();
  });
});
