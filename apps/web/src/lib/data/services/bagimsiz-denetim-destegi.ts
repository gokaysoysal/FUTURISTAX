import type { ServiceRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const bagimsizDenetimDestegi: ServiceRecord = {
  slug: 'bagimsiz-denetim-destegi',
  title: 'Bağımsız denetim desteği',
  shortTitle: 'Denetim desteği',
  summary:
    'Bağımsız denetime tabi bir şirkette denetim süreci, iyi hazırlanmışsa öngörülebilir bir ' +
    'takvimdir. Bu hizmette denetçinin talep edeceği belge ve mutabakatları önceden hazırlar, ' +
    'denetim bulgularına verilecek yanıtları yönetir ve bir sonraki döneme dersleri taşırız. ' +
    'Denetimi biz yapmayız; denetime hazır olmanızı sağlarız.',
  sections: [
    {
      heading: 'Denetim öncesi hazırlık',
      body:
        'Denetçinin isteyeceği belge listesini önceden derler, hesap mutabakatlarını ve ' +
        'açıklama notlarını hazırlarız. Böylece saha çalışması gecikmeden ilerler.',
    },
    {
      heading: 'Süreç yönetimi',
      body:
        'Denetim sırasında gelen sorular için tek bir irtibat noktası oluruz; yanıtları derler, ' +
        'tutarlılığını kontrol eder, ekibinizin yükünü azaltırız.',
    },
    {
      heading: 'Bulguların kapatılması',
      body:
        'Denetçi tarafından tespit edilen hususları önceliklendirir, düzeltme veya açıklama ' +
        'planını çıkarır ve bir sonraki dönemde tekrarlanmaması için süreç önerisi bırakırız.',
    },
  ],
  faqs: [
    {
      question: 'Denetim şirketimizi siz mi seçiyorsunuz?',
      answer:
        'Hayır. Bağımsızlık kuralları gereği denetçiyle aramızda bir bağ olamaz. Denetçi ' +
        'seçimini siz yaparsınız; biz yalnızca hazırlık ve süreç tarafında çalışırız.',
    },
    {
      question: 'Mevcut mali müşavirimiz varken bu hizmet çakışır mı?',
      answer:
        'Hayır. Mali müşavirinizle koordineli çalışırız; katkımız denetim özelinde ek hazırlık ' +
        've süreç yönetimidir.',
    },
    {
      question: 'İlk kez denetime giriyoruz, süre ne kadar?',
      answer:
        'İlk yıl, geçmiş dönem bakiyelerinin gözden geçirilmesi nedeniyle daha uzun sürer. ' +
        'Hazırlığa erken başlandığında bu yük belirgin biçimde azalır.',
    },
  ],
  relatedServiceSlugs: ['kurumsal-raporlama', 'vergi-denetimi', 'mevzuat-uyumu'],
  relatedSectorSlugs: ['imalat', 'insaat-ve-gayrimenkul', 'perakende-ve-e-ticaret'],
  seo: {
    title: 'Bağımsız denetim desteği',
    description:
      'Bağımsız denetim öncesi hazırlık, süreç yönetimi ve bulguların kapatılması. Denetimi ' +
      'öngörülebilir bir takvime çevirin.',
    keywords: ['bağımsız denetim desteği', 'denetim hazırlığı', 'denetim mutabakatı'],
  },
  order: 9,
  draft: true,
  updatedAt: '2026-09-06',
};
