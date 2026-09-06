import type { SectorRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const perakendeVeETicaret: SectorRecord = {
  slug: 'perakende-ve-e-ticaret',
  title: 'Perakende ve e-ticaret',
  shortTitle: 'Perakende ve e-ticaret',
  summary:
    'Perakende ve e-ticarette işlem hacmi yüksek, birim tutar düşüktür; bu da belge düzeni, ' +
    'pazar yeri kesintileri, iade yönetimi ve stok doğruluğu gibi operasyonel kalemlerin ' +
    'vergisel sonuç üzerinde büyük etki yaratması demektir.',
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
  relatedSectorSlugs: ['lojistik', 'bilisim-ve-yazilim'],
  seo: {
    title: 'Perakende ve e-ticaret için vergi danışmanlığı',
    description:
      'Pazar yeri kesintileri, iade ve kampanya düzeltmeleri, çok kanallı stok ve maliyet ' +
      'takibinin vergisel yönetimi.',
    keywords: ['e-ticaret vergi danışmanlığı', 'pazar yeri muhasebe', 'perakende KDV'],
  },
  order: 5,
  draft: true,
  updatedAt: '2026-09-06',
};
