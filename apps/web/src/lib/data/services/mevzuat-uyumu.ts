import type { ServiceRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const mevzuatUyumu: ServiceRecord = {
  slug: 'mevzuat-uyumu',
  title: 'Mali mevzuat uyumu',
  shortTitle: 'Mevzuat uyumu',
  summary:
    'Mali mevzuat sürekli değişir; uyum bir kerelik değil, izlenmesi gereken bir süreçtir. Bu ' +
    'hizmette şirketinizi ilgilendiren düzenleme değişikliklerini takip eder, etkisini ' +
    'operasyonel diline çevirir ve gerekli aksiyonu zamanında önümüze koyarız. Amaç, bir ' +
    'değişikliği ceza yazısıyla değil, önceden öğrenmektir.',
  sections: [
    {
      heading: 'Değişiklik takibi',
      body:
        'Faaliyet alanınıza göre bir izleme kapsamı belirleriz. Yayımlanan düzenlemeleri ' +
        'tarar, yalnızca sizi etkileyenleri sade bir özetle iletiriz.',
    },
    {
      heading: 'Etki değerlendirmesi',
      body:
        'Her değişiklik için "ne değişti, bizi nasıl etkiler, ne yapmamız gerekir" sorularını ' +
        'yanıtlarız. Gerekiyorsa süreç, sözleşme veya sistem tarafında yapılacak düzenlemeyi ' +
        'tarif ederiz.',
    },
    {
      heading: 'Uyum takvimi',
      body:
        'Yükümlülükleri ve son tarihleri tek bir takvimde toplarız. Böylece beyan, bildirim ve ' +
        'belgelendirme yükümlülükleri gözden kaçmaz.',
    },
  ],
  faqs: [
    {
      question: 'Bu hizmet vergi danışmanlığından farklı mı?',
      answer:
        'Örtüşür ama aynı değildir. Vergi danışmanlığı kararların vergisel etkisine odaklanır; ' +
        'mevzuat uyumu ise yürürlükteki tüm mali yükümlülüklerin eksiksiz ve zamanında yerine ' +
        'getirilmesini güvence altına alır.',
    },
    {
      question: 'Sadece vergi mevzuatını mı kapsıyor?',
      answer:
        'Öncelikli kapsam vergi ve mali mevzuattır. SGK, ticaret sicili ve sektöre özgü mali ' +
        'bildirim yükümlülükleri de kapsama dahil edilebilir.',
    },
    {
      question: 'Bilgilendirme ne sıklıkla geliyor?',
      answer:
        'Sizi etkileyen bir değişiklik oldukça iletilir; ayrıca dönemsel bir özet paylaşılır. ' +
        'Bilgi kirliliği yaratmamak için yalnızca ilgili düzenlemeler seçilir.',
    },
  ],
  relatedServiceSlugs: ['vergi-danismanligi', 'vergi-denetimi', 'kurumsal-raporlama'],
  relatedSectorSlugs: ['saglik', 'lojistik', 'perakende-ve-e-ticaret'],
  seo: {
    title: 'Mali mevzuat uyumu',
    description:
      'Mevzuat değişikliklerinin takibi, etki değerlendirmesi ve uyum takvimi. Bir düzenlemeyi ' +
      'ceza yazısıyla değil önceden öğrenin.',
    keywords: ['mevzuat uyumu', 'vergi mevzuatı takibi', 'uyum takvimi', 'cezai risk'],
  },
  order: 4,
  draft: true,
  updatedAt: '2026-09-06',
};
