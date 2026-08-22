import type { RateSet } from '../types';

/**
 * 2024 vergi yılı oran ve limitleri.
 *
 * ⚠️ DOĞRULANMAMIŞ. Aşağıdaki değerler geliştirme sırasında yer tutucu olarak
 * girilmiştir. Yayına almadan önce her kalem Resmî Gazete / GİB tebliğinden
 * teyit edilmeli, `verified: true` ve `source` alanı doldurulmalıdır.
 *
 * Doğrulama kaynakları:
 *   - GVK tarifesi        → GVK Genel Tebliği (yıllık)
 *   - Binek araç limitleri → GVK Genel Tebliği (yıllık), GVK Md. 40/1, 40/5, 40/7
 *   - SGK taban/tavan     → SGK Genelgesi (yılda 2 kez güncellenir)
 *   - Kıdem tavanı        → Hazine ve Maliye Bakanlığı Genelgesi (6 aylık)
 */
export const rates2024: RateSet = {
  provenance: {
    year: 2024,
    verified: false,
    source: null,
    checkedAt: null,
    notes:
      'Tüm kalemler doğrulama bekliyor. SGK taban/tavan ve kıdem tavanı yıl içinde ' +
      'iki kez değişir — dönemsel değer desteği eklenmeli.',
  },

  vat: {
    standard: 0.2,
    reduced: 0.1,
    basic: 0.01,
  },

  corporate: {
    standard: 0.25,
    financialInstitutions: 0.3,
    exportIncome: 0.2,
    domesticMinimum: 0.1,
  },

  // GVK Md. 103 — ücret dışı gelirler
  incomeTaxBrackets: [
    { from: 0, to: 110_000, rate: 0.15 },
    { from: 110_000, to: 230_000, rate: 0.2 },
    { from: 230_000, to: 580_000, rate: 0.27 },
    { from: 580_000, to: 3_000_000, rate: 0.35 },
    { from: 3_000_000, to: null, rate: 0.4 },
  ],

  // GVK Md. 103 — ücret gelirleri (3. dilim sınırı farklıdır)
  employmentIncomeBrackets: [
    { from: 0, to: 110_000, rate: 0.15 },
    { from: 110_000, to: 230_000, rate: 0.2 },
    { from: 230_000, to: 870_000, rate: 0.27 },
    { from: 870_000, to: 3_000_000, rate: 0.35 },
    { from: 3_000_000, to: null, rate: 0.4 },
  ],

  vehicleExpense: {
    deductibleRatio: 0.7,
    monthlyRentCap: 26_000,
    taxExpenseCap: 690_000,
    depreciationCapExclTaxes: 790_000,
    depreciationCapInclTaxes: 1_500_000,
  },

  payroll: {
    employeeSgk: 0.14,
    employeeUnemployment: 0.01,
    employerSgk: 0.2075,
    employerUnemployment: 0.02,
    employerDiscount5510: 0.05,
    sgkFloor: 20_002.5,
    sgkCeiling: 150_018.75,
  },

  severance: {
    cap: 41_828.42,
    stampDutyRate: 0.00759,
  },

  rentalIncomeExemption: 33_000,
};
