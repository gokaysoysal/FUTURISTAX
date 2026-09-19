import type { SectorRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const tarimVeGida: SectorRecord = {
  slug: 'tarim-ve-gida',
  title: 'Tarım ve gıda',
  summary:
    'Tarımsal üretim istisnalarından yararlanma, çiftçi muafiyetleri ve agro-sanayi yatırım ' +
    'teşviklerinde danışmanlık sunuyoruz. Üretici, kooperatif ve sanayi işletmesi arasındaki ' +
    'geçişlerde vergisel muamele önemli ölçüde değişir.',
  sections: [
    {
      heading: 'Tarımsal istisnalar',
      body:
        'Gelir Vergisi Kanunu kapsamındaki tarımsal kazanç istisnalarının ve çiftçi ' +
        'muafiyetlerinin işletmenize uygulanabilirliğini değerlendirir, gerekli belgelendirmeyi ' +
        'gözden geçiririz.',
    },
    {
      heading: 'Agro-sanayi yatırımı',
      body:
        'Üretimden işlemeye geçişte (kurutma, paketleme, işleme tesisi) yatırım teşvik ' +
        'mekanizmalarından yararlanmayı, harcamaların zamanlamasıyla birlikte planlarız.',
    },
    {
      heading: 'Kooperatif ve birlik yapıları',
      body:
        'Tarımsal kooperatif, birlik veya aile şirketi yapılarının vergisel sonuçlarını ve ' +
        'ortaklar arası gelir dağılımını netleştiririz.',
    },
  ],
  faqs: [
    {
      question: 'Bireysel çiftçilere de hizmet veriyor musunuz?',
      answer:
        'Kapsamımız kurumsal ve kooperatif yapılardır. Bireysel üreticiler için ancak bir ' +
        'şirket veya birlik yapısı söz konusuysa danışmanlık anlamlı olur.',
    },
    {
      question: 'İşleme tesisi kurmak istisnayı etkiler mi?',
      answer:
        'Evet. Doğrudan tarımsal üretimin ötesine geçen işleme faaliyeti, farklı bir vergisel ' +
        'rejime tabi olabilir; bu ayrımı yatırım kararından önce netleştiririz.',
    },
    {
      question: 'Yatırım teşvik yönetimi hizmetinizle farkı ne?',
      answer:
        'Bu sayfa sektöre özgü konuları anlatır; başvuru ve süreç yönetiminin kendisi Yatırım ' +
        'teşvik yönetimi hizmetimiz kapsamında yürütülür.',
    },
  ],
  relatedServiceSlugs: ['yatirim-tesvik-yonetimi', 'sgk-ve-isci-mevzuati', 'mevzuat-uyumu'],
  relatedSectorSlugs: ['uretim-ve-sanayi', 'enerji-ve-cevre'],
  seo: {
    title: 'Tarım ve gıda sektörü için vergi danışmanlığı',
    description:
      'Tarımsal üretim istisnaları, çiftçi muafiyetleri ve agro-sanayi yatırım teşviklerinin ' +
      'vergisel yönetimi.',
    keywords: ['tarımsal kazanç istisnası', 'çiftçi muafiyeti', 'agro-sanayi teşvik'],
  },
  order: 7,
  draft: false,
  updatedAt: '2026-09-19',
};
