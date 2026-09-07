import { COMMON_FAQS, type ToolMeta } from './types';

// TASLAK METİN — firma revizyonu bekliyor. Endeks değerleri motorda,
// DOĞRULANMAMIŞ (CPI_PROVENANCE.verified === false).
export const tufeGuncelleme: ToolMeta = {
  slug: 'tufe-guncelleme',
  title: 'TÜFE güncelleme',
  short: 'TÜFE güncelleme',
  description: 'İki yıl arasında TÜİK yıl sonu endeksine göre satın alma gücü güncellemesi.',
  intro:
    'Bir tutarı, seçtiğiniz iki yıl arasındaki TÜİK yıl sonu TÜFE endeksine göre günceller; ' +
    'kümülatif enflasyonu ve satın alma gücü kaybını gösterir.',
  basis: 'TÜİK TÜFE endeksi',
  howTo: {
    name: 'TÜFE güncellemesi nasıl yapılır',
    steps: [
      'Güncellenecek tutarı girin.',
      'Başlangıç ve hedef yılı seçin.',
      'Güncellenmiş değer ve kümülatif enflasyon görünür.',
    ],
  },
  faqs: [
    {
      question: 'Endeks verisi güncel mi?',
      answer:
        'Endeks değerleri motorda tutulur ve şu an DOĞRULANMAMIŞTIR; 2025 ve sonrası eksiktir. ' +
        'Sonuç bloğundaki uyarı bandı bunu belirtir.',
    },
    {
      question: 'Hangi endeksi kullanıyor?',
      answer: 'TÜİK’in yıl sonu TÜFE endeksi (2003 = 100 tabanlı) kullanılır.',
    },
    COMMON_FAQS.binding,
  ],
  order: 8,
};
