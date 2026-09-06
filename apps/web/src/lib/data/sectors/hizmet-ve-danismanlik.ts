import type { SectorRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const hizmetVeDanismanlik: SectorRecord = {
  slug: 'hizmet-ve-danismanlik',
  title: 'Hizmet ve danışmanlık',
  shortTitle: 'Hizmet ve danışmanlık',
  summary:
    'Profesyonel hizmet ve danışmanlık şirketlerinde en büyük gider kalemi genellikle insan ' +
    'kaynağıdır ve gelir, projelerin tamamlanma derecesine bağlıdır. Bu yapıda vergi ve mali ' +
    'yönetim; hasılatın doğru dönemlenmesine ve personel maliyetinin öngörülebilir olmasına ' +
    'dayanır.',
  sections: [
    {
      heading: 'Hasılatın dönemlenmesi',
      body:
        'Devam eden projelerde hasılatın ve maliyetin dönemlere doğru yansıtılması, hem ' +
        'kârlılık görünürlüğü hem vergi matrahı açısından belirleyicidir.',
    },
    {
      heading: 'Personel maliyeti',
      body:
        'Bordro, yan haklar ve varsa hisse/prim yapılarının toplam maliyetini modelleriz; ' +
        'fiyatlandırma kararları bu tabana oturur.',
    },
    {
      heading: 'Yurt dışı müşteri',
      body:
        'Yurt dışına verilen danışmanlık hizmetinin vergisel niteliğini ve varsa istisna ' +
        'kapsamını değerlendiririz.',
    },
  ],
  faqs: [
    {
      question: 'Saatlik ücretlendirme yapıyoruz, muhasebe buna uyar mı?',
      answer:
        'Evet. Zaman kayıtlarını hasılat tahakkukuna bağlayan bir düzen kurar, ay sonu ' +
        'kapanışını bu veriden besleriz.',
    },
    {
      question: 'Serbest çalışanlarla mı yoksa kadrolu mu ilerlemeliyiz?',
      answer:
        'İkisinin bordro, stopaj ve sözleşme sonuçları farklıdır. Ekip yapınıza ve iş ' +
        'sürekliliğine göre birlikte değerlendiririz.',
    },
    {
      question: 'Küçük bir danışmanlık ofisi için kapsam ağır olmaz mı?',
      answer:
        'Kapsamı ölçeğe göre daraltırız. Amaç, birkaç göstergeyle yönetilebilen sade bir ' +
        'raporlama düzeni bırakmaktır.',
    },
  ],
  relatedServiceSlugs: [
    'finansal-danismanlik',
    'uluslararasi-vergilendirme',
    'kurumsal-yapilandirma',
  ],
  relatedSectorSlugs: ['bilisim-ve-yazilim', 'saglik'],
  seo: {
    title: 'Hizmet ve danışmanlık şirketleri için mali danışmanlık',
    description:
      'Proje hasılatının dönemlenmesi, personel maliyeti modelleme ve yurt dışı müşteri ' +
      'hizmetlerinin vergisel değerlendirmesi.',
    keywords: ['danışmanlık şirketi vergi', 'proje muhasebesi', 'hizmet ihracatı vergi'],
  },
  order: 7,
  draft: true,
  updatedAt: '2026-09-06',
};
