import { site } from '@futuristax/config';
import type { MetadataRoute } from 'next';

/**
 * Eski sitede sitemap yoktu ve tüm içerik tek URL'deydi.
 * Her hizmet ve sektör artık kendi adresinde ve ayrı indekslenebilir.
 */
const STATIC_PATHS = [
  '',
  '/kurumsal',
  '/hizmetler',
  '/sektorler',
  '/araclar',
  '/mevzuat',
  '/referanslar',
  '/kariyer',
  '/sss',
  '/iletisim',
  '/kvkk',
  '/gizlilik',
  '/cerez-politikasi',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_PATHS.flatMap((path) =>
    site.locales.map((locale) => ({
      url: `${site.urls.production}${locale === 'tr' ? '' : `/${locale}`}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
  );
}
