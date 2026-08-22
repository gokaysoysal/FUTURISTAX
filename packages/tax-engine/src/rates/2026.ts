import type { RateSet } from '../types';
import { rates2025 } from './2025';

/**
 * 2026 vergi yılı.
 *
 * ⛔ HENÜZ GİRİLMEDİ. 2026 oran ve limitleri yeniden değerleme oranına bağlı
 * olarak Aralık 2025 sonunda Resmî Gazete'de yayımlanır.
 *
 * Bu dosya bilinçli olarak 2025 değerlerini devralır ve `verified: false`
 * bayrağıyla işaretlenir. UI, doğrulanmamış bir yıl seçildiğinde kullanıcıya
 * görünür bir uyarı gösterir — değerler asla doğruymuş gibi sunulmaz.
 *
 * Gerçek 2026 değerleri girilene kadar bu dosyayı "tamamlanmış" saymayın.
 */
export const rates2026: RateSet = {
  ...rates2025,
  provenance: {
    year: 2026,
    verified: false,
    source: null,
    checkedAt: null,
    notes:
      '2026 resmî değerleri henüz girilmedi; geçici olarak 2025 tablosu kullanılıyor. ' +
      'Yeniden değerleme oranı yayımlandıktan sonra tüm parasal limitler güncellenmelidir.',
  },
};
