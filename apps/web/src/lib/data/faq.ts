import type { Faq } from './types';

/**
 * Genel SSS — /sss sayfasında ve FAQPage şemasında kullanılır.
 *
 * Hizmet ve sektör sayfalarının kendi SSS'leri ilgili kayıtlarda tutulur;
 * burası firmanın çalışma biçimine dair site geneli sorulardır.
 *
 * TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
 * Fiyatlandırma ve süre gibi kesinleşmemiş konularda somut taahhüt verilmedi.
 */

export interface FaqCategory {
  slug: string;
  title: string;
  items: readonly Faq[];
}

export const FAQ_CATEGORIES: readonly FaqCategory[] = [
  {
    slug: 'calisma-bicimi',
    title: 'Çalışma biçimi',
    items: [
      {
        question: 'İlk görüşme nasıl ilerliyor?',
        answer:
          'İlk görüşme ücretsizdir ve yaklaşık bir saat sürer. Mevcut durumunuzu, ' +
          'beklentilerinizi ve varsa acil konuları dinleriz; ardından kapsamı ve çalışma ' +
          'biçimini yazılı olarak paylaşırız.',
      },
      {
        question: 'Mevcut mali müşavirimizle çalışmaya devam edebilir miyiz?',
        answer:
          'Evet. Danışmanlık hizmetimiz mali müşavirliğin yerine geçmez; onunla koordineli ' +
          'yürür. Birçok müşterimizde defter ve beyanname tarafı kendi müşavirlerinde kalır.',
      },
      {
        question: 'Uzaktan mı yüz yüze mi çalışıyorsunuz?',
        answer:
          'Her ikisi de mümkündür. Ankara içinde yüz yüze toplantı yapılabilir; şehir dışı ' +
          'müşterilerle çalışma çevrim içi yürütülür.',
      },
    ],
  },
  {
    slug: 'kapsam-ve-sure',
    title: 'Kapsam ve süre',
    items: [
      {
        question: 'Tek seferlik bir konu için danışmanlık alınabilir mi?',
        answer:
          'Evet. Belirli bir işlem, karar veya inceleme için sınırlı kapsamlı danışmanlık ' +
          'verilebilir. Sürekli danışmanlık ise dönemsel bir çalışma ilişkisidir.',
      },
      {
        question: 'Bir projenin süresi ne kadar olur?',
        answer:
          'Kapsama ve veri hazırlığına bağlıdır. Görüşme sonrası paylaşılan teklifte tahmini ' +
          'süre ve kilometre taşları belirtilir.',
      },
      {
        question: 'Sözleşme sonrası kapsam değişebilir mi?',
        answer:
          'Evet. İhtiyaç değiştiğinde kapsam yazılı olarak güncellenir; sürpriz bir ' +
          'genişleme olmadan ilerlenir.',
      },
    ],
  },
  {
    slug: 'gizlilik',
    title: 'Gizlilik ve veri',
    items: [
      {
        question: 'Paylaştığımız mali veriler nasıl korunuyor?',
        answer:
          'Tüm çalışma gizlilik yükümlülüğü altında yürütülür. Verileriniz yalnızca ' +
          'danışmanlık kapsamında kullanılır, üçüncü taraflarla paylaşılmaz.',
      },
      {
        question: 'İletişim formundan gönderdiğimiz bilgiler ne oluyor?',
        answer:
          'Form verileri yalnızca talebinizi değerlendirmek için işlenir. Ayrıntılar KVKK ' +
          'aydınlatma metninde açıklanmıştır.',
      },
    ],
  },
];

/** Tüm SSS'lerin düz listesi — FAQPage şeması ve arama için. */
export const GENERAL_FAQS: readonly Faq[] = FAQ_CATEGORIES.flatMap((c) => c.items);
