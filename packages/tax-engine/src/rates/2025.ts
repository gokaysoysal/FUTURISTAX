import type { RateSet } from '../types';

/**
 * 2025 vergi yılı oran ve limitleri.
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
export const rates2025: RateSet = {
  provenance: {
    year: 2025,
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
    { from: 0, to: 158_000, rate: 0.15 },
    { from: 158_000, to: 330_000, rate: 0.2 },
    { from: 330_000, to: 800_000, rate: 0.27 },
    { from: 800_000, to: 4_300_000, rate: 0.35 },
    { from: 4_300_000, to: null, rate: 0.4 },
  ],

  // GVK Md. 103 — ücret gelirleri (3. dilim sınırı farklıdır)
  employmentIncomeBrackets: [
    { from: 0, to: 158_000, rate: 0.15 },
    { from: 158_000, to: 330_000, rate: 0.2 },
    { from: 330_000, to: 1_200_000, rate: 0.27 },
    { from: 1_200_000, to: 4_300_000, rate: 0.35 },
    { from: 4_300_000, to: null, rate: 0.4 },
  ],

  vehicleExpense: {
    deductibleRatio: 0.7,
    monthlyRentCap: 37_000,
    taxExpenseCap: 990_000,
    depreciationCapExclTaxes: 1_100_000,
    depreciationCapInclTaxes: 2_100_000,
  },

  payroll: {
    employeeSgk: 0.14,
    employeeUnemployment: 0.01,
    employerSgk: 0.2075,
    employerUnemployment: 0.02,
    employerDiscount5510: 0.05,
    sgkFloor: 26_005.5,
    sgkCeiling: 195_041.4,
  },

  severance: {
    cap: 53_919.68,
    stampDutyRate: 0.00759,
  },

  rentalIncomeExemption: 47_000,
};
