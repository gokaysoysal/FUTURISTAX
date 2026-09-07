import type { ServiceRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const kurumsalRaporlama: ServiceRecord = {
  slug: 'kurumsal-raporlama',
  title: 'Kurumsal raporlama',
  shortTitle: 'Kurumsal raporlama',
  summary:
    'Ortaklara, kredi kuruluşlarına veya yurt dışı ana şirkete sunulan finansal tabloların ' +
    'tutarlı, karşılaştırılabilir ve standartlara uygun olması gerekir. Bu hizmette raporlama ' +
    'setinizi ilgili finansal raporlama çerçevesine göre kurar veya gözden geçirir; dönemsel ' +
    'kapanış ve konsolidasyon süreçlerini düzene sokarız.',
  sections: [
    {
      heading: 'Raporlama çerçevesi',
      body:
        'Yükümlü olduğunuz veya paydaşlarınızın beklediği finansal raporlama çerçevesini ' +
        'belirler, mevcut kayıt düzeninizle arasındaki farkları çıkarırız.',
    },
    {
      heading: 'Dönemsel kapanış',
      body:
        'Ay ve yıl sonu kapanışı için bir kontrol listesi ve takvim kurarız. Mutabakatlar, ' +
        'karşılıklar ve dönemsellik kayıtları her dönem aynı disiplinle yapılır.',
    },
    {
      heading: 'Konsolidasyon',
      body:
        'Birden fazla şirketiniz varsa grup içi işlemlerin elenmesi ve konsolide tabloların ' +
        'hazırlanması sürecini yürütürüz.',
    },
    {
      heading: 'Sunum',
      body:
        'Tabloların yanında, yöneticiler ve ortaklar için okunması kolay bir yönetim özeti ' +
        'hazırlarız. Rakamın arkasındaki hikâye de raporun parçasıdır.',
    },
  ],
  faqs: [
    {
      question: 'Bağımsız denetime tabi değiliz, yine de gerekir mi?',
      answer:
        'Sıklıkla evet. Kredi başvurusu, ortak girişi veya yurt dışı raporlama gibi durumlarda ' +
        'standartlara uygun tablolar denetim yükümlülüğünden bağımsız olarak istenir.',
    },
    {
      question: 'Mevcut muhasebe yazılımımızla çalışır mı?',
      answer:
        'Evet. Raporlama setini mevcut sisteminizden beslenecek biçimde kurar, ek bir yazılım ' +
        'zorunluluğu getirmeyiz.',
    },
    {
      question: 'Bağımsız denetim desteğiyle farkı ne?',
      answer:
        'Kurumsal raporlama tabloları üretir; bağımsız denetim desteği ise bir denetçi ' +
        'incelemesine hazırlık ve denetim sürecinin yönetimiyle ilgilenir. İkisi ardışık ' +
        'çalışır.',
    },
  ],
  relatedServiceSlugs: [
    'finansal-danismanlik',
    'bagimsiz-denetim-destegi',
    'uluslararasi-vergilendirme',
  ],
  relatedSectorSlugs: ['imalat', 'bilisim-ve-yazilim', 'lojistik'],
  seo: {
    title: 'Kurumsal raporlama',
    description:
      'Finansal raporlama çerçevesine uygun tablo hazırlama, dönemsel kapanış ve konsolidasyon. ' +
      'Ortak, kredi kuruluşu ve ana şirket için tutarlı raporlar.',
    keywords: ['kurumsal raporlama', 'finansal tablolar', 'konsolidasyon', 'dönem sonu kapanış'],
  },
  order: 5,
  draft: true,
  updatedAt: '2026-09-06',
};
