import type { ServiceRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const yatirimTesvikYonetimi: ServiceRecord = {
  slug: 'yatirim-tesvik-yonetimi',
  title: 'Yatırım teşvik yönetimi',
  shortTitle: 'Yatırım teşvikleri',
  summary:
    'Yatırım teşvik belgesi, doğru kurgulandığında yatırımın vergisel ve finansal yükünü ' +
    'anlamlı ölçüde hafifletir; yanlış yönetildiğinde ise sağlanan desteklerin geri alınmasına ' +
    'yol açar. Bu hizmette başvurudan kapamaya kadar tüm süreci planlar, yükümlülüklerin ' +
    'zamanında yerine getirilmesini takip ederiz.',
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
        'Teşvik belgesi başvurusunu ve yatırım sürecinde ortaya çıkan değişiklikler için ' +
        'revizyon taleplerini hazırlarız.',
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
  relatedServiceSlugs: ['finansal-danismanlik', 'kurumsal-yapilandirma', 'mevzuat-uyumu'],
  relatedSectorSlugs: ['imalat', 'saglik', 'lojistik'],
  seo: {
    title: 'Yatırım teşvik yönetimi',
    description:
      'Yatırım teşvik belgesi başvurusu, revizyon, izleme ve kapama. Desteklerin geri ' +
      'alınmasına yol açan yükümlülük aksamalarını önleyin.',
    keywords: ['yatırım teşvik belgesi', 'teşvik yönetimi', 'yatırım tamamlama vizesi'],
  },
  order: 8,
  draft: true,
  updatedAt: '2026-09-06',
};
