import type { ServiceRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const yatirimTesvikYonetimi: ServiceRecord = {
  slug: 'yatirim-tesvik-yonetimi',
  title: 'Yatırım teşvik yönetimi',
  shortTitle: 'Yatırım teşvikleri',
  summary:
    'Hazine ve Maliye Bakanlığı teşvik belgelerinin alınması, uygulanması ve denetimi sürecini ' +
    'yönetiyoruz — KDV istisnası, vergi indirimi ve sigorta primi desteği dahil. Doğru ' +
    'kurgulandığında yatırımın vergisel ve finansal yükünü anlamlı ölçüde hafifletir; yanlış ' +
    'yönetildiğinde ise sağlanan desteklerin geri alınmasına yol açar.',
  sections: [
    {
      heading: 'Uygunluk değerlendirmesi',
      body:
        'Planladığınız yatırımın hangi destek unsurlarından yararlanabileceğini, bunun için ' +
        'hangi koşulların sağlanması gerektiğini önceden ortaya koyarız.',
    },
    {
      heading: 'Başvuru ve revizyon',
      body:
        'Sanayi ve Teknoloji Bakanlığı’na bağlı E-TUYS sistemi üzerinden başvuruyu hazırlarız. ' +
        'Başlıca destekler: makine-teçhizat alımlarında KDV istisnası, ithal makinelerde gümrük ' +
        'vergisi muafiyeti, kurumlar vergisi indirimi (yatırıma katkı oranına göre %40-100), SGK ' +
        'işveren payı desteği ve faiz desteği. Bölgesel uygulamalarda (1-6. bölge) destek ' +
        'oranları ile yatırım sürecindeki revizyon talepleri de bu kapsamdadır.',
    },
    {
      heading: 'İzleme ve kapama',
      body:
        'Yatırım tamamlanma vizesi ve destek unsurlarının kullanımı için gereken bildirim ve ' +
        'belgeleri takvime bağlarız. Süreç, belgenin kapanmasıyla tamamlanır.',
    },
  ],
  faqs: [
    {
      question: 'Teşvik belgesi almak yatırıma başlamayı geciktirir mi?',
      answer:
        'Planlama erken yapılırsa hayır. Belgeye bağlanacak harcamaların belge tarihinden sonra ' +
        'yapılması gerektiği için zamanlama önemlidir; bu yüzden süreci yatırım kararıyla ' +
        'birlikte kurgularız.',
    },
    {
      question: 'Küçük ölçekli yatırımlar için de anlamlı mı?',
      answer:
        'Destek unsurlarının kapsamı yatırımın türüne, yerine ve büyüklüğüne göre değişir. ' +
        'Uygunluk değerlendirmesi, emek harcamadan önce bunu netleştirir.',
    },
    {
      question: 'Belge sonrası yükümlülükleri de siz mi takip ediyorsunuz?',
      answer:
        'Evet. Asıl risk çoğunlukla başvuruda değil, sonraki izleme ve bildirim ' +
        'yükümlülüklerinin aksamasındadır; bu aşamayı bir takvimle yönetiriz.',
    },
  ],
  relatedServiceSlugs: ['finansal-danismanlik', 'stratejik-yapilandirma', 'sgk-ve-isci-mevzuati'],
  relatedSectorSlugs: ['uretim-ve-sanayi', 'enerji-ve-cevre', 'tarim-ve-gida'],
  seo: {
    title: 'Yatırım teşvik yönetimi',
    description:
      'Yatırım teşvik belgesi başvurusu, revizyon, izleme ve kapama. Desteklerin geri ' +
      'alınmasına yol açan yükümlülük aksamalarını önleyin.',
    keywords: ['yatırım teşvik belgesi', 'teşvik yönetimi', 'yatırım tamamlama vizesi'],
  },
  order: 9,
  draft: false,
  updatedAt: '2026-09-19',
};
