/**
 * İçerik tipi tanımları.
 *
 * Bu katman ileride bir CMS'e (Sanity veya dosya tabanlı MDX) taşınabilecek
 * şekilde tasarlandı: her kayıt bir `slug`, SEO alanları ve ilişki alanları
 * taşır. Bileşenler yalnızca bu tiplere bağlıdır — kaynak bir dosya dizini de
 * olabilir, uzak bir CMS de. Geçiş sırasında yalnızca `data/*` yükleyicileri
 * değişir, sayfa kodu değişmez.
 *
 * NOT: Buradaki tüm Türkçe metinler TASLAKTIR; yayına almadan önce firma
 * tarafından gözden geçirilecektir. Somut sayı, oran veya mevzuat madde atfı
 * bilinçli olarak yazılmadı — içerik genel ve mesleki çerçeveden ilerliyor.
 */

export interface SeoMeta {
  /** <title> ve og:title için; marka son eki layout template'inde eklenir */
  title: string;
  /** meta description ve og:description */
  description: string;
  /** İsteğe bağlı anahtar kelimeler — CMS'e taşındığında etiket alanına eşlenir */
  keywords?: readonly string[];
}

export interface ContentSection {
  /** Alt başlık */
  heading: string;
  /** Paragraf metni — düz metin taslak; CMS'te portable text / MDX olur */
  body: string;
}

export interface Faq {
  question: string;
  answer: string;
}

/** Hizmet ve sektör kayıtlarının ortak iskeleti */
export interface ContentRecordBase {
  /** URL segmenti — CMS'te de birincil anahtar */
  slug: string;
  /** Sayfa başlığı ve menü etiketi */
  title: string;
  /** Kısa etiket (kartlar, kırıntı navigasyonu). Yoksa `title` kullanılır. */
  shortTitle?: string;
  /** Bir paragraflık özet — kart açıklaması ve sayfa girişi */
  summary: string;
  /** 3-5 alt başlıklı gövde bölümü */
  sections: readonly ContentSection[];
  /** Sayfaya özel 3 SSS */
  faqs: readonly Faq[];
  seo: SeoMeta;
  /** Hub sayfasındaki ve listelerdeki sıralama */
  order: number;
  /**
   * İçerik taslak mı? true ise firma revizyonu bekliyor demektir. Şu an tüm
   * kayıtlar taslaktır; sayfalar yine de yayınlanabilir çünkü metinler uydurma
   * değil, genel çerçevededir. Yayın öncesi bu bayrak sayfada bir not tetikler.
   */
  draft: boolean;
  /** Son düzenleme, ISO 8601. CMS'e taşındığında oradan gelir — şimdilik yer tutucu. */
  updatedAt: string;
}

export interface ServiceRecord extends ContentRecordBase {
  /** İlgili diğer hizmetler */
  relatedServiceSlugs: readonly string[];
  /** Bu hizmetin öne çıktığı sektörler */
  relatedSectorSlugs: readonly string[];
}

export interface SectorRecord extends ContentRecordBase {
  /** Bu sektörde en sık ihtiyaç duyulan hizmetler */
  relatedServiceSlugs: readonly string[];
  /** İlgili diğer sektörler */
  relatedSectorSlugs: readonly string[];
}

export type LegislationCategory = 'vergi' | 'sgk-bordro' | 'tesvik' | 'raporlama' | 'genel';

export const LEGISLATION_CATEGORY_LABELS: Record<LegislationCategory, string> = {
  vergi: 'Vergi',
  'sgk-bordro': 'SGK ve bordro',
  tesvik: 'Teşvik',
  raporlama: 'Raporlama',
  genel: 'Genel',
};

/**
 * Mevzuat merkezi makalesi — FİRMANIN KENDİ AÇIKLAYICI içeriği.
 *
 * Bunlar resmî duyuru DEĞİLDİR; bir konunun genel çerçevesini anlatan editoryal
 * yazılardır. Resmî duyurular ayrı bir beslemeden (bkz. fetchers/legislation)
 * gelir ve kaynak erişilemezse hiç gösterilmez.
 */
export interface LegislationArticle {
  slug: string;
  title: string;
  category: LegislationCategory;
  summary: string;
  sections: readonly ContentSection[];
  seo: SeoMeta;
  /** İçerik yayın tarihi (yer tutucu — CMS'e taşındığında oradan gelir). */
  publishedAt: string;
  updatedAt: string;
  draft: boolean;
  relatedArticleSlugs: readonly string[];
  /** İlgili hizmet sayfaları */
  relatedServiceSlugs: readonly string[];
}

export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  /** Kısa biyografi — taslak */
  bio: string;
  credentials: readonly string[];
  /** Firma kurucusu mu — /kurumsal sayfasında ayrı bölümde gösterilir */
  isFounder: boolean;
  order: number;
}

export interface Testimonial {
  slug: string;
  /** Yorum metni */
  quote: string;
  authorName: string;
  authorTitle: string;
  /** Müşteri firma adı */
  company?: string;
  /** İlgili sektör kaydı */
  sectorSlug?: string;
  /**
   * Yazılı yayın izni alındı mı? false ise UI'da RENDER EDİLMEZ.
   * Referanslar için müşterilerden yazılı izin durumu açık bir iş kararıdır
   * (bkz. docs/PROJECT-STATUS.md — "cevap bekleyen kararlar").
   */
  consentToPublish: boolean;
  order: number;
}
