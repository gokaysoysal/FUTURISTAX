import type { SectorRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
// Önceki adı "İmalat"tı; firma sitesinde "Üretim & Sanayi" olarak
// yayınlanıyor, slug da buna göre güncellendi.
export const uretimVeSanayi: SectorRecord = {
  slug: 'uretim-ve-sanayi',
  title: 'Üretim ve sanayi',
  summary:
    'Yatırım teşvik belgesi uygulamaları, KDV iadeleri ve ihracat vergi avantajlarının etkin ' +
    'yönetimini sağlıyoruz. Vergi ve mali yönetim; maliyet muhasebesinin doğruluğuna, stok ve ' +
    'amortisman politikalarına ve yatırım kararlarının teşviklerle uyumuna bağlıdır.',
  sections: [
    {
      heading: 'Maliyet ve stok',
      body:
        'Üretim maliyetinin sağlıklı hesaplanması hem fiyatlama hem vergi matrahı açısından ' +
        'kritiktir. Maliyet dağıtım anahtarlarını, fire ve randıman kayıtlarını gözden geçiririz.',
    },
    {
      heading: 'Yatırım ve teşvik',
      body:
        'Kapasite artışı, makine yenileme ve yeni tesis kararlarını teşvik mekanizmalarıyla ' +
        'birlikte planlar; harcamaların doğru zamanlanmasını sağlarız.',
    },
    {
      heading: 'Raporlama',
      body:
        'Çok tesisli veya çok kalemli üretimde yönetim raporlamasını sadeleştirir, kârlılığı ' +
        'ürün ve hat kırılımında görünür kılarız.',
    },
  ],
  faqs: [
    {
      question: 'Maliyet muhasebesini yeniden kurmak zorunda mıyız?',
      answer:
        'Çoğu durumda hayır. Mevcut yapıdaki dağıtım anahtarlarını ve kayıt disiplinini gözden ' +
        'geçirmek yeterli olur; köklü değişiklik ancak veri güvenilmezse önerilir.',
    },
    {
      question: 'Teşvik başvurusu için geç mi kaldık?',
      answer:
        'Henüz yapılmamış harcamalar için değerlendirme her zaman anlamlıdır. Yapılmış ' +
        'harcamaların belgeye bağlanması genellikle mümkün olmadığından, zamanlama önemlidir.',
    },
    {
      question: 'İhracat ağırlıklı çalışıyoruz, kapsam değişir mi?',
      answer:
        'Evet. İhracat kazançları, iade süreçleri ve varsa yurt dışı grup işlemleri kapsama ' +
        'eklenir; uluslararası vergilendirme tarafıyla birlikte yürütülür.',
    },
  ],
  relatedServiceSlugs: ['yatirim-tesvik-yonetimi', 'kurumsal-raporlama', 'vergi-denetimi'],
  relatedSectorSlugs: ['gayrimenkul-ve-insaat', 'enerji-ve-cevre'],
  seo: {
    title: 'Üretim ve sanayi sektörü için vergi ve mali danışmanlık',
    description:
      'Yatırım teşvik belgesi, KDV iadeleri, maliyet muhasebesi ve yönetim raporlaması ile ' +
      'üretim şirketlerine destek.',
    keywords: ['imalat vergi danışmanlığı', 'yatırım teşvik belgesi', 'KDV iadesi'],
  },
  order: 2,
  draft: false,
  updatedAt: '2026-09-19',
};
