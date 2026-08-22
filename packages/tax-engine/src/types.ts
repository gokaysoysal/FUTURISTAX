/**
 * Vergi motoru çekirdek tipleri.
 *
 * Tasarım kuralı: hesaplayıcılar SAF fonksiyondur.
 *   (input, rates) => Result
 * Tarih okumaz, ağ erişimi yapmaz, rastgelelik içermez, global okumaz.
 * Bu sayede tamamı deterministik olarak test edilebilir.
 */

export type TaxYear = 2024 | 2025 | 2026;

/**
 * Her oran/limit kümesi kaynağını ve doğrulanma durumunu taşır.
 *
 * `verified: false` olan bir yıl UI'da uyarı bandı ile gösterilir.
 * Bu, "uydurma resmî içerik üretme" kuralının tip düzeyindeki karşılığıdır:
 * doğrulanmamış veri sessizce doğruymuş gibi sunulamaz.
 */
export interface RateProvenance {
  year: TaxYear;
  verified: boolean;
  /** Resmî kaynak URL'i (Resmî Gazete, GİB tebliği, mevzuat.gov.tr) */
  source: string | null;
  /** Son doğrulama tarihi, ISO 8601 */
  checkedAt: string | null;
  notes?: string;
}

/** Artan oranlı tarife dilimi */
export interface TaxBracket {
  /** Dilimin başlangıcı (dahil) */
  from: number;
  /** Dilimin bitişi (dahil). null = üst sınır yok */
  to: number | null;
  /** Ondalık oran, örn. 0.15 */
  rate: number;
}

export interface VatRates {
  standard: number;
  reduced: number;
  basic: number;
}

export interface CorporateTaxRates {
  standard: number;
  financialInstitutions: number;
  /** İhracat kazançlarına uygulanan indirimli oran */
  exportIncome: number;
  /** Yurt içi asgari kurumlar vergisi oranı */
  domesticMinimum: number | null;
}

export interface VehicleExpenseLimits {
  /** Gider olarak kabul edilen oran (örn. 0.70) */
  deductibleRatio: number;
  /** Aylık kiralama gider üst sınırı, TL */
  monthlyRentCap: number;
  /** ÖTV + KDV'nin doğrudan gider yazılabilir üst sınırı, TL */
  taxExpenseCap: number;
  /** Amortismana esas bedel üst sınırı (ÖTV/KDV hariç), TL */
  depreciationCapExclTaxes: number;
  /** Amortismana esas bedel üst sınırı (vergiler maliyete eklenmişse), TL */
  depreciationCapInclTaxes: number;
}

export interface PayrollRates {
  employeeSgk: number;
  employeeUnemployment: number;
  employerSgk: number;
  employerUnemployment: number;
  /** 5510 sayılı Kanun 5 puanlık indirim */
  employerDiscount5510: number;
  /** SPEK alt sınırı (aylık brüt), TL */
  sgkFloor: number;
  /** SPEK üst sınırı (aylık brüt), TL */
  sgkCeiling: number;
}

export interface SeveranceLimits {
  /** Kıdem tazminatı tavanı (yıllık dönem başına), TL */
  cap: number;
  /** Damga vergisi oranı (binde 7,59) */
  stampDutyRate: number;
}

export interface RateSet {
  provenance: RateProvenance;
  vat: VatRates;
  corporate: CorporateTaxRates;
  /** Ücret dışı gelirler için GVK tarifesi */
  incomeTaxBrackets: TaxBracket[];
  /** Ücret gelirleri için GVK tarifesi */
  employmentIncomeBrackets: TaxBracket[];
  vehicleExpense: VehicleExpenseLimits;
  payroll: PayrollRates;
  severance: SeveranceLimits;
  /** Konut kira geliri istisnası, TL */
  rentalIncomeExemption: number;
}

/**
 * Her hesap sonucu, ara adımları da döndürür. Kullanıcıya "sonuç" değil
 * "hesabın nasıl çıktığı" gösterilir — danışmanlık markası için asıl değer bu.
 */
export interface CalculationStep {
  label: string;
  value: number;
  /** Gösterim biçimi */
  kind: 'currency' | 'percent' | 'number';
  /** Dayanak: kanun maddesi, tebliğ vb. */
  basis?: string;
  /** Negatif/uyarı niteliğinde bir kalem mi (KKEG, kısıt vb.) */
  emphasis?: 'neutral' | 'positive' | 'warning';
}

export interface CalculationResult<T> {
  /** Öne çıkan sonuç */
  headline: { label: string; value: number; kind: CalculationStep['kind'] };
  steps: CalculationStep[];
  detail: T;
  provenance: RateProvenance;
}
