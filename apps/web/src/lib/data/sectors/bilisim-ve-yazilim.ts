import type { SectorRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const bilisimVeYazilim: SectorRecord = {
  slug: 'bilisim-ve-yazilim',
  title: 'Bilişim ve yazılım',
  shortTitle: 'Bilişim ve yazılım',
  summary:
    'Yazılım ve bilişim şirketlerinde değer büyük ölçüde gayrimaddi varlıklardan ve nitelikli ' +
    'personelden gelir. Bu yapı; Ar-Ge ve teknoloji bölgesi istisnaları, yurt dışına hizmet ' +
    'sunumu ve hisse bazlı ödeme gibi konularda özenli bir vergi yönetimi gerektirir.',
  sections: [
    {
      heading: 'İstisna ve destekler',
      body:
        'Ar-Ge merkezi, teknokent veya benzeri destek mekanizmalarından yararlanıyorsanız, ' +
        'istisna kapsamının doğru uygulanmasını ve gerekli belgelendirmeyi gözden geçiririz.',
    },
    {
      heading: 'Yurt dışı gelir',
      body:
        'Yurt dışındaki müşterilere sunulan hizmetin vergisel niteliğini, ilgili istisnaları ve ' +
        'transfer fiyatlandırması boyutunu değerlendiririz.',
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
  relatedSectorSlugs: ['hizmet-ve-danismanlik', 'perakende-ve-e-ticaret'],
  seo: {
    title: 'Bilişim ve yazılım şirketleri için vergi danışmanlığı',
    description:
      'Ar-Ge ve teknokent istisnaları, yurt dışına hizmet sunumu, hisse bazlı ödeme ve uzaktan ' +
      'çalışan istihdamının vergisel yönetimi.',
    keywords: ['yazılım vergi danışmanlığı', 'teknokent istisnası', 'Ar-Ge desteği', 'SaaS vergi'],
  },
  order: 3,
  draft: true,
  updatedAt: '2026-09-06',
};
