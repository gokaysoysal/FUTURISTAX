import type { ServiceRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const kurumsalYapilandirma: ServiceRecord = {
  slug: 'kurumsal-yapilandirma',
  title: 'Kurumsal yapılandırma',
  shortTitle: 'Kurumsal yapılandırma',
  summary:
    'Birleşme, bölünme, tür değişikliği, hisse devri veya yeni ortak girişi gibi kararlar hukuki ' +
    'olduğu kadar vergiseldir. Bu hizmette hedeflediğiniz yapıya giden alternatif yolları ' +
    'vergisel maliyet, süre ve risk açısından karşılaştırır; seçilen yolun adımlarını ' +
    'planlarız.',
  sections: [
    {
      heading: 'Mevcut yapının analizi',
      body:
        'Ortaklık yapısını, grup şirketlerini ve aralarındaki işlemleri haritalarız. Hedefe ' +
        'göre hangi unsurların değişmesi gerektiğini belirleriz.',
    },
    {
      heading: 'Senaryo karşılaştırması',
      body:
        'Aynı hedefe ulaştıran farklı yapılandırma yollarını; vergisel yük, uygulanabilirlik ve ' +
        'zaman açısından tabloya döker, tercihi yönetime bırakırız.',
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
  relatedSectorSlugs: ['insaat-ve-gayrimenkul', 'saglik', 'hizmet-ve-danismanlik'],
  seo: {
    title: 'Kurumsal yapılandırma',
    description:
      'Birleşme, bölünme, tür değişikliği ve hisse devri kararlarında vergisel senaryo ' +
      'karşılaştırması ve uygulama planı.',
    keywords: ['kurumsal yapılandırma', 'birleşme bölünme', 'hisse devri', 'tür değişikliği'],
  },
  order: 7,
  draft: true,
  updatedAt: '2026-09-06',
};
