import type { CalculationResult, CalculationStep, RateSet } from '../types';

export type CorporateBand = 'standard' | 'financialInstitutions' | 'exportIncome';

export interface CorporateTaxInput {
  /** Ticari bilanço kârı */
  commercialProfit: number;
  /** Kanunen kabul edilmeyen giderler */
  disallowedExpenses: number;
  /** İstisna ve indirimler */
  exemptions: number;
  /** Geçmiş yıl zararları */
  priorLosses?: number;
  band: CorporateBand;
  /** Yurt içi asgari kurumlar vergisi karşılaştırması yapılsın mı */
  applyDomesticMinimum?: boolean;
}

export interface CorporateTaxDetail {
  taxableBase: number;
  rate: number;
  computedTax: number;
  minimumTax: number | null;
  payableTax: number;
  netProfit: number;
  minimumApplied: boolean;
}

/**
 * Kurumlar vergisi — 5520 sayılı Kanun.
 *
 * Matrah = Ticari kâr + KKEG − İstisnalar − Geçmiş yıl zararları
 * Yurt içi asgari kurumlar vergisi devredeyse, hesaplanan vergi ile
 * asgari verginin büyüğü ödenir.
 */
export function calculateCorporateTax(
  input: CorporateTaxInput,
  rates: RateSet,
): CalculationResult<CorporateTaxDetail> {
  const rate = rates.corporate[input.band];
  const priorLosses = input.priorLosses ?? 0;

  const taxableBase = Math.max(
    0,
    input.commercialProfit + input.disallowedExpenses - input.exemptions - priorLosses,
  );

  const computedTax = taxableBase * rate;

  // Yurt içi asgari KV matrahı istisnalar düşülmeden hesaplanır
  const minRate = rates.corporate.domesticMinimum;
  const useMinimum = Boolean(input.applyDomesticMinimum) && minRate !== null;
  const minimumBase = Math.max(0, input.commercialProfit + input.disallowedExpenses);
  const minimumTax = useMinimum && minRate !== null ? minimumBase * minRate : null;

  const payableTax = minimumTax !== null ? Math.max(computedTax, minimumTax) : computedTax;
  const minimumApplied = minimumTax !== null && minimumTax > computedTax;

  // Dizi tipi açıkça belirtilir; aksi hâlde TypeScript ilk elemanlardan dar bir
  // tip çıkarır ve sonradan push edilen farklı `emphasis` değerini reddeder.
  const steps: CalculationStep[] = [
    { label: 'Ticari kâr', value: input.commercialProfit, kind: 'currency' },
    {
      label: 'Kanunen kabul edilmeyen giderler',
      value: input.disallowedExpenses,
      kind: 'currency',
      basis: 'KVK Md. 11',
      emphasis: 'warning',
    },
    { label: 'İstisna ve indirimler', value: -input.exemptions, kind: 'currency' },
    { label: 'Geçmiş yıl zararları', value: -priorLosses, kind: 'currency' },
    { label: 'Kurumlar vergisi matrahı', value: taxableBase, kind: 'currency' },
    { label: 'Vergi oranı', value: rate, kind: 'percent', basis: 'KVK Md. 32' },
    { label: 'Hesaplanan kurumlar vergisi', value: computedTax, kind: 'currency' },
  ];

  if (minimumTax !== null) {
    steps.push({
      label: 'Yurt içi asgari kurumlar vergisi',
      value: minimumTax,
      kind: 'currency',
      basis: 'KVK Md. 32/C',
      emphasis: minimumApplied ? 'warning' : 'neutral',
    });
  }

  return {
    headline: { label: 'Ödenecek kurumlar vergisi', value: payableTax, kind: 'currency' },
    steps,
    detail: {
      taxableBase,
      rate,
      computedTax,
      minimumTax,
      payableTax,
      netProfit: input.commercialProfit - payableTax,
      minimumApplied,
    },
    provenance: rates.provenance,
  };
}
