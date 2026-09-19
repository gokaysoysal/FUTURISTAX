import { COMMON_FAQS, type ToolMeta } from './types';

// TASLAK METİN — firma revizyonu bekliyor. Somut oran/tutar yazılmadı.
export const binekAracKiraSiniri: ToolMeta = {
  slug: 'binek-arac-kira-siniri',
  title: 'Binek araç kira sınırı',
  short: 'Binek araç kira sınırı',
  description:
    'Aylık binek otomobil kira bedelinin yasal üst sınırı aşan kısmı ve ona isabet eden KDV.',
  intro:
    'Aylık kira bedelinin yasal üst sınırı aşan kısmı gider yazılamaz; aşan tutara isabet eden ' +
    'KDV de indirilemez. Bu araç aylık ve dönemsel indirilebilir tutarı hesaplar.',
  basis: 'GVK Md. 40/1',
  howTo: {
    name: 'Binek araç kira sınırı nasıl hesaplanır',
    steps: [
      'Vergi yılını seçin.',
      'Aylık kira bedelini (KDV hariç) ve kiralama süresini (ay) girin.',
      'Aylık indirilebilir tutar, aşan tutar ve dönemsel KKEG görünür.',
    ],
  },
  faqs: [
    {
      question: 'Kısa dönemli kiralama da kapsama girer mi?',
      answer:
        'Aylık kira bedeli üst sınırı aştığında kısıt uygulanır. Süreyi ay olarak girerek ' +
        'dönemsel toplamı görebilirsiniz.',
    },
    COMMON_FAQS.rates,
    COMMON_FAQS.binding,
  ],
  order: 5,
};
