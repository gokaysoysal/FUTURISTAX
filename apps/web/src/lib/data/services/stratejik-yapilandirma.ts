import type { ServiceRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
// Önceki adı "Kurumsal yapılandırma"ydı; firma sitesinde "Stratejik
// yapılandırma" olarak yayınlanıyor, slug da buna göre güncellendi.
export const stratejikYapilandirma: ServiceRecord = {
  slug: 'stratejik-yapilandirma',
  title: 'Stratejik yapılandırma',
  shortTitle: 'Stratejik yapılandırma',
  summary:
    'Şirket birleşmeleri, devir işlemleri ve kurumsal yapılandırmada vergi odaklı optimum ' +
    'çözümler sunuyoruz — KVK Madde 19 kapsamlı bir hizmet. Birleşme, bölünme, tür değişikliği, ' +
    'hisse devri veya yeni ortak girişi gibi kararlar hukuki olduğu kadar vergiseldir; ' +
    'hedeflediğiniz yapıya giden alternatif yolları vergisel maliyet, süre ve risk açısından ' +
    'karşılaştırır, seçilen yolun adımlarını planlarız.',
  sections: [
    {
      heading: 'Mevcut yapının analizi',
      body:
        'Ortaklık yapısını, grup şirketlerini ve aralarındaki işlemleri haritalarız. Hedefe ' +
        'göre hangi unsurların değişmesi gerektiğini belirleriz.',
    },
    {
      heading: 'Devir ve bölünme (KVK Madde 19)',
      body:
        'Kurumlar Vergisi Kanunu Madde 19 kapsamındaki devir, bölünme ve hisse değişimi ' +
        'işlemlerinin vergisiz gerçekleştirilebilmesi için aranan şartları, aynı hedefe ulaştıran ' +
        'diğer yollarla vergisel yük, uygulanabilirlik ve zaman açısından karşılaştırırız.',
    },
    {
      heading: 'Uygulama planı',
      body:
        'Seçilen yol için adım adım bir plan, sorumlular ve takvim çıkarırız. Hukuk ve mali ' +
        'müşavirlik tarafının eşgüdümünü sağlarız.',
    },
  ],
  faqs: [
    {
      question: 'Yapılandırma her zaman vergi avantajı sağlar mı?',
      answer:
        'Hayır. Bazı yapılandırmalar kısa vadede maliyet doğurur; değer, uzun vadeli ' +
        'sürdürülebilirlik ve risk azalımından gelir. Kararı bu bütünle veririz.',
    },
    {
      question: 'Avukatımızla mı yoksa sizinle mi başlamalıyız?',
      answer:
        'Erken aşamada birlikte oturmak en verimlisidir. Hukuki ve vergisel kısıtlar aynı anda ' +
        'masaya konduğunda uygulanamaz bir plana emek harcanmaz.',
    },
    {
      question: 'Süreç ne kadar sürer?',
      answer:
        'İşlem türüne ve onay süreçlerine bağlıdır. Planlama aşaması genellikle birkaç hafta, ' +
        'uygulama ise işlemin niteliğine göre birkaç aya kadar uzayabilir.',
    },
  ],
  relatedServiceSlugs: [
    'finansal-danismanlik',
    'uluslararasi-vergilendirme',
    'yatirim-tesvik-yonetimi',
  ],
  relatedSectorSlugs: [
    'gayrimenkul-ve-insaat',
    'saglik-ve-eczacilik',
    'finans-ve-sermaye-piyasalari',
  ],
  seo: {
    title: 'Stratejik yapılandırma',
    description:
      'Birleşme, bölünme (KVK Madde 19), tür değişikliği ve hisse devri kararlarında vergisel ' +
      'senaryo karşılaştırması ve uygulama planı.',
    keywords: ['stratejik yapılandırma', 'birleşme bölünme', 'KVK Madde 19', 'hisse devri'],
  },
  order: 6,
  draft: false,
  updatedAt: '2026-09-19',
};
