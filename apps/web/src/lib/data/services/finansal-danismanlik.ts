import type { ServiceRecord } from '../types';

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
// Somut oran, tutar veya mevzuat madde atfı bilinçli olarak yazılmadı.
export const finansalDanismanlik: ServiceRecord = {
  slug: 'finansal-danismanlik',
  title: 'Finansal danışmanlık',
  shortTitle: 'Finansal danışmanlık',
  summary:
    'Finansal danışmanlık hizmetimiz, muhasebe verisini karar alınabilir bilgiye dönüştürür. ' +
    'Nakit akışı, bütçe, maliyet yapısı ve fiyatlandırma kararlarını sayısal bir temele oturtur; ' +
    'yönetimin geleceğe dönük senaryoları görebilmesini sağlarız. Rakamlar geçmişi anlatmakla ' +
    'kalmaz, bir sonraki hamleyi de gösterir.',
  sections: [
    {
      heading: 'Nakit akışı ve bütçe',
      body:
        'Dönemsel nakit akış tablosu kurar, tahsilat ve ödeme döngülerinizi modelleriz. Bütçe ' +
        'ile gerçekleşen arasındaki sapmaları düzenli olarak yorumlarız.',
    },
    {
      heading: 'Maliyet ve kârlılık analizi',
      body:
        'Ürün, hizmet veya müşteri kırılımında kârlılığı görünür kılarız. Hangi kalemin marjı ' +
        'taşıdığını, hangisinin aşındırdığını birlikte tespit ederiz.',
    },
    {
      heading: 'Karar desteği',
      body:
        'Yatırım, borçlanma, kapasite artışı gibi kararlarda birden fazla senaryoyu sayısal ' +
        'olarak karşılaştırır; her seçeneğin nakit ve kârlılık etkisini tabloya döker, kararı ' +
        'yöneticiye bırakırız.',
    },
    {
      heading: 'Raporlama ritmi',
      body:
        'Yönetim için sade, tekrar eden bir rapor seti tanımlarız. Her ay aynı göstergeler aynı ' +
        'biçimde gelir; kıyaslama kolaylaşır.',
    },
  ],
  faqs: [
    {
      question: 'Bu hizmet yatırım tavsiyesi içeriyor mu?',
      answer:
        'Hayır. Sermaye piyasası araçlarına yönelik yatırım tavsiyesi vermeyiz. Odağımız ' +
        'şirketin kendi finansal yönetimi: nakit, bütçe, maliyet ve karar analitiği.',
    },
    {
      question: 'Küçük bir ekiple bu raporları sürdürebilir miyiz?',
      answer:
        'Evet. Raporlama setini mevcut muhasebe yazılımınızdan beslenecek şekilde kurar, ' +
        'sürdürülmesi birkaç saatlik iş olan bir düzen bırakırız.',
    },
    {
      question: 'Vergi danışmanlığıyla nasıl birleşiyor?',
      answer:
        'Finansal kararların çoğunun bir vergisel yüzü vardır. İki hizmet birlikte alındığında ' +
        'senaryolar hem nakit hem vergi etkisiyle birlikte değerlendirilir.',
    },
  ],
  relatedServiceSlugs: ['kurumsal-raporlama', 'kurumsal-yapilandirma', 'yatirim-tesvik-yonetimi'],
  relatedSectorSlugs: ['bilisim-ve-yazilim', 'saglik', 'hizmet-ve-danismanlik'],
  seo: {
    title: 'Finansal danışmanlık',
    description:
      'Nakit akışı, bütçe, maliyet ve kârlılık analizi ile karar desteği. Muhasebe verisini ' +
      'yönetilebilir bilgiye çeviren düzenli raporlama.',
    keywords: ['finansal danışmanlık', 'nakit akışı yönetimi', 'bütçe', 'kârlılık analizi'],
  },
  order: 3,
  draft: true,
  updatedAt: '2026-09-06',
};
