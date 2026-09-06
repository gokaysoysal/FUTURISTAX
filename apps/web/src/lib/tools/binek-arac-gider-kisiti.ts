import { COMMON_FAQS, type ToolMeta } from './types';

// TASLAK METİN — firma revizyonu bekliyor. Somut oran/tutar yazılmadı.
export const binekAracGiderKisiti: ToolMeta = {
  slug: 'binek-arac-gider-kisiti',
  title: 'Binek araç gider kısıtı',
  short: 'Binek araç gider kısıtı',
  description:
    'GVK Md. 40/5 uyarınca binek otomobil giderlerinin indirilemeyen kısmı ve ona isabet eden ' +
    'KDV.',
  intro:
    'Binek otomobil giderlerinin yalnızca bir kısmı indirilebilir; kalan tutar ve ona isabet ' +
    'eden KDV kanunen kabul edilmeyen giderdir. Bu araç indirilebilir ve KKEG tutarını ayırır.',
  basis: 'GVK Md. 40/5',
  howTo: {
    name: 'Binek araç gider kısıtı nasıl hesaplanır',
    steps: [
      'Vergi yılını seçin.',
      'Yıllık binek otomobil gideri toplamını (KDV hariç) girin.',
      'İndirilebilir tutar ve KKEG olarak ayrılan kısım görünür.',
    ],
  },
  faqs: [
    {
      question: 'Hangi giderler bu kapsama girer?',
      answer:
        'Yakıt, bakım-onarım, sigorta ve benzeri işletme giderleri. Amortisman ve kiralama ' +
        'için ayrı kısıtlar vardır.',
    },
    COMMON_FAQS.rates,
    COMMON_FAQS.binding,
  ],
  order: 4,
};
