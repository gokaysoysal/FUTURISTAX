import type { SectorRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const gayrimenkulVeInsaat: SectorRecord = {
  slug: 'gayrimenkul-ve-insaat',
  title: 'Gayrimenkul ve inşaat',
  shortTitle: 'Gayrimenkul ve inşaat',
  summary:
    'Yıllara sâri inşaat onarım işleri, değer artış kazançları ve KDV istisnalarında proje ' +
    'bazlı maliyet muhasebesi sunuyoruz. Vergisel sonuç; proje yapısına, hasılat paylaşımı ' +
    'veya kat karşılığı modeline göre büyük farklılık gösterir — proje başında kurulan doğru ' +
    'yapı, teslim aşamasındaki sürprizleri önler.',
  sections: [
    {
      heading: 'Proje yapısı',
      body:
        'Arsa sahibi, yüklenici ve alıcı arasındaki ilişkiyi vergisel açıdan modelleriz. Kat ' +
        'karşılığı, hasılat paylaşımı ve doğrudan satış senaryolarının sonuçlarını karşılaştırırız.',
    },
    {
      heading: 'Gelir ve maliyet eşleştirmesi',
      body:
        'Yıllara yaygın işlerde hasılat ve maliyetin dönemlere doğru dağıtılması, hem vergi hem ' +
        'raporlama açısından belirleyicidir. Bu eşleştirmeyi kurar ve izleriz.',
    },
    {
      heading: 'Teslim ve sonrası',
      body:
        'Bağımsız bölüm teslimleri, ortak alan devirleri ve proje kapanışındaki vergisel ' +
        'yükümlülükleri önceden takvime bağlarız.',
    },
  ],
  faqs: [
    {
      question: 'Her proje için ayrı şirket kurmak gerekir mi?',
      answer:
        'Zorunlu değildir ama çoğu zaman risk ayrıştırması ve raporlama netliği açısından ' +
        'tercih edilir. Kararı projenin büyüklüğü ve ortaklık yapısıyla birlikte veririz.',
    },
    {
      question: 'Kat karşılığı sözleşme imzalanmadan mı görüşmeliyiz?',
      answer:
        'Evet. Sözleşmenin vergisel sonucu, imzalandıktan sonra değiştirilmesi güç bir ' +
        'çerçeve kurar; en verimli aşama taslak aşamasıdır.',
    },
    {
      question: 'Bireysel gayrimenkul yatırımcısına da hizmet veriyor musunuz?',
      answer:
        'Kapsamımız kurumsal projelerdir. Bireysel yatırımcılar için ancak bir şirket yapısı ' +
        'söz konusuysa danışmanlık anlamlı olur.',
    },
  ],
  relatedServiceSlugs: ['vergi-danismanligi', 'stratejik-yapilandirma', 'mevzuat-uyumu'],
  relatedSectorSlugs: ['uretim-ve-sanayi', 'finans-ve-sermaye-piyasalari'],
  seo: {
    title: 'Gayrimenkul ve inşaat için vergi danışmanlığı',
    description:
      'Kat karşılığı ve hasılat paylaşımı modelleri, yıllara sâri işlerde gelir-maliyet ' +
      'eşleştirmesi ve KDV istisnalarının vergisel yönetimi.',
    keywords: ['inşaat vergi danışmanlığı', 'kat karşılığı inşaat', 'gayrimenkul projesi vergi'],
  },
  order: 4,
  draft: false,
  updatedAt: '2026-09-19',
};
