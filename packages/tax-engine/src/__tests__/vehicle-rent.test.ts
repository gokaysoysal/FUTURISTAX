import { describe, expect, it } from 'vitest';
import { calculateRentExpense } from '../calculators/rent-expense';
import { calculateVehicleExpense } from '../calculators/vehicle-expense';
import { getRates } from '../rates';

const rates = getRates(2025);

describe('binek araç gider kısıtı', () => {
  it('giderin %70ini indirilebilir sayar', () => {
    const r = calculateVehicleExpense({ annualExpense: 100_000 }, rates);
    expect(r.detail.deductibleExpense).toBeCloseTo(70_000, 6);
    expect(r.detail.nonDeductibleExpense).toBeCloseTo(30_000, 6);
  });

  it('KDVyi de aynı oranda böler', () => {
    const r = calculateVehicleExpense({ annualExpense: 100_000 }, rates);
    expect(r.detail.deductibleVat).toBeCloseTo(14_000, 6); // 20.000 * %70
    expect(r.detail.nonDeductibleVat).toBeCloseTo(6_000, 6);
  });

  it('KKEG toplamı gider ve KDV kısıtlarının toplamıdır', () => {
    const r = calculateVehicleExpense({ annualExpense: 100_000 }, rates);
    expect(r.detail.disallowed).toBeCloseTo(36_000, 6);
    expect(r.headline.value).toBeCloseTo(36_000, 6);
  });
});

describe('binek araç kira gider sınırı', () => {
  it('limit altındaki kirada KKEG doğmaz', () => {
    const r = calculateRentExpense({ monthlyRent: 20_000 }, rates);
    expect(r.detail.excessMonthly).toBe(0);
    expect(r.detail.disallowedTotal).toBe(0);
    expect(r.detail.deductibleTotal).toBeCloseTo(240_000, 6);
  });

  it('limiti aşan kısmı ve KDVsini KKEGe atar', () => {
    // 2025 limiti 37.000 — 50.000 kira → 13.000 aşım + 2.600 KDV
    const r = calculateRentExpense({ monthlyRent: 50_000, months: 1 }, rates);
    expect(r.detail.deductibleMonthly).toBe(37_000);
    expect(r.detail.excessMonthly).toBe(13_000);
    expect(r.detail.disallowedTotal).toBeCloseTo(15_600, 6);
  });

  it('ay sayısını çarpan olarak uygular', () => {
    const r = calculateRentExpense({ monthlyRent: 50_000, months: 6 }, rates);
    expect(r.detail.disallowedTotal).toBeCloseTo(93_600, 6);
  });
});
