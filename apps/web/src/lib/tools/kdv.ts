import { COMMON_FAQS, type ToolMeta } from './types';

// TASLAK METİN — firma revizyonu bekliyor. Somut oran yazılmadı.
export const kdv: ToolMeta = {
  slug: 'kdv',
  title: 'KDV hesaplama',
  short: 'KDV hesaplama',
  description:
    'KDV hariç tutara KDV ekleyin veya KDV dahil tutardan ayrıştırın. Matrah, oran ve toplam ' +
    'adım adım.',
  intro:
    'Bir tutara katma değer vergisi ekleyin ya da KDV dahil bir tutarın içindeki vergiyi ' +
    'ayrıştırın. Sonuç yalnızca KDV tutarını değil, matrahı ve toplamı da gösterir.',
  basis: '3065 sayılı KDV Kanunu',
  howTo: {
    name: 'KDV nasıl hesaplanır',
    steps: [
      'Vergi yılını seçin.',
      '“KDV ekle” için KDV hariç, “KDV ayrıştır” için KDV dahil tutarı girin.',
      'Yönü ve KDV oranı grubunu seçin.',
      'Matrah, hesaplanan KDV ve toplam anında görünür.',
    ],
  },
  faqs: [
    {
      question: 'Hangi oran grubunu seçmeliyim?',
      answer:
        'Mal veya hizmetinizin tabi olduğu orana göre seçin: genel oran, indirimli oran ya da ' +
        'en düşük (temel gıda) oran. Emin değilseniz bir mali müşavire danışın.',
    },
    COMMON_FAQS.rates,
    COMMON_FAQS.binding,
  ],
  order: 1,
};
