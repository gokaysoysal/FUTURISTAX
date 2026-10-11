import type { CalculationResult, RateSet } from '../types';

export type VatDirection = 'add' | 'extract';
export type VatBand = 'standard' | 'reduced' | 'basic';

export interface VatInput {
  amount: number;
  /** 'add' = KDV hariç tutardan KDV'li tutara, 'extract' = KDV dahil tutardan ayrıştırma */
  direction: VatDirection;
  band: VatBand;
}

export interface VatDetail {
  net: number;
  vat: number;
  gross: number;
  rate: number;
}

/** KDV hesaplama — 3065 sayılı Katma Değer Vergisi Kanunu */
export function calculateVat(input: VatInput, rates: RateSet): CalculationResult<VatDetail> {
  const rate = rates.vat[input.band];
  const amount = Math.max(0, input.amount);

  const net = input.direction === 'add' ? amount : amount / (1 + rate);
  const vat = net * rate;
  const gross = net + vat;

  return {
    headline: { label: 'KDV tutarı', value: vat, kind: 'currency' },
    steps: [
      { label: 'Matrah (KDV hariç)', value: net, kind: 'currency' },
      { label: 'KDV oranı', value: rate, kind: 'percent', basis: 'KDVK Md. 28' },
      { label: 'Hesaplanan KDV', value: vat, kind: 'currency' },
      { label: 'Toplam (KDV dahil)', value: gross, kind: 'currency', emphasis: 'positive' },
    ],
    detail: { net, vat, gross, rate },
    provenance: rates.provenance,
  };
}
