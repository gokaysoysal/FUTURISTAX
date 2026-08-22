import type { CalculationResult, RateSet } from '../types';

export interface PayrollInput {
  /** Aylık brüt ücret */
  grossSalary: number;
  /** 5510 sayılı Kanun 5 puanlık işveren indiriminden yararlanılıyor mu */
  apply5510Discount?: boolean;
}

export interface PayrollDetail {
  sgkBase: number;
  employeeSgk: number;
  employeeUnemployment: number;
  employerSgk: number;
  employerUnemployment: number;
  employerTotalCost: number;
  employeeDeductions: number;
  discountApplied: boolean;
}

/**
 * SGK işveren maliyeti — 5510 sayılı Kanun.
 *
 * Not: Gelir vergisi ve damga vergisi stopajı bu hesaba dahil değildir;
 * kümülatif matrah gerektirdiği için ayrı bir bordro modülünde ele alınır.
 */
export function calculatePayrollCost(
  input: PayrollInput,
  rates: RateSet,
): CalculationResult<PayrollDetail> {
  const p = rates.payroll;
  const gross = Math.max(0, input.grossSalary);

  // Prime esas kazanç taban ve tavan arasında sınırlandırılır
  const sgkBase = Math.min(Math.max(gross, p.sgkFloor), p.sgkCeiling);

  const discountApplied = Boolean(input.apply5510Discount);
  const employerSgkRate = discountApplied ? p.employerSgk - p.employerDiscount5510 : p.employerSgk;

  const employeeSgk = sgkBase * p.employeeSgk;
  const employeeUnemployment = sgkBase * p.employeeUnemployment;
  const employerSgk = sgkBase * employerSgkRate;
  const employerUnemployment = sgkBase * p.employerUnemployment;

  const employerTotalCost = gross + employerSgk + employerUnemployment;

  return {
    headline: { label: 'İşverene toplam maliyet', value: employerTotalCost, kind: 'currency' },
    steps: [
      { label: 'Brüt ücret', value: gross, kind: 'currency' },
      { label: 'Prime esas kazanç', value: sgkBase, kind: 'currency', basis: '5510 Md. 82' },
      { label: 'İşçi SGK payı', value: employeeSgk, kind: 'currency', emphasis: 'warning' },
      { label: 'İşçi işsizlik payı', value: employeeUnemployment, kind: 'currency', emphasis: 'warning' },
      { label: 'İşveren SGK payı', value: employerSgk, kind: 'currency' },
      { label: 'İşveren işsizlik payı', value: employerUnemployment, kind: 'currency' },
      { label: 'Toplam işveren maliyeti', value: employerTotalCost, kind: 'currency', emphasis: 'positive' },
    ],
    detail: {
      sgkBase,
      employeeSgk,
      employeeUnemployment,
      employerSgk,
      employerUnemployment,
      employerTotalCost,
      employeeDeductions: employeeSgk + employeeUnemployment,
      discountApplied,
    },
    provenance: rates.provenance,
  };
}
