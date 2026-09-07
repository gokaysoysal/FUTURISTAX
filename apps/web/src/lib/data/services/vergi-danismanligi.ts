import type { ServiceRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const vergiDanismanligi: ServiceRecord = {
  slug: 'vergi-danismanligi',
  title: 'Vergi danışmanlığı',
  shortTitle: 'Vergi danışmanlığı',
  summary:
    'Vergi danışmanlığı hizmetimiz, şirketinizin vergi yükünü mevzuata tam uyum içinde ' +
    'yönetilebilir bir kaleme dönüştürmeyi amaçlar. Kurumlar vergisi, gelir vergisi ve dolaylı ' +
    'vergiler arasındaki etkileşimi bütüncül değerlendirir; alacağınız kararların vergisel ' +
    'sonuçlarını önceden görmenizi sağlarız. Amaç, cezayı sonradan yönetmek değil, yapıyı baştan ' +
    'doğru kurmaktır.',
  sections: [
    {
      heading: 'Ne yapıyoruz',
      body:
        'Mevcut vergi yapınızı, muhasebe düzeninizi ve tekrar eden işlemlerinizi inceleriz. ' +
        'Riskli alanları ve fırsatları birlikte önceliklendirir, uygulanabilir bir yol haritası ' +
        'çıkarırız.',
    },
    {
      heading: 'Çalışma biçimi',
      body:
        'Danışmanlık dönemsel değil süreklidir: önemli sözleşmeler, yatırım kararları ve grup içi ' +
        'işlemler hayata geçmeden önce masaya gelir. Böylece vergisel etki, karar geri alınamaz ' +
        'hâle gelmeden değerlendirilir.',
    },
    {
      heading: 'Kapsam',
      body:
        'Beyanname öncesi kontrol, geçici vergi planlaması, istisna ve indirimlerin doğru ' +
        'uygulanması, transfer fiyatlandırması gözden geçirmesi ve yıl sonu kapanış desteği bu ' +
        'hizmetin içindedir.',
    },
    {
      heading: 'Çıktı',
      body:
        'Her dönem, alınan pozisyonları ve dayanaklarını özetleyen yazılı bir not alırsınız. Bir ' +
        'inceleme gündeme geldiğinde geçmiş kararların gerekçesi belgeli olur.',
    },
  ],
  faqs: [
    {
      question: 'Vergi danışmanlığı ile mali müşavirlik aynı şey mi?',
      answer:
        'Hayır. Mali müşavirlik defter tutma ve beyanname verme gibi yasal yükümlülükleri ' +
        'kapsar; danışmanlık ise bu yükümlülüklerin ötesinde kararlarınızın vergisel etkisini ' +
        'önceden değerlendirmeye odaklanır. İkisi birlikte yürür.',
    },
    {
      question: 'Küçük ölçekli bir şirket için de anlamlı mı?',
      answer:
        'Evet. Ölçek küçüldükçe tek bir yanlış pozisyonun bilançoya etkisi görece büyür. Erken ' +
        'kurulan doğru yapı, büyüme aşamasında maliyetli düzeltmelerden korur.',
    },
    {
      question: 'Hizmet nasıl başlıyor?',
      answer:
        'İlk görüşmede mevcut durumu ve beklentilerinizi dinleriz. Ardından kapsamı ve çalışma ' +
        'biçimini yazılı olarak paylaşır, onayınızdan sonra başlarız.',
    },
  ],
  relatedServiceSlugs: ['vergi-denetimi', 'mevzuat-uyumu', 'uluslararasi-vergilendirme'],
  relatedSectorSlugs: ['imalat', 'insaat-ve-gayrimenkul', 'bilisim-ve-yazilim'],
  seo: {
    title: 'Vergi danışmanlığı',
    description:
      'Kurumlar vergisi, gelir vergisi ve KDV planlaması. Kararlarınızın vergisel etkisini ' +
      'önceden değerlendiren sürekli danışmanlık.',
    keywords: ['vergi danışmanlığı', 'kurumlar vergisi planlaması', 'vergi optimizasyonu'],
  },
  order: 1,
  draft: true,
  updatedAt: '2026-09-06',
};
