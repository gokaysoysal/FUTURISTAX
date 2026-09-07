import {
  calculateCorporateTax,
  calculatePayrollCost,
  calculateVat,
  getRates,
  type RateProvenance,
  type TaxYear,
} from '@futuristax/tax-engine';

/**
 * Vergi Yükü Panosu — UI tarafı TOPLAMA katmanı.
 *
 * Yeni vergi mantığı YOK: kurumlar vergisi / KDV / SGK tutarları
 * `@futuristax/tax-engine` saf fonksiyonlarından gelir. Buradaki tek iş
 * bunları paya çevirmek ve yıl içine (eşit dağıtım varsayımıyla) yaymak.
 */

export type BurdenInput = {
  revenue: number;
  profit: number;
  avgGross: number;
  headcount: number;
  year: TaxYear;
};

export type BurdenComponent = {
  key: 'kv' | 'kdv' | 'sgk';
  label: string;
  annual: number;
  share: number;
};

export type BurdenMonth = {
  month: string;
  label: string;
  cumulative: number;
  kv: number;
  kdv: number;
  sgk: number;
};

export type BurdenResult = {
  components: BurdenComponent[];
  total: number;
  effectiveOnRevenue: number;
  timeline: BurdenMonth[];
  provenance: RateProvenance;
};

/** Pano girdileri — Vergi Yükü Panosu ve Yıl Karşılaştırma ortak kullanır. */
export const BURDEN_FIELDS = [
  { key: 'revenue', label: 'Yıllık ciro', min: 0, max: 50_000_000, step: 250_000, money: true },
  { key: 'profit', label: 'Yıllık ticari kâr', min: 0, max: 15_000_000, step: 100_000, money: true },
  { key: 'avgGross', label: 'Ortalama aylık brüt ücret', min: 0, max: 300_000, step: 5_000, money: true },
  { key: 'headcount', label: 'Çalışan sayısı', min: 0, max: 500, step: 1, money: false },
] as const satisfies ReadonlyArray<{
  key: keyof Omit<BurdenInput, 'year'>;
  label: string;
  min: number;
  max: number;
  step: number;
  money: boolean;
}>;

export const BURDEN_DEFAULTS: Omit<BurdenInput, 'year'> = {
  revenue: 6_000_000,
  profit: 900_000,
  avgGross: 45_000,
  headcount: 8,
};

const MONTHS = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

/** Geçici vergi 3'er aylık dönemler hâlinde ödenir; burada çeyrek sonlarına
 *  eşit dağıtılır (panoda "eşit dağıtım varsayımı" olarak etiketlenir). */
const KV_QUARTER_MONTHS = [2, 5, 8, 11];

export function computeBurden(input: BurdenInput): BurdenResult {
  const rates = getRates(input.year);

  const kvAnnual = calculateCorporateTax(
    {
      commercialProfit: Math.max(0, input.profit),
      disallowedExpenses: 0,
      exemptions: 0,
      band: 'standard',
    },
    rates,
  ).detail.payableTax;

  const kdvAnnual = calculateVat(
    { amount: Math.max(0, input.revenue), direction: 'add', band: 'standard' },
    rates,
  ).detail.vat;

  const payroll = calculatePayrollCost({ grossSalary: Math.max(0, input.avgGross) }, rates).detail;
  const headcount = Math.max(0, Math.round(input.headcount));
  const sgkAnnual = (payroll.employerSgk + payroll.employerUnemployment) * 12 * headcount;

  const total = kvAnnual + kdvAnnual + sgkAnnual;
  const share = (value: number) => (total > 0 ? value / total : 0);

  const components: BurdenComponent[] = [
    { key: 'kv', label: 'Kurumlar vergisi', annual: kvAnnual, share: share(kvAnnual) },
    { key: 'kdv', label: 'Hesaplanan KDV (brüt)', annual: kdvAnnual, share: share(kdvAnnual) },
    { key: 'sgk', label: 'SGK işveren payı', annual: sgkAnnual, share: share(sgkAnnual) },
  ];

  const monthlyKdv = kdvAnnual / 12;
  const monthlySgk = sgkAnnual / 12;
  const kvPerQuarter = kvAnnual / KV_QUARTER_MONTHS.length;

  let cumulative = 0;
  const timeline: BurdenMonth[] = MONTHS.map((month, index) => {
    const kv = KV_QUARTER_MONTHS.includes(index) ? kvPerQuarter : 0;
    cumulative += kv + monthlyKdv + monthlySgk;
    return { month, label: `${month} ayı`, cumulative, kv, kdv: monthlyKdv, sgk: monthlySgk };
  });

  return {
    components,
    total,
    effectiveOnRevenue: input.revenue > 0 ? total / input.revenue : 0,
    timeline,
    provenance: rates.provenance,
  };
}
