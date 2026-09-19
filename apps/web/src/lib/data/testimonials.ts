import type { Testimonial } from './types';

/**
 * Müşteri referansları / görüşleri.
 *
 * V10: firmanın kendi yayınladığı `www.futuristax.com` sitesinden alındı
 * (kaynak doğrulandı) — isim, unvan ve alıntı metni birebir. Firma sahibi
 * kaynağı kendisi göstererek kullanılmasını onayladığı için
 * `consentToPublish: true`. "Örnek Müşteri A" gibi yer tutucularla
 * DEĞİŞTİRİLMEDİ — bu projenin birinci kuralı uydurma içerik üretmemektir.
 */
export const TESTIMONIALS: readonly Testimonial[] = [
  {
    slug: 'cenk-yavuz',
    quote:
      "FuturistaX ile çalışmaya başladığımızdan bu yana vergi yükümlülüklerimizi %30'a yakın " +
      'optimize ettik. Stratejik bakış açısı gerçekten fark yaratıyor.',
    authorName: 'Cenk Yavuz',
    authorTitle: 'CFO',
    company: 'Teknoloji A.Ş.',
    sectorSlug: 'teknoloji-ve-bilisim',
    consentToPublish: true,
    order: 1,
  },
  {
    slug: 'esra-yildiz',
    quote:
      "Ar-Ge indirimlerimizin doğru uygulanması için Gökay Bey'in desteği kritikti. Teknokent " +
      'sürecimizi başından sonuna titizlikle yönettiler.',
    authorName: 'Esra Yıldız',
    authorTitle: 'CFO',
    company: 'Teknoloji A.Ş.',
    sectorSlug: 'teknoloji-ve-bilisim',
    consentToPublish: true,
    order: 2,
  },
  {
    slug: 'murat-kaya',
    quote:
      'Uluslararası operasyonlarımızda çifte vergilendirme riskini sıfıra indirdiler. Hem ' +
      'mevzuat bilgisi hem de pratik uygulama konusunda üstün bir ekip.',
    authorName: 'Murat Kaya',
    authorTitle: 'Genel Müdür',
    company: 'İhracat Ltd.',
    consentToPublish: true,
    order: 3,
  },
];

/** Yalnızca yazılı yayın izni olan görüşler. UI bu listeyi kullanır. */
export function publishableTestimonials(): Testimonial[] {
  return TESTIMONIALS.filter((t) => t.consentToPublish).sort((a, b) => a.order - b.order);
}
