import { COMMON_FAQS, type ToolMeta } from './types';

// TASLAK METİN — firma revizyonu bekliyor. Somut oran/dilim yazılmadı.
export const gelirVergisi: ToolMeta = {
  slug: 'gelir-vergisi',
  title: 'Gelir vergisi hesaplama',
  short: 'Gelir vergisi',
  description:
    'GVK artan oranlı tarifeye göre yıllık gelir vergisi; efektif ve marjinal oran, dilim dökümü.',
  intro:
    'Yıllık gayrisafi geliriniz ve indirimlerinizden hareketle gelir vergisini artan oranlı ' +
    'tarifeye göre hesaplar; her dilime düşen vergiyi ayrı ayrı gösterir.',
  basis: 'GVK Md. 103',
  howTo: {
    name: 'Gelir vergisi nasıl hesaplanır',
    steps: [
      'Vergi yılını ve gelir türünü (ücret / ücret dışı) seçin.',
      'Yıllık gayrisafi geliri girin.',
      'Varsa indirilebilir gider ve indirimleri girin.',
      'Matrah, hesaplanan vergi, efektif ve marjinal oran görünür.',
    ],
  },
  faqs: [
    {
      question: 'Ücret geliri ile ücret dışı gelir arasında ne fark var?',
      answer:
        'İki gelir türü için tarife farklı uygulanabilir. Maaş bordrosundan doğan gelir için ' +
        '“ücret”, ticari/serbest meslek/kira gelirleri için “ücret dışı” seçin.',
    },
    COMMON_FAQS.rates,
    COMMON_FAQS.binding,
  ],
  order: 2,
};
