import type { SectorRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
// Önceki adı "Bilişim ve yazılım"dı; firma sitesinde "Teknoloji & Bilişim"
// olarak yayınlanıyor, slug da buna göre güncellendi.
export const teknolojiVeBilisim: SectorRecord = {
  slug: 'teknoloji-ve-bilisim',
  title: 'Teknoloji ve bilişim',
  shortTitle: 'Teknoloji ve bilişim',
  summary:
    'Ar-Ge indirimleri, teknokent istisnaları ve yazılım ihracatı vergi süreçlerinde uzman ' +
    'rehberlik sunuyoruz. Değer büyük ölçüde gayrimaddi varlıklardan ve nitelikli personelden ' +
    'geldiği için bu yapı özenli bir vergi yönetimi gerektirir.',
  sections: [
    {
      heading: 'Ar-Ge ve teknokent',
      body:
        'Ar-Ge Merkezi kuran firmalar (en az 30 tam zamanlı Ar-Ge personeli şartıyla) ' +
        'harcamalarının tamamını matrahtan indirebilir; Teknokent (TGB) firmaları da aynı ' +
        'imkândan yararlanır. TGB’de elde edilen yazılım, tasarım ve Ar-Ge kazançları 2028 yıl ' +
        'sonuna kadar kurumlar/gelir vergisinden istisnadır; istisna kapsamının doğru ' +
        'uygulanmasını ve gerekli belgelendirmeyi gözden geçiririz.',
    },
    {
      heading: 'Yazılım ihracatı ve yurt dışı gelir',
      body:
        'Yurt dışına yapılan yazılım ihracatında ayrıca kurumlar vergisi indirimi uygulanır. ' +
        'Yurt dışındaki müşterilere sunulan hizmetin vergisel niteliğini ve transfer ' +
        'fiyatlandırması boyutunu değerlendiririz.',
    },
    {
      heading: 'Personel ve hisse',
      body:
        'Çalışanlara hisse veya opsiyon verilmesi, yurt dışından uzaktan çalışan istihdamı gibi ' +
        'yapıların bordro ve vergi sonuçlarını önceden ortaya koyarız.',
    },
  ],
  faqs: [
    {
      question: 'Henüz gelirimiz yok, danışmanlık erken mi?',
      answer:
        'Tam tersine. Kuruluş yapısı, ortaklık sözleşmesi ve destek başvuruları en verimli ' +
        'şekilde gelir oluşmadan önce kurgulanır.',
    },
    {
      question: 'Yurt dışından yatırım aldık, ne değişir?',
      answer:
        'Ortaklık yapısı, kâr dağıtımı ve grup içi işlemler uluslararası vergilendirme ' +
        'kurallarının kapsamına girer; raporlama beklentileri de artar.',
    },
    {
      question: 'Teknokent istisnası her gelir kalemini kapsar mı?',
      answer:
        'Hayır. İstisna, bölgede yürütülen faaliyetten doğan kazançla sınırlıdır; kapsam dışı ' +
        'gelirlerin ayrıştırılması gerekir. Bu ayrımı birlikte kurarız.',
    },
  ],
  relatedServiceSlugs: [
    'uluslararasi-vergilendirme',
    'yatirim-tesvik-yonetimi',
    'finansal-danismanlik',
  ],
  relatedSectorSlugs: ['e-ticaret-ve-perakende', 'finans-ve-sermaye-piyasalari'],
  seo: {
    title: 'Teknoloji ve bilişim şirketleri için vergi danışmanlığı',
    description:
      'Ar-Ge ve teknokent istisnaları, yazılım ihracatı, hisse bazlı ödeme ve uzaktan çalışan ' +
      'istihdamının vergisel yönetimi.',
    keywords: ['yazılım vergi danışmanlığı', 'teknokent istisnası', 'Ar-Ge desteği', 'SaaS vergi'],
  },
  order: 1,
  draft: false,
  updatedAt: '2026-09-19',
};
