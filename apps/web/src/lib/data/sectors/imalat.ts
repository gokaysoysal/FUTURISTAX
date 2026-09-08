import type { SectorRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const imalat: SectorRecord = {
  slug: 'imalat',
  title: 'İmalat',
  summary:
    'İmalat sanayisinde vergi ve mali yönetim; maliyet muhasebesinin doğruluğuna, stok ve ' +
    'amortisman politikalarına ve yatırım kararlarının teşviklerle uyumuna bağlıdır. Üretim ' +
    'yapan şirketlere maliyet takibinden teşvik yönetimine kadar bütünlüklü destek veririz.',
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
  relatedSectorSlugs: ['insaat-ve-gayrimenkul', 'lojistik'],
  seo: {
    title: 'İmalat sektörü için vergi ve mali danışmanlık',
    description:
      'Maliyet muhasebesi, stok ve amortisman politikaları, yatırım teşvik yönetimi ve yönetim ' +
      'raporlaması ile üretim şirketlerine destek.',
    keywords: ['imalat vergi danışmanlığı', 'maliyet muhasebesi', 'üretim sektörü teşvik'],
  },
  order: 1,
  draft: true,
  updatedAt: '2026-09-06',
};
