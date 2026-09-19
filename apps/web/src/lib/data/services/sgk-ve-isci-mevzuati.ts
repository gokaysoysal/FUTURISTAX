import type { ServiceRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
// Önceki "Bağımsız denetim desteği" kaydının yerini aldı — firmanın gerçek
// 9 hizmetinde bu başlık yok, yerine bu hizmet yayınlanıyor.
export const sgkVeIsciMevzuati: ServiceRecord = {
  slug: 'sgk-ve-isci-mevzuati',
  title: 'SGK ve işçi mevzuatı',
  shortTitle: 'SGK ve işçi mevzuatı',
  summary:
    'Sosyal güvenlik prim teşvikleri, işçilik maliyeti optimizasyonu ve iş hukuku uyum ' +
    'süreçlerinde bütünleşik danışmanlık veriyoruz. Bordro ve istihdam kararlarının hem SGK hem ' +
    'vergi tarafındaki sonuçlarını birlikte değerlendiririz.',
  sections: [
    {
      heading: 'Prim teşvikleri',
      body:
        'İşletmenizin yararlanabileceği SGK prim teşviklerini (ilave istihdam, bölgesel, ' +
        'sektörel) tarar, uygunluk şartlarının sürdürüldüğünü takip ederiz.',
    },
    {
      heading: 'İşçilik maliyeti',
      body:
        'Bordro yapısını, yan hakları ve istihdam modelini (kadrolu, kısmi süreli, uzaktan) ' +
        'işçilik maliyeti ve vergi/SGK yükü açısından birlikte değerlendiririz.',
    },
    {
      heading: 'Uyum',
      body:
        'İş hukuku ve SGK bildirim yükümlülüklerini bir takvimde toplar, değişiklikleri ' +
        'izleriz — gecikme ve idari para cezası riskini önceden görürsünüz.',
    },
  ],
  faqs: [
    {
      question: 'Bu hizmet mevcut bordro sağlayıcımızın yerini mi alıyor?',
      answer:
        'Hayır. Bordro üretimini mevcut sağlayıcınız veya mali müşaviriniz sürdürür; biz teşvik ' +
        'uygunluğu, maliyet optimizasyonu ve uyum tarafında ek uzmanlık sağlarız.',
    },
    {
      question: 'Küçük ekipli şirketler için de anlamlı mı?',
      answer:
        'Evet. İlave istihdam teşviki gibi mekanizmalar küçük ekiplerde orantılı olarak daha ' +
        'büyük bir etki yaratabilir; uygunluk değerlendirmesi ekip büyüklüğünden bağımsızdır.',
    },
    {
      question: 'Yatırım teşvik yönetimiyle nasıl birleşiyor?',
      answer:
        'Yatırım teşvik belgesi kapsamındaki SGK işveren payı desteği gibi unsurlar iki hizmetin ' +
        'kesiştiği noktadır; birlikte alındığında tutarlı tek bir plan çıkar.',
    },
  ],
  relatedServiceSlugs: ['vergi-denetimi', 'mevzuat-uyumu', 'yatirim-tesvik-yonetimi'],
  relatedSectorSlugs: ['uretim-ve-sanayi', 'saglik-ve-eczacilik', 'tarim-ve-gida'],
  seo: {
    title: 'SGK ve işçi mevzuatı',
    description:
      'SGK prim teşvikleri, işçilik maliyeti optimizasyonu ve iş hukuku uyum süreçlerinde ' +
      'bütünleşik danışmanlık.',
    keywords: ['SGK prim teşviki', 'işçilik maliyeti', 'iş hukuku uyumu', 'bordro danışmanlığı'],
  },
  order: 8,
  draft: false,
  updatedAt: '2026-09-19',
};
