import type { SectorRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const enerjiVeCevre: SectorRecord = {
  slug: 'enerji-ve-cevre',
  title: 'Enerji ve çevre',
  summary:
    'Yenilenebilir enerji yatırımları, YEKA teşvikleri ve karbon vergisi hazırlık süreçlerinde ' +
    'danışmanlık sunuyoruz. Bu alanda uzun yatırım ufku ve değişen teşvik/regülasyon çerçevesi ' +
    'bir arada yönetilmesi gereken iki eksendir.',
  sections: [
    {
      heading: 'Yenilenebilir enerji yatırımı',
      body:
        'Güneş, rüzgâr ve benzeri yatırımlarda yatırım teşvik belgesi ve YEKA (Yenilenebilir ' +
        'Enerji Kaynak Alanları) mekanizmalarından yararlanmayı, harcama takvimiyle birlikte ' +
        'planlarız.',
    },
    {
      heading: 'Karbon vergisi hazırlığı',
      body:
        'AB Sınırda Karbon Düzenlemesi (SKDM) ve yurt içi karbon fiyatlandırma gelişmelerinin ' +
        'şirketinize olası etkisini önceden değerlendirir, raporlama hazırlığını kurarız.',
    },
    {
      heading: 'Çevresel uyum',
      body:
        'Sektöre özgü çevresel bildirim ve belgelendirme yükümlülüklerini bir takvimde toplar, ' +
        'değişiklikleri izleriz.',
    },
  ],
  faqs: [
    {
      question: 'Karbon vergisi Türkiye’de şu an yürürlükte mi?',
      answer:
        'Bu genel çerçeve bir tanıtım metnidir, somut yürürlük tarihi ve oran için resmî ' +
        'kaynaklara ve danışmanınıza başvurmanız gerekir — hazırlık sürecini birlikte kurarız.',
    },
    {
      question: 'YEKA dışında teşvik seçeneği var mı?',
      answer:
        'Evet. Standart yatırım teşvik belgesi mekanizmaları da yenilenebilir enerji ' +
        'yatırımlarına uygulanabilir; uygunluk analizini birlikte yaparız.',
    },
    {
      question: 'İhracatımız var, SKDM bizi nasıl etkiler?',
      answer:
        'AB’ye çelik, çimento, alüminyum gibi belirli ürün gruplarını ihraç ediyorsanız SKDM ' +
        'raporlama yükümlülüğü kapsamınıza girebilir; etkiyi ürün ve hedef pazar bazında ' +
        'değerlendiririz.',
    },
  ],
  relatedServiceSlugs: ['yatirim-tesvik-yonetimi', 'mevzuat-uyumu', 'uluslararasi-vergilendirme'],
  relatedSectorSlugs: ['uretim-ve-sanayi', 'tarim-ve-gida'],
  seo: {
    title: 'Enerji ve çevre sektörü için vergi danışmanlığı',
    description:
      'Yenilenebilir enerji yatırımları, YEKA teşvikleri ve karbon vergisi hazırlık ' +
      'süreçlerinin vergisel yönetimi.',
    keywords: ['YEKA teşviki', 'yenilenebilir enerji yatırımı', 'karbon vergisi'],
  },
  order: 8,
  draft: false,
  updatedAt: '2026-09-19',
};
