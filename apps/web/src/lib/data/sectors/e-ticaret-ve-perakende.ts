import type { SectorRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const eTicaretVePerakende: SectorRecord = {
  slug: 'e-ticaret-ve-perakende',
  title: 'E-ticaret ve perakende',
  shortTitle: 'E-ticaret ve perakende',
  summary:
    'Uluslararası vergilendirme, dijital hizmet vergisi ve lojistik maliyet analizi ' +
    'sunuyoruz — marketplace komisyon vergilemesi dahil. İşlem hacmi yüksek, birim tutar ' +
    'düşük olduğundan belge düzeni, pazar yeri kesintileri, iade yönetimi ve stok doğruluğu ' +
    'gibi operasyonel kalemler vergisel sonuç üzerinde büyük etki yaratır.',
  sections: [
    {
      heading: 'Pazar yeri ve tahsilat',
      body:
        'Pazar yerlerinin uyguladığı komisyon, hizmet bedeli ve ödeme kesintilerinin muhasebe ' +
        've KDV açısından doğru işlenmesini kurarız.',
    },
    {
      heading: 'İade ve kampanya',
      body:
        'Yüksek iade oranları ve kampanya iskontoları hasılatı ve matrahı etkiler; bu ' +
        'düzeltmelerin sistematik biçimde kaydedilmesini sağlarız.',
    },
    {
      heading: 'Stok ve maliyet',
      body:
        'Çok kanallı satışta stok hareketlerinin ve satılan malın maliyetinin güvenilir ' +
        'takibi, hem kârlılık hem vergi matrahı için belirleyicidir.',
    },
  ],
  faqs: [
    {
      question: 'Birden fazla pazar yerinde satıyoruz, muhasebe nasıl toparlanır?',
      answer:
        'Her kanalın hakediş ve kesinti raporunu ortak bir şablona indirger, tek bir mutabakat ' +
        'düzeninde birleştiririz.',
    },
    {
      question: 'Yurt dışına da satış yapıyoruz, kapsam değişir mi?',
      answer:
        'Evet. Yurt dışı satışların KDV ve gümrük boyutu ile varsa yurt dışı depo kullanımı ' +
        'kapsama eklenir.',
    },
    {
      question: 'Küçük ölçekliyiz, bu düzeni sürdürebilir miyiz?',
      answer:
        'Amacımız sürdürülebilir bir düzen bırakmak. Raporlamayı mevcut e-ticaret ve muhasebe ' +
        'araçlarınızdan beslenecek biçimde kurarız.',
    },
  ],
  relatedServiceSlugs: ['vergi-danismanligi', 'mevzuat-uyumu', 'kurumsal-raporlama'],
  relatedSectorSlugs: ['teknoloji-ve-bilisim', 'gayrimenkul-ve-insaat'],
  seo: {
    title: 'E-ticaret ve perakende için vergi danışmanlığı',
    description:
      'Marketplace komisyon vergilemesi, dijital hizmet vergisi, iade ve kampanya ' +
      'düzeltmeleri, çok kanallı stok ve maliyet takibinin vergisel yönetimi.',
    keywords: ['e-ticaret vergi danışmanlığı', 'pazar yeri muhasebe', 'dijital hizmet vergisi'],
  },
  order: 3,
  draft: false,
  updatedAt: '2026-09-19',
};
