/**
 * Yasal metin sürümleri.
 *
 * Rıza kaydı hangi metin sürümüne karşı verildiğini saklar. Metin
 * güncellendiğinde sürüm artırılır; eski rızalar eski sürüme bağlı kalır.
 * KVKK denetiminde "kullanıcı neyi onayladı" sorusunun cevabı budur.
 */
export const LEGAL_VERSIONS = {
  kvkkNotice: '2026.08-taslak',
  privacyPolicy: '2026.08-taslak',
  cookiePolicy: '2026.08-taslak',
} as const;

/**
 * ⚠️ Metinler HUKUKÇU ONAYINDAN GEÇMEDİ.
 *
 * Sürüm etiketlerindeki "taslak" ibaresi bilinçlidir. Onay alındığında
 * sürümler "2026.09" gibi net bir etikete çevrilmeli ve bu bayrak
 * `true` yapılmalıdır. `false` iken sayfalarda uyarı bandı gösterilir.
 */
export const LEGAL_TEXTS_APPROVED = false;
