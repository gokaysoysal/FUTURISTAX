import { COMMON_FAQS, type ToolMeta } from './types';

// TASLAK METİN — firma revizyonu bekliyor. Somut oran yazılmadı.
export const kurumlarVergisi: ToolMeta = {
  slug: 'kurumlar-vergisi',
  title: 'Kurumlar vergisi hesaplama',
  short: 'Kurumlar vergisi',
  description:
    'Ticari kâr, KKEG, istisna ve geçmiş yıl zararlarından matrah; yurt içi asgari kurumlar ' +
    'vergisi karşılaştırması.',
  intro:
    'Ticari bilanço kârından yola çıkıp kanunen kabul edilmeyen giderleri ekler, istisna ve ' +
    'geçmiş yıl zararlarını düşer; isteğe bağlı olarak yurt içi asgari kurumlar vergisiyle ' +
    'karşılaştırır.',
  basis: '5520 sayılı Kurumlar Vergisi Kanunu',
  howTo: {
    name: 'Kurumlar vergisi nasıl hesaplanır',
    steps: [
      'Vergi yılını ve oran grubunu seçin.',
      'Ticari kârı, KKEG’yi, istisnaları ve geçmiş yıl zararlarını girin.',
      'Gerekiyorsa yurt içi asgari kurumlar vergisi karşılaştırmasını açın.',
      'Matrah ve ödenecek vergi adım adım görünür.',
    ],
  },
  faqs: [
    {
      question: 'Yurt içi asgari kurumlar vergisi nedir?',
      answer:
        'Belirli bir matrah üzerinden hesaplanan asgari bir vergidir; hesaplanan vergi bundan ' +
        'düşükse asgari tutar ödenir. Kutuyu işaretlediğinizde karşılaştırma sonuca eklenir.',
    },
    COMMON_FAQS.rates,
    COMMON_FAQS.binding,
  ],
  order: 3,
};
