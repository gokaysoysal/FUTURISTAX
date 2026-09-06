import type { SectorRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const saglik: SectorRecord = {
  slug: 'saglik',
  title: 'Sağlık',
  summary:
    'Özel sağlık kuruluşları, poliklinikler ve tıp merkezleri; yoğun regülasyon, karma gelir ' +
    'yapısı ve yüksek cihaz yatırımı üçgeninde çalışır. Bu alanda vergi ve mali yönetim, ' +
    'mevzuata uyumu operasyonun akışını bozmadan sürdürmeyi gerektirir.',
  sections: [
    {
      heading: 'Gelir yapısı',
      body:
        'Kurumla anlaşmalı hizmetler, doğrudan hasta ödemeleri ve tamamlayıcı sigorta ' +
        'tahsilatlarının farklı vergisel muameleleri vardır; bunları doğru ayrıştırırız.',
    },
    {
      heading: 'Cihaz yatırımı',
      body:
        'Görüntüleme ve tedavi cihazlarının edinim yöntemi (satın alma, kiralama, teşvikli ' +
        'yatırım) nakit ve vergi açısından farklı sonuç doğurur; kararı birlikte modelleriz.',
    },
    {
      heading: 'Uyum',
      body:
        'Sektöre özgü mali bildirim ve belgelendirme yükümlülüklerini bir takvimde toplar, ' +
        'değişiklikleri izleriz.',
    },
  ],
  faqs: [
    {
      question: 'Hekimlerle çalışma modeli vergisel sonucu değiştirir mi?',
      answer:
        'Evet. Hekimin kadrolu çalışan mı yoksa serbest meslek erbabı olarak mı hizmet verdiği, ' +
        'bordro ve stopaj yükümlülüklerini doğrudan etkiler.',
    },
    {
      question: 'Birden fazla şubemiz var, tek yapıda mı kalmalıyız?',
      answer:
        'Şube ve ayrı şirket seçenekleri risk, raporlama ve yönetim açısından farklıdır. ' +
        'Büyüme planınıza göre birlikte değerlendiririz.',
    },
    {
      question: 'Cihaz için teşvik belgesi almak mümkün mü?',
      answer:
        'Yatırımın niteliğine ve yerine bağlı olarak değerlendirilebilir. Uygunluk analizini ' +
        'yatırım kararından önce yaparız.',
    },
  ],
  relatedServiceSlugs: ['mevzuat-uyumu', 'kurumsal-yapilandirma', 'finansal-danismanlik'],
  relatedSectorSlugs: ['hizmet-ve-danismanlik', 'perakende-ve-e-ticaret'],
  seo: {
    title: 'Sağlık kuruluşları için vergi ve mali danışmanlık',
    description:
      'Karma gelir yapısının ayrıştırılması, cihaz yatırımı modelleme ve sektörel uyum ' +
      'yükümlülüklerinin yönetimi.',
    keywords: ['sağlık sektörü vergi', 'özel hastane muhasebe', 'tıp merkezi danışmanlık'],
  },
  order: 4,
  draft: true,
  updatedAt: '2026-09-06',
};
