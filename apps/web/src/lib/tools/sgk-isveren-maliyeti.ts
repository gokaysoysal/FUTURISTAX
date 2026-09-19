import { COMMON_FAQS, type ToolMeta } from './types';

// TASLAK METİN — firma revizyonu bekliyor. Somut oran/tutar yazılmadı.
export const sgkIsverenMaliyeti: ToolMeta = {
  slug: 'sgk-isveren-maliyeti',
  title: 'SGK işveren maliyeti',
  short: 'SGK işveren maliyeti',
  description:
    'Brüt ücretten işverene toplam maliyet: SGK ve işsizlik primleri, 5510 beş puanlık indirim.',
  intro:
    'Aylık brüt ücretten yola çıkıp işçi ve işveren SGK/işsizlik primlerini, prime esas kazanç ' +
    'taban-tavanını ve isteğe bağlı 5510 beş puanlık indirimi hesaba katarak işverene toplam ' +
    'maliyeti gösterir.',
  basis: '5510 sayılı Kanun',
  howTo: {
    name: 'SGK işveren maliyeti nasıl hesaplanır',
    steps: [
      'Vergi yılını seçin.',
      'Aylık brüt ücreti girin.',
      '5510 beş puanlık indirimden yararlanılıyorsa kutuyu işaretleyin.',
      'İşçi kesintileri ve işverene toplam maliyet görünür.',
    ],
  },
  faqs: [
    {
      question: 'Gelir vergisi stopajı sonuca dahil mi?',
      answer:
        'Hayır. Gelir ve damga vergisi stopajı kümülatif matrah gerektirdiği için bu hesabın ' +
        'dışındadır; sonuç bunu belirtir.',
    },
    COMMON_FAQS.rates,
    COMMON_FAQS.binding,
  ],
  order: 6,
};
