import type { ServiceRecord } from '../types';

// GERÇEK İÇERİK — www.futuristax.com'dan (V10, kaynak doğrulandı).
export const vergiDenetimi: ServiceRecord = {
  slug: 'vergi-denetimi',
  title: 'Vergi denetimi ve risk',
  shortTitle: 'Vergi denetimi',
  summary:
    'Olası mali riskleri önceden tespit eden, mevzuata tam uyumlu bir yapı oluşturuyoruz. Vergi ' +
    'incelemelerine hazırlık ve itiraz süreçleri yönetimi bu hizmetin kapsamındadır — bir vergi ' +
    'incelemesine hazırlıklı girmek, incelemeyi sonradan yönetmekten her zaman daha ucuzdur.',
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
  relatedServiceSlugs: ['vergi-danismanligi', 'mevzuat-uyumu', 'kurumsal-raporlama'],
  relatedSectorSlugs: ['uretim-ve-sanayi', 'e-ticaret-ve-perakende', 'gayrimenkul-ve-insaat'],
  seo: {
    title: 'Vergi denetimi ve risk',
    description:
      'İnceleme öncesi risk taraması, inceleme hazırlığı, itiraz ve uzlaşma yönetimi. Zayıf ' +
      'noktaları denetim başlamadan kapatın.',
    keywords: ['vergi incelemesi', 'vergi risk analizi', 'uzlaşma', 'tarhiyat'],
  },
  order: 2,
  draft: false,
  updatedAt: '2026-09-19',
};
