import type { ServiceRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const uluslararasiVergilendirme: ServiceRecord = {
  slug: 'uluslararasi-vergilendirme',
  title: 'Uluslararası vergilendirme',
  shortTitle: 'Uluslararası vergilendirme',
  summary:
    'Yurt dışı yatırım ve işlemler için çifte vergilendirmeyi önleme anlaşmaları kapsamında ' +
    'danışmanlık veriyoruz; transfer fiyatlandırması belgelendirme de kapsamdadır. Sınır ötesi ' +
    'faaliyet, aynı kazancın birden fazla ülkede vergilenmesi riskini beraberinde getirir — ' +
    'yurt dışı yapıların vergisel değerlendirmesinde de yol gösteririz.',
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
        'Kurumların ilişkili kişilerle (ortaklar, bağlı şirketler, yöneticiler) gerçekleştirdiği ' +
        'işlemleri emsallere uygunluk ilkesi çerçevesinde değerlendiririz. KVK Madde 13 uyarınca ' +
        'yurt içi ilişkili kişi işlemlerinde yıllık 1 milyon TL, yurt dışı işlemlerde ise ' +
        '500.000 TL üzerindeki tutarlar için belgeleme zorunludur; eksik veya hatalı ' +
        'belgelendirme örtülü kazanç dağıtımı hükümlerini ve vergi ziyaı cezasını doğurabilir.',
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
  relatedServiceSlugs: ['vergi-danismanligi', 'stratejik-yapilandirma', 'kurumsal-raporlama'],
  relatedSectorSlugs: ['teknoloji-ve-bilisim', 'uretim-ve-sanayi', 'finans-ve-sermaye-piyasalari'],
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
  order: 7,
  draft: false,
  updatedAt: '2026-09-19',
};
