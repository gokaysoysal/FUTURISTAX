import { COMMON_FAQS, type ToolMeta } from './types';

// TASLAK METİN — firma revizyonu bekliyor. Kur verisi /api/rates → TCMB.
// Kaynak erişilemezse UYDURMA KUR ÜRETİLMEZ; sonuç gizlenir.
export const kurCevirici: ToolMeta = {
  slug: 'kur-cevirici',
  title: 'Kur çevirici',
  short: 'Kur çevirici',
  description:
    'TCMB günlük döviz satış kuruna göre para birimi çevirimi. Servis erişilemezse sonuç ' +
    'gösterilmez.',
  intro:
    'Para birimleri arasında çeviri yapar. Kur verisi TCMB’nin günlük yayımladığı döviz satış ' +
    'kurundan gelir. Kaynağa ulaşılamazsa uydurma bir kur gösterilmez; sonuç gizlenir.',
  basis: 'TCMB günlük döviz kuru',
  howTo: {
    name: 'Kur çevirici nasıl kullanılır',
    steps: [
      'Tutarı girin.',
      'Kaynak ve hedef para birimini seçin.',
      'Uygulanan kur, kur tarihi ve karşılık tutarı görünür.',
    ],
  },
  faqs: [
    {
      question: 'Hangi kur kullanılıyor?',
      answer:
        'TCMB’nin ilgili gün için yayımladığı döviz satış kuru. Kur tarihi sonuçta ayrıca ' +
        'gösterilir.',
    },
    {
      question: 'Kur alınamazsa ne oluyor?',
      answer:
        'Sonuç gösterilmez ve “kur verisi şu an güncellenemiyor” uyarısı çıkar. Bu bilinçli bir ' +
        'tercihtir: yanlış bir kurla işlem yapmanızı istemiyoruz.',
    },
    COMMON_FAQS.binding,
  ],
  order: 9,
};
