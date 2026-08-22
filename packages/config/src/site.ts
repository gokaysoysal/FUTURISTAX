/**
 * Firma bilgilerinin TEK doğruluk kaynağı.
 *
 * Kural: telefon, adres, e-posta veya kurumsal sabitler bu dosya dışında
 * hiçbir yerde yazılmaz. Değişiklik yalnızca burada yapılır.
 */

export const site = {
  brand: {
    name: 'FuturistaX Advisory',
    shortName: 'FuturistaX',
    tagline: {
      tr: 'Stratejik Vergi ve Mali Danışmanlık',
      en: 'Strategic Tax & Financial Advisory',
    },
    foundedYear: 2013,
  },

  contact: {
    email: 'info@futuristax.com',
    /** E.164 — tel: bağlantıları ve schema.org için */
    phoneE164: '+905452899838',
    /** Ekranda gösterilecek biçim */
    phoneDisplay: '+90 545 289 98 38',
    address: {
      street: 'Bülten Caddesi 72/7',
      district: 'Çankaya',
      city: 'Ankara',
      postalCode: '06680',
      country: 'TR',
      countryName: 'Türkiye',
    },
    /** Google Haritalar bağlantısı için koordinat — DOĞRULANMALI */
    geo: { lat: 39.9006, lng: 32.8586, verified: false },
    officeHours: {
      tr: 'Hafta içi 09:00 – 18:00',
      en: 'Weekdays 09:00 – 18:00',
    },
  },

  founder: {
    name: 'Gökay Soysal',
    title: { tr: 'Kurucu · SMMM', en: 'Founder · Certified Public Accountant' },
    credentials: ['SMMM'],
  },

  social: {
    linkedin: '', // gerçek URL girilene kadar boş — boşsa bağlantı render edilmez
    instagram: '',
  },

  urls: {
    production: 'https://futuristax.com',
  },

  locales: ['tr', 'en'] as const,
  defaultLocale: 'tr' as const,

  /**
   * Yasal/mesleki uyarılar. Her hesaplayıcı ve AI çıktısında gösterilmesi zorunlu.
   */
  disclaimers: {
    calculator: {
      tr: 'Bu araç genel bilgilendirme amaçlıdır, mali müşavirlik hizmeti yerine geçmez. Sonuçlar bağlayıcı değildir.',
      en: 'This tool is for general information only and does not constitute professional tax advice.',
    },
    assistant: {
      tr: 'Bu asistan genel bilgilendirme sağlar. Somut durumunuz için uzman görüşü alınız.',
      en: 'This assistant provides general information only. Consult a professional for your specific case.',
    },
  },
} as const;

export type Locale = (typeof site.locales)[number];

/**
 * DOĞRULANMAMIŞ İDDİALAR — müşteri onayı bekliyor.
 *
 * Mevcut sitede yer alan "%98 başarı oranı", "150+ aktif müşteri",
 * "%30 vergi optimizasyonu" gibi ifadelerin ölçüm metodolojisi yok.
 * TÜRMOB reklam/tanıtım kısıtları açısından da gözden geçirilmeleri gerekiyor.
 *
 * Bu değerler doğrulanana kadar `publish: false` kalır ve UI'da render edilmez.
 */
export const unverifiedClaims = {
  publish: false,
  items: [
    { key: 'activeClients', value: '150+', needs: 'Sayının tanımı ve tarihi' },
    { key: 'successRate', value: '%98', needs: 'Ölçüm metodolojisi' },
    { key: 'avgTaxOptimization', value: '%30', needs: 'Vaka örneklemi ve hesap yöntemi' },
  ],
} as const;
