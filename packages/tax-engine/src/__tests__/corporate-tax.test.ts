import { describe, expect, it } from 'vitest';
import { calculateCorporateTax } from '../calculators/corporate-tax';
import { getRates } from '../rates';

const rates = getRates(2025);

describe('kurumlar vergisi', () => {
  it('matrahı KKEG ekleyip istisnaları düşerek bulur', () => {
    const r = calculateCorporateTax(
      { commercialProfit: 1_000_000, disallowedExpenses: 200_000, exemptions: 300_000, band: 'standard' },
      rates,
    );
    expect(r.detail.taxableBase).toBe(900_000);
    expect(r.detail.payableTax).toBeCloseTo(225_000, 6);
  });

  it('geçmiş yıl zararlarını düşer', () => {
    const r = calculateCorporateTax(
      { commercialProfit: 500_000, disallowedExpenses: 0, exemptions: 0, priorLosses: 200_000, band: 'standard' },
      rates,
    );
    expect(r.detail.taxableBase).toBe(300_000);
  });

  it('matrah negatife düşerse sıfırlar', () => {
    const r = calculateCorporateTax(
      { commercialProfit: 100_000, disallowedExpenses: 0, exemptions: 500_000, band: 'standard' },
      rates,
    );
    expect(r.detail.taxableBase).toBe(0);
    expect(r.detail.payableTax).toBe(0);
  });

  it('finans kurumlarına %30 uygular', () => {
    const r = calculateCorporateTax(
      { commercialProfit: 1_000_000, disallowedExpenses: 0, exemptions: 0, band: 'financialInstitutions' },
      rates,
    );
    expect(r.detail.rate).toBe(0.3);
    expect(r.detail.payableTax).toBeCloseTo(300_000, 6);
  });

  it('asgari kurumlar vergisi büyükse onu uygular', () => {
    // İstisna nedeniyle normal vergi düşük, asgari devreye girer
    const r = calculateCorporateTax(
      {
        commercialProfit: 1_000_000,
        disallowedExpenses: 0,
        exemptions: 900_000,
        band: 'standard',
        applyDomesticMinimum: true,
      },
      rates,
    );
    expect(r.detail.computedTax).toBeCloseTo(25_000, 6); // 100.000 * %25
    expect(r.detail.minimumTax).toBeCloseTo(100_000, 6); // 1.000.000 * %10
    expect(r.detail.minimumApplied).toBe(true);
    expect(r.detail.payableTax).toBeCloseTo(100_000, 6);
  });

  it('asgari vergi küçükse normal vergiyi korur', () => {
    const r = calculateCorporateTax(
      { commercialProfit: 1_000_000, disallowedExpenses: 0, exemptions: 0, band: 'standard', applyDomesticMinimum: true },
      rates,
    );
    expect(r.detail.minimumApplied).toBe(false);
    expect(r.detail.payableTax).toBeCloseTo(250_000, 6);
  });
});
