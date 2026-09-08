import type { SectorRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const lojistik: SectorRecord = {
  slug: 'lojistik',
  title: 'Lojistik',
  summary:
    'Taşımacılık ve lojistik şirketlerinde faaliyet çoğu zaman uluslararasıdır: yurt dışı ' +
    'navlun, gümrükleme, yabancı acentelerle işlemler ve araç filosu yönetimi bir arada yürür. ' +
    'Bu yapı, hem KDV hem uluslararası vergilendirme tarafında dikkatli bir kurgu ister.',
  sections: [
    {
      heading: 'Navlun ve KDV',
      body:
        'Yurt içi, ihracat ve transit taşımaların KDV karşısındaki farklı durumlarını ' +
        'ayrıştırır, istisna ve iade süreçlerini düzene sokarız.',
    },
    {
      heading: 'Yabancı acente ilişkileri',
      body:
        'Yurt dışı acentelerle karşılıklı işlemlerin belgelendirilmesi ve vergisel niteliğinin ' +
        'belirlenmesi, bir incelemede en sık sorgulanan alanlardandır; bunu önceden hazırlarız.',
    },
    {
      heading: 'Filo yönetimi',
      body:
        'Araç edinimi, kiralama ve gider kısıtlarının nakit ve vergi etkisini modelleriz. ' +
        'Filo büyüdükçe bu kalemin bilançoya etkisi belirginleşir.',
    },
  ],
  faqs: [
    {
      question: 'Sadece yurt içi taşıma yapıyoruz, uluslararası kısım gerekli mi?',
      answer:
        'Yurt dışı işlem yoksa kapsam yurt içi KDV ve gider yönetimiyle sınırlı kalır. ' +
        'İleride ihracat taşımasına başlanırsa kapsam genişletilir.',
    },
    {
      question: 'Araçları kiralamak mı satın almak mı daha avantajlı?',
      answer:
        'Duruma göre değişir. Nakit durumu, kullanım süresi ve gider kısıtları birlikte ' +
        'değerlendirildiğinde iki seçenek de öne çıkabilir; kararı tabloyla veririz.',
    },
    {
      question: 'Gümrük müşavirimizle çalışır mısınız?',
      answer:
        'Evet. Gümrük ve mali müşavirlik tarafının aynı işlemde tutarlı belge üretmesi ' +
        'önemlidir; koordinasyonu sağlarız.',
    },
  ],
  relatedServiceSlugs: ['uluslararasi-vergilendirme', 'kurumsal-raporlama', 'mevzuat-uyumu'],
  relatedSectorSlugs: ['imalat', 'perakende-ve-e-ticaret'],
  seo: {
    title: 'Lojistik ve taşımacılık için vergi danışmanlığı',
    description:
      'Navlun KDV ve iade süreçleri, yabancı acente işlemlerinin belgelendirilmesi ve araç ' +
      'filosu yönetiminin vergisel modellemesi.',
    keywords: ['lojistik vergi danışmanlığı', 'navlun KDV istisnası', 'taşımacılık muhasebe'],
  },
  order: 6,
  draft: true,
  updatedAt: '2026-09-06',
};
