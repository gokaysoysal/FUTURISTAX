import type { SectorRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const finansVeSermayePiyasalari: SectorRecord = {
  slug: 'finans-ve-sermaye-piyasalari',
  title: 'Finans ve sermaye piyasaları',
  summary:
    'Yatırım araçlarının vergilendirilmesi, fon yapılandırması ve BIST işlem vergi ' +
    'optimizasyonu konularında danışmanlık sunuyoruz. Sermaye piyasası araçlarının ' +
    'çeşitlenmesi, tevkifat ve beyan yükümlülüklerini de karmaşıklaştırır — bu tabloyu ' +
    'sadeleştiririz.',
  sections: [
    {
      heading: 'Yatırım araçları',
      body:
        'Hisse senedi, tahvil, yatırım fonu ve türev işlemlerinin tevkifat ve beyan ' +
        'yükümlülüklerini araç ve elde tutma süresine göre değerlendiririz.',
    },
    {
      heading: 'Fon yapılandırması',
      body:
        'Şirket veya portföy amaçlı fon yapıları kurulurken vergisel sonuçları ve raporlama ' +
        'yükümlülüklerini önceden ortaya koyarız.',
    },
    {
      heading: 'Kurumsal işlem vergisi',
      body:
        'BIST üzerinden yürütülen kurumsal işlemlerin (halka arz, blok satış, geri alım) vergi ' +
        've bildirim boyutunu, ilgili diğer hizmetlerimizle (kurumsal raporlama, stratejik ' +
        'yapılandırma) birlikte planlarız.',
    },
  ],
  faqs: [
    {
      question: 'Yatırım tavsiyesi de veriyor musunuz?',
      answer:
        'Hayır. Sermaye piyasası araçlarına yönelik yatırım tavsiyesi kapsamımızda değildir; ' +
        'odağımız mevcut veya planlanan işlemlerin vergisel sonucudur.',
    },
    {
      question: 'Aracı kurumumuzla mı çalışırsınız?',
      answer:
        'Gerektiğinde evet — aracı kurumunuzdan gelen işlem raporlarını beyan ve tevkifat ' +
        'açısından değerlendirir, tutarlılığını kontrol ederiz.',
    },
    {
      question: 'Halka arz sürecinde ne zaman devreye girmelisiniz?',
      answer:
        'Mümkün olan en erken aşamada. Yapılandırma ve raporlama kararlarının çoğu, arz ' +
        'öncesinde geri dönülmesi güç bir çerçeve kurar.',
    },
  ],
  relatedServiceSlugs: [
    'kurumsal-raporlama',
    'stratejik-yapilandirma',
    'uluslararasi-vergilendirme',
  ],
  relatedSectorSlugs: ['teknoloji-ve-bilisim', 'gayrimenkul-ve-insaat'],
  seo: {
    title: 'Finans ve sermaye piyasaları için vergi danışmanlığı',
    description:
      'Yatırım araçlarının vergilendirilmesi, fon yapılandırması ve BIST işlem vergi ' +
      'optimizasyonu.',
    keywords: ['sermaye piyasası vergi', 'fon yapılandırması', 'BIST işlem vergisi'],
  },
  order: 5,
  draft: false,
  updatedAt: '2026-09-19',
};
