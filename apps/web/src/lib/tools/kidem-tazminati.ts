import { COMMON_FAQS, type ToolMeta } from './types';

// TASLAK METİN — firma revizyonu bekliyor. Somut tavan/oran yazılmadı.
export const kidemTazminati: ToolMeta = {
  slug: 'kidem-tazminati',
  title: 'Kıdem tazminatı hesaplama',
  short: 'Kıdem tazminatı',
  description:
    'Her tam hizmet yılı için 30 günlük giydirilmiş brüt ücret; yasal tavan ve damga vergisi.',
  intro:
    'Giydirilmiş brüt ücret ve hizmet süresinden brüt kıdem tazminatını hesaplar; hesaba esas ' +
    'ücret yasal tavanla sınırlanır, yalnızca damga vergisi kesilir.',
  basis: '1475 sayılı Kanun Md. 14',
  howTo: {
    name: 'Kıdem tazminatı nasıl hesaplanır',
    steps: [
      'Vergi yılını seçin (tavan yıla bağlıdır).',
      'Giydirilmiş aylık brüt ücreti girin.',
      'Toplam hizmet süresini yıl / ay / gün olarak girin.',
      'Brüt tazminat, damga vergisi ve net ödenecek tutar görünür.',
    ],
  },
  faqs: [
    {
      question: 'Giydirilmiş ücret ne demek?',
      answer:
        'Çıplak ücrete; yol, yemek, düzenli ikramiye gibi süreklilik arz eden yan hakların ' +
        'eklenmiş hâlidir. Hesaba esas ücret bu tutar üzerinden alınır.',
    },
    {
      question: 'Kıdem tazminatından gelir vergisi kesilir mi?',
      answer:
        'Kıdem tazminatı gelir vergisinden istisnadır; yalnızca damga vergisi kesilir. Sonuç ' +
        'bunu ayrı bir kalem olarak gösterir.',
    },
    COMMON_FAQS.binding,
  ],
  order: 7,
};
