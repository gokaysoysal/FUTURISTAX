import { describe, expect, it } from 'vitest';
import { calculatePayrollCost } from '../calculators/payroll-cost';
import { calculateSeverance } from '../calculators/severance';
import { getRates } from '../rates';

const rates = getRates(2025);

describe('kıdem tazminatı', () => {
  it('tam yıllar için 30 günlük ücret öder', () => {
    const r = calculateSeverance({ grossSalary: 30_000, years: 5 }, rates);
    expect(r.detail.grossSeverance).toBeCloseTo(150_000, 6);
  });

  it('tavanı aşan ücreti sınırlar', () => {
    const r = calculateSeverance({ grossSalary: 200_000, years: 1 }, rates);
    expect(r.detail.capApplied).toBe(true);
    expect(r.detail.cappedSalary).toBe(rates.severance.cap);
  });

  it('damga vergisini düşer', () => {
    const r = calculateSeverance({ grossSalary: 30_000, years: 1 }, rates);
    expect(r.detail.stampDuty).toBeCloseTo(30_000 * 0.00759, 6);
    expect(r.detail.netSeverance).toBeCloseTo(30_000 - 30_000 * 0.00759, 6);
  });

  it('ay ve gün artıklarını hesaba katar', () => {
    const r = calculateSeverance({ grossSalary: 36_500, years: 0, months: 0, days: 365 }, rates);
    expect(r.detail.grossSeverance).toBeCloseTo(36_500, 6);
  });
});

describe('SGK işveren maliyeti', () => {
  it('taban altındaki ücreti tabana yükseltir', () => {
    const r = calculatePayrollCost({ grossSalary: 1_000 }, rates);
    expect(r.detail.sgkBase).toBe(rates.payroll.sgkFloor);
  });

  it('tavan üstündeki ücreti tavana sabitler', () => {
    const r = calculatePayrollCost({ grossSalary: 999_999 }, rates);
    expect(r.detail.sgkBase).toBe(rates.payroll.sgkCeiling);
  });

  it('5 puanlık indirimi işveren payından düşer', () => {
    const withDiscount = calculatePayrollCost(
      { grossSalary: 50_000, apply5510Discount: true },
      rates,
    );
    const without = calculatePayrollCost({ grossSalary: 50_000 }, rates);
    expect(withDiscount.detail.employerSgk).toBeLessThan(without.detail.employerSgk);
    expect(without.detail.employerSgk - withDiscount.detail.employerSgk).toBeCloseTo(
      50_000 * 0.05,
      6,
    );
  });

  it('toplam maliyet brüt ücretten büyüktür', () => {
    const r = calculatePayrollCost({ grossSalary: 50_000 }, rates);
    expect(r.detail.employerTotalCost).toBeGreaterThan(50_000);
  });
});
