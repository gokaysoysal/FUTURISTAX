import type { ServiceRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const vergiDenetimi: ServiceRecord = {
  slug: 'vergi-denetimi',
  title: 'Vergi denetimi ve risk analizi',
  shortTitle: 'Vergi denetimi',
  summary:
    'Bir vergi incelemesine hazırlıklı girmek, incelemeyi yönetmekten daha ucuzdur. Bu hizmette ' +
    'şirketinizin vergisel pozisyonlarını, bir denetçinin bakış açısıyla önceden gözden geçirir; ' +
    'zayıf noktaları ve belgelendirme boşluklarını inceleme başlamadan kapatırız. İnceleme ' +
    'süreci başladıysa, savunma ve uzlaşma aşamalarını yanınızda yürütürüz.',
  sections: [
    {
      heading: 'Risk analizi',
      body:
        'Beyanlarınızı, muhasebe kayıtlarınızı ve tekrar eden işlemlerinizi tarar; hangi ' +
        'kalemlerin bir incelemede soru işareti yaratabileceğini raporlarız. Her bulgu için ' +
        'düzeltme veya belgelendirme önerisiyle birlikte gelir.',
    },
    {
      heading: 'İnceleme hazırlığı',
      body:
        'İnceleme başladığında istenen bilgi ve belgelerin derlenmesi, tutanakların ' +
        'değerlendirilmesi ve sorulara verilecek yanıtların hazırlanması aşamalarını yönetiriz.',
    },
    {
      heading: 'İtiraz ve uzlaşma',
      body:
        'Tarhiyat çıkması hâlinde uzlaşma, dava ve düzeltme yolları arasından şirketiniz için en ' +
        'uygun stratejiyi birlikte belirleriz. Sürecin her aşamasında maliyeti ve olasılıkları ' +
        'açıkça paylaşırız.',
    },
  ],
  faqs: [
    {
      question: 'İnceleme almadan da bu hizmet gerekli mi?',
      answer:
        'Evet. Risk analizi asıl değerini inceleme öncesinde üretir; sorunlu bir pozisyon ' +
        'zamanaşımı dolmadan gönüllü düzeltmeyle giderilebiliyorsa, tarhiyat ve ceza riski ' +
        'büyük ölçüde ortadan kalkar.',
    },
    {
      question: 'İnceleme sürecinde muhasebecimizle çalışır mısınız?',
      answer:
        'Evet. Mevcut mali müşavirinizle koordineli çalışırız; amacımız yerini almak değil, ' +
        'inceleme özelinde uzman desteği vermektir.',
    },
    {
      question: 'Süreç ne kadar sürer?',
      answer:
        'Risk analizi kapsamı ve kayıt hacmine göre birkaç hafta sürebilir. İnceleme süresi ' +
        'idarenin takvimine bağlıdır; biz hazırlık ve yanıt aşamalarını hızlandırmaya odaklanırız.',
    },
  ],
  relatedServiceSlugs: ['vergi-danismanligi', 'mevzuat-uyumu', 'bagimsiz-denetim-destegi'],
  relatedSectorSlugs: ['imalat', 'perakende-ve-e-ticaret', 'insaat-ve-gayrimenkul'],
  seo: {
    title: 'Vergi denetimi ve risk analizi',
    description:
      'İnceleme öncesi risk taraması, inceleme hazırlığı, itiraz ve uzlaşma yönetimi. Zayıf ' +
      'noktaları denetim başlamadan kapatın.',
    keywords: ['vergi incelemesi', 'vergi risk analizi', 'uzlaşma', 'tarhiyat'],
  },
  order: 2,
  draft: true,
  updatedAt: '2026-09-06',
};
