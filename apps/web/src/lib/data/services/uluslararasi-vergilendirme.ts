import type { ServiceRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const uluslararasiVergilendirme: ServiceRecord = {
  slug: 'uluslararasi-vergilendirme',
  title: 'Uluslararası vergilendirme',
  shortTitle: 'Uluslararası vergilendirme',
  summary:
    'Sınır ötesi faaliyet, aynı kazancın birden fazla ülkede vergilenmesi riskini ve ek ' +
    'belgelendirme yükümlülüklerini beraberinde getirir. Bu hizmette çifte vergilendirmeyi ' +
    'önleme anlaşmalarının uygulanması, transfer fiyatlandırması dokümantasyonu ve yurt dışı ' +
    'yapıların vergisel değerlendirmesi konularında yol gösteririz.',
  sections: [
    {
      heading: 'Çifte vergilendirme',
      body:
        'İlgili ülkeyle yürürlükteki anlaşmanın hangi kazanç türüne nasıl uygulandığını ' +
        'değerlendirir; mahsup, istisna ve iade mekanizmalarının doğru kullanılmasını sağlarız.',
    },
    {
      heading: 'Transfer fiyatlandırması',
      body:
        'İlişkili kişilerle yapılan işlemlerde emsallere uygunluk analizini ve gerekli ' +
        'dokümantasyonu hazırlarız. Amaç, bir incelemede fiyatlandırmanın gerekçesini belgeyle ' +
        'gösterebilmektir.',
    },
    {
      heading: 'Yapı değerlendirmesi',
      body:
        'Yurt dışı şirket kurma, şube açma veya iştirak edinme kararlarında vergisel sonuçları ' +
        've bildirim yükümlülüklerini önceden ortaya koyarız.',
    },
  ],
  faqs: [
    {
      question: 'Yalnızca ihracat yapıyoruz, bu hizmete ihtiyacımız var mı?',
      answer:
        'Salt mal ihracatı çoğunlukla yurt içi kurallarla yönetilir. Yurt dışında hizmet ' +
        'sunumu, personel görevlendirmesi veya bir yabancı grup şirketiyle işlem varsa kapsam ' +
        'genişler.',
    },
    {
      question: 'Transfer fiyatlandırması raporu her yıl gerekir mi?',
      answer:
        'Dokümantasyon yükümlülüğü işlem türüne ve büyüklüğüne bağlıdır. Kapsamınızı birlikte ' +
        'belirler, yalnızca gereken belgeleri hazırlarız.',
    },
    {
      question: 'Yurt dışındaki danışmanımızla koordinasyon sağlar mısınız?',
      answer:
        'Evet. Karşı ülkedeki danışmanla ortak çalışır, iki tarafın da tutarlı pozisyon ' +
        'almasını sağlarız.',
    },
  ],
  relatedServiceSlugs: ['vergi-danismanligi', 'kurumsal-yapilandirma', 'kurumsal-raporlama'],
  relatedSectorSlugs: ['bilisim-ve-yazilim', 'imalat', 'lojistik'],
  seo: {
    title: 'Uluslararası vergilendirme',
    description:
      'Çifte vergilendirmeyi önleme anlaşmaları, transfer fiyatlandırması dokümantasyonu ve ' +
      'yurt dışı yapı değerlendirmesi.',
    keywords: [
      'uluslararası vergilendirme',
      'çifte vergilendirme',
      'transfer fiyatlandırması',
      'ÇVÖA',
    ],
  },
  order: 6,
  draft: true,
  updatedAt: '2026-09-06',
};
