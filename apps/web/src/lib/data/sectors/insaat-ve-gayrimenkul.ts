import type { SectorRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const insaatVeGayrimenkul: SectorRecord = {
  slug: 'insaat-ve-gayrimenkul',
  title: 'İnşaat ve gayrimenkul',
  shortTitle: 'İnşaat ve gayrimenkul',
  summary:
    'İnşaat ve gayrimenkul projelerinde vergisel sonuç; proje yapısına, hasılat paylaşımı veya ' +
    'kat karşılığı modeline ve işin yıllara sâri niteliğine göre büyük farklılık gösterir. Proje ' +
    'başında kurulan doğru yapı, teslim aşamasındaki sürprizleri önler.',
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
  relatedServiceSlugs: ['vergi-danismanligi', 'kurumsal-yapilandirma', 'mevzuat-uyumu'],
  relatedSectorSlugs: ['imalat', 'hizmet-ve-danismanlik'],
  seo: {
    title: 'İnşaat ve gayrimenkul için vergi danışmanlığı',
    description:
      'Kat karşılığı ve hasılat paylaşımı modelleri, yıllara sâri işlerde gelir-maliyet ' +
      'eşleştirmesi ve teslim süreçlerinin vergisel yönetimi.',
    keywords: ['inşaat vergi danışmanlığı', 'kat karşılığı inşaat', 'gayrimenkul projesi vergi'],
  },
  order: 2,
  draft: true,
  updatedAt: '2026-09-06',
};
