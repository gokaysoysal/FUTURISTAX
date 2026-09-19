import type { SectorRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const saglikVeEczacilik: SectorRecord = {
  slug: 'saglik-ve-eczacilik',
  title: 'Sağlık ve eczacılık',
  summary:
    'Hastane ve klinik gelir-gider optimizasyonu, hekim ortaklık yapıları ve tıbbi cihaz ' +
    'ithalat vergi planlaması sunuyoruz. Özel sağlık kuruluşları, poliklinikler ve tıp ' +
    'merkezleri; yoğun regülasyon, karma gelir yapısı ve yüksek cihaz yatırımı üçgeninde çalışır.',
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
  relatedServiceSlugs: ['mevzuat-uyumu', 'stratejik-yapilandirma', 'finansal-danismanlik'],
  relatedSectorSlugs: ['e-ticaret-ve-perakende', 'finans-ve-sermaye-piyasalari'],
  seo: {
    title: 'Sağlık ve eczacılık kuruluşları için vergi ve mali danışmanlık',
    description:
      'Karma gelir yapısının ayrıştırılması, hekim ortaklık yapıları, tıbbi cihaz ithalat vergi ' +
      'planlaması ve sektörel uyum yükümlülüklerinin yönetimi.',
    keywords: ['sağlık sektörü vergi', 'özel hastane muhasebe', 'tıp merkezi danışmanlık'],
  },
  order: 6,
  draft: false,
  updatedAt: '2026-09-19',
};
