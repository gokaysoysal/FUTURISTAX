import type { ServiceRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const kurumsalRaporlama: ServiceRecord = {
  slug: 'kurumsal-raporlama',
  title: 'Kurumsal raporlama',
  shortTitle: 'Kurumsal raporlama',
  summary:
    'Uluslararası standartlarda (TFRS/IFRS) finansal raporlama ve detaylı değerlendirme ' +
    'süreçleri sunuyoruz — paydaşlarınıza tam şeffaflık. Ortaklara, kredi kuruluşlarına veya ' +
    'yurt dışı ana şirkete sunulan tabloların tutarlı ve karşılaştırılabilir olmasını, dönemsel ' +
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
      question: 'Mali mevzuat uyumu hizmetinden farkı ne?',
      answer:
        'Kurumsal raporlama finansal tabloları üretir; mali mevzuat uyumu ise yürürlükteki ' +
        'yükümlülüklerin eksiksiz ve zamanında yerine getirilmesine odaklanır. İkisi birlikte ' +
        'yürür.',
    },
  ],
  relatedServiceSlugs: ['finansal-danismanlik', 'vergi-denetimi', 'uluslararasi-vergilendirme'],
  relatedSectorSlugs: ['uretim-ve-sanayi', 'teknoloji-ve-bilisim', 'finans-ve-sermaye-piyasalari'],
  seo: {
    title: 'Kurumsal raporlama',
    description:
      'Finansal raporlama çerçevesine uygun tablo hazırlama, dönemsel kapanış ve konsolidasyon. ' +
      'Ortak, kredi kuruluşu ve ana şirket için tutarlı raporlar.',
    keywords: ['kurumsal raporlama', 'finansal tablolar', 'konsolidasyon', 'dönem sonu kapanış'],
  },
  order: 5,
  draft: false,
  updatedAt: '2026-09-19',
};
