import type { LegislationArticle } from './types';

/**
 * Mevzuat merkezi — editoryal makaleler.
 *
 * TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
 * Bunlar RESMÎ DUYURU DEĞİLDİR; genel çerçeve anlatan yazılardır. Somut oran,
 * tutar, tebliğ numarası veya son tarih bilinçli olarak yazılmadı; yalnızca
 * yürürlükte olduğu sabit olan kanun adları anılmıştır.
 *
 * Resmî duyurular ayrı bir beslemeden gelir (src/lib/fetchers/legislation.ts)
 * ve kaynak erişilemezse ASLA yedek içerik üretilmez.
 */
export const LEGISLATION_ARTICLES: readonly LegislationArticle[] = [
  {
    slug: 'mali-tatil-nedir',
    title: 'Mali tatil nedir, hangi süreleri etkiler',
    category: 'vergi',
    summary:
      'Mali tatil, her yıl 1–20 Temmuz arasında uygulanan ve belirli beyan, bildirim ve ödeme ' +
      'sürelerini uzatan bir düzenlemedir. Bu yazı mali tatilin kapsamını ve pratik sonuçlarını ' +
      'genel hatlarıyla anlatır.',
    sections: [
      {
        heading: 'Dayanağı ve dönemi',
        body:
          'Mali tatil, 5604 sayılı Mali Tatil İhdas Edilmesi Hakkında Kanun ile düzenlenmiştir ve ' +
          'her yıl 1–20 Temmuz arasını kapsar. Haziran ayının son gününün tatile denk gelmesi gibi ' +
          'durumlarda başlangıç kayabilir.',
      },
      {
        heading: 'Hangi süreler etkilenir',
        body:
          'Son günü mali tatile rastlayan beyan ve bildirim süreleri, kanunda öngörülen biçimde ' +
          'uzar. Bazı yükümlülükler kapsam dışıdır. Hangi sürenin nasıl etkilendiği yükümlülük ' +
          'türüne göre değişir.',
      },
      {
        heading: 'Pratikte ne yapmalı',
        body:
          'Temmuz ayına denk gelen yükümlülükler için son tarihleri mali tatili dikkate alarak ' +
          'planlamak gerekir. Vergi Takvimi aracımız hafta sonu ve resmî tatil kaydırmasını ' +
          'uygular; mali tatil için ise ayrı bir uyarı gösterir.',
      },
    ],
    seo: {
      title: 'Mali tatil nedir, hangi süreleri etkiler',
      description:
        '5604 sayılı Kanun kapsamında mali tatilin dönemi, etkilediği süreler ve pratik sonuçları ' +
        'üzerine genel bir çerçeve.',
      keywords: ['mali tatil', '5604 sayılı Kanun', 'beyan süresi uzaması'],
    },
    publishedAt: '2026-09-06',
    updatedAt: '2026-09-06',
    draft: true,
    relatedArticleSlugs: ['vergi-incelemesi-sureci'],
    relatedServiceSlugs: ['mevzuat-uyumu', 'vergi-danismanligi'],
  },
  {
    slug: 'vergi-incelemesi-sureci',
    title: 'Vergi incelemesi süreci nasıl işler',
    category: 'vergi',
    summary:
      'Bir vergi incelemesi; başlama, bilgi ve belge talebi, tutanak ve sonuç aşamalarından ' +
      'oluşan yapılandırılmış bir süreçtir. Bu yazı sürecin genel akışını ve mükellefin ' +
      'haklarını çerçeveler.',
    sections: [
      {
        heading: 'Başlangıç ve kapsam',
        body:
          'İnceleme, görevlendirme ve mükellefe bildirimle başlar. İncelemenin türü (tam, sınırlı) ' +
          've dönemi kapsamı belirler. Vergi Usul Kanunu incelemenin nasıl yürütüleceğine dair ' +
          'usul kuralları içerir.',
      },
      {
        heading: 'Bilgi ve belge aşaması',
        body:
          'İnceleme elemanı defter, belge ve açıklama talep eder. Taleplere zamanında ve tutarlı ' +
          'yanıt vermek, sürecin öngörülebilir ilerlemesi açısından belirleyicidir.',
      },
      {
        heading: 'Sonuç ve itiraz yolları',
        body:
          'İnceleme, rapor ve gerekiyorsa tarhiyatla sonuçlanır. Mükellefin uzlaşma, dava ve ' +
          'düzeltme gibi başvuru yolları vardır; hangisinin uygun olduğu somut duruma bağlıdır.',
      },
    ],
    seo: {
      title: 'Vergi incelemesi süreci nasıl işler',
      description:
        'Vergi incelemesinin başlama, bilgi-belge, tutanak ve sonuç aşamaları ile mükellefin ' +
        'başvuru yolları üzerine genel çerçeve.',
      keywords: ['vergi incelemesi', 'VUK', 'uzlaşma', 'tarhiyat'],
    },
    publishedAt: '2026-09-06',
    updatedAt: '2026-09-06',
    draft: true,
    relatedArticleSlugs: ['mali-tatil-nedir', 'kdv-tevkifati-genel-cerceve'],
    relatedServiceSlugs: ['vergi-denetimi', 'vergi-danismanligi'],
  },
  {
    slug: 'e-donusum-genel-bakis',
    title: 'e-Dönüşüm uygulamalarına genel bakış',
    category: 'raporlama',
    summary:
      'e-Fatura, e-Arşiv, e-İrsaliye ve e-Defter gibi uygulamalar, belge ve kayıt düzenini ' +
      'elektronik ortama taşır. Bu yazı bu uygulamaların birbiriyle ilişkisini ve genel ' +
      'yükümlülük mantığını anlatır.',
    sections: [
      {
        heading: 'Uygulamalar ve kapsamı',
        body:
          'e-Belge uygulamaları, düzenlenen belgenin türüne göre farklılaşır. Bir işletmenin hangi ' +
          'uygulamalara geçmesi gerektiği; faaliyet alanı, ciro ve diğer ölçütlere bağlı olarak ' +
          'belirlenir.',
      },
      {
        heading: 'Geçiş ve entegrasyon',
        body:
          'Geçiş; özel entegratör, doğrudan entegrasyon veya portal yöntemlerinden biriyle yapılır. ' +
          'Muhasebe yazılımıyla entegrasyonun doğru kurulması, günlük işlerin aksamaması için ' +
          'önemlidir.',
      },
      {
        heading: 'Kayıt ve saklama',
        body:
          'Elektronik belgelerin belirlenen sürelerle ve bütünlüğü korunacak biçimde saklanması ' +
          'gerekir. e-Defter beratlarının zamanında yüklenmesi ayrı bir yükümlülüktür.',
      },
    ],
    seo: {
      title: 'e-Dönüşüm uygulamalarına genel bakış',
      description:
        'e-Fatura, e-Arşiv, e-İrsaliye ve e-Defter uygulamalarının ilişkisi, geçiş yöntemleri ve ' +
        'saklama yükümlülükleri üzerine genel çerçeve.',
      keywords: ['e-Dönüşüm', 'e-Fatura', 'e-Defter', 'e-Arşiv'],
    },
    publishedAt: '2026-09-06',
    updatedAt: '2026-09-06',
    draft: true,
    relatedArticleSlugs: [],
    relatedServiceSlugs: ['kurumsal-raporlama', 'mevzuat-uyumu'],
  },
  {
    slug: 'yatirim-tesvik-belgesi-sureci',
    title: 'Yatırım teşvik belgesi süreci',
    category: 'tesvik',
    summary:
      'Yatırım teşvik belgesi; başvuru, belge düzenlenmesi, yatırımın yürütülmesi ve tamamlama ' +
      'vizesi aşamalarından oluşur. Bu yazı sürecin genel akışını ve dikkat edilmesi gereken ' +
      'noktaları çerçeveler.',
    sections: [
      {
        heading: 'Başvuru ve belge',
        body:
          'Başvuru, yatırımın niteliği ve yerine göre değerlendirilir. Belgeye bağlanacak ' +
          'harcamaların belge tarihinden sonra yapılması gerektiği için zamanlama kritiktir.',
      },
      {
        heading: 'Yatırım dönemi',
        body:
          'Belge kapsamındaki makine-teçhizat alımları ve diğer harcamalar belgede öngörülen süre ' +
          'içinde gerçekleştirilir. Kapsam değişikliklerinde revizyon talebi gerekir.',
      },
      {
        heading: 'Tamamlama ve izleme',
        body:
          'Yatırım tamamlandığında tamamlama vizesi süreci yürütülür. Belge sonrası izleme ve ' +
          'bildirim yükümlülüklerinin aksaması, sağlanan desteklerin geri alınmasına yol açabilir.',
      },
    ],
    seo: {
      title: 'Yatırım teşvik belgesi süreci',
      description:
        'Yatırım teşvik belgesinde başvuru, yatırım dönemi, revizyon ve tamamlama vizesi ' +
        'aşamaları üzerine genel çerçeve.',
      keywords: ['yatırım teşvik belgesi', 'tamamlama vizesi', 'teşvik süreci'],
    },
    publishedAt: '2026-09-06',
    updatedAt: '2026-09-06',
    draft: true,
    relatedArticleSlugs: [],
    relatedServiceSlugs: ['yatirim-tesvik-yonetimi', 'finansal-danismanlik'],
  },
  {
    slug: 'kdv-tevkifati-genel-cerceve',
    title: 'KDV tevkifatı: genel çerçeve',
    category: 'vergi',
    summary:
      'KDV tevkifatı, belirli işlemlerde verginin bir kısmının alıcı tarafından sorumlu sıfatıyla ' +
      'beyan edilmesidir. Bu yazı tevkifatın mantığını ve taraflara düşen yükümlülükleri genel ' +
      'hatlarıyla anlatır.',
    sections: [
      {
        heading: 'Tevkifat nedir',
        body:
          'Tam tevkifatta verginin tamamı, kısmi tevkifatta bir kısmı alıcı tarafından beyan edilir. ' +
          'Hangi işlemlerin tevkifata tabi olduğu ve oranlar ilgili düzenlemelerde belirlenir.',
      },
      {
        heading: 'Satıcının yükümlülüğü',
        body:
          'Satıcı, faturada tevkifatı ayrı gösterir ve yalnızca kendi payına düşen KDV’yi beyan ' +
          'eder. Tevkif edilen kısım için iade hakkı doğabilir.',
      },
      {
        heading: 'Alıcının yükümlülüğü',
        body:
          'Alıcı, tevkif ettiği KDV’yi 2 No.lu KDV beyannamesiyle sorumlu sıfatıyla beyan eder ve ' +
          'öder. Belgelendirme ve beyan uyumu, bir incelemede sık sorgulanan alanlardandır.',
      },
    ],
    seo: {
      title: 'KDV tevkifatı: genel çerçeve',
      description:
        'Tam ve kısmi KDV tevkifatının mantığı, satıcı ve alıcının yükümlülükleri ile 2 No.lu KDV ' +
        'beyannamesi üzerine genel çerçeve.',
      keywords: ['KDV tevkifatı', 'sorumlu sıfatıyla KDV', '2 No.lu KDV beyannamesi'],
    },
    publishedAt: '2026-09-06',
    updatedAt: '2026-09-06',
    draft: true,
    relatedArticleSlugs: ['vergi-incelemesi-sureci'],
    relatedServiceSlugs: ['mevzuat-uyumu', 'vergi-danismanligi'],
  },
];

const BY_SLUG = new Map(LEGISLATION_ARTICLES.map((article) => [article.slug, article]));

export function getArticle(slug: string): LegislationArticle | undefined {
  return BY_SLUG.get(slug);
}

export function articleSlugs(): string[] {
  return LEGISLATION_ARTICLES.map((article) => article.slug);
}
