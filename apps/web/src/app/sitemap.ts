import { sectorSlugs, serviceSlugs } from '@/lib/data';
import { toolSlugs } from '@/lib/tools';
import { site } from '@futuristax/config';
import type { MetadataRoute } from 'next';

/**
 * Eski sitede sitemap yoktu ve tüm içerik tek URL'deydi.
 * Her hizmet ve sektör artık kendi adresinde ve ayrı indekslenebilir.
 *
 * Statik yollar elle; hizmet/sektör detay yolları içerik katmanından türetilir,
 * böylece yeni bir kayıt eklendiğinde sitemap otomatik günceldir.
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

function priorityFor(path: string): number {
  if (path === '') return 1;
  // Detay sayfaları (iki bölmeli yol) hub'lardan bir kademe altta.
  if (path.split('/').length > 2) return 0.6;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const detailPaths = [
    ...serviceSlugs().map((slug) => `/hizmetler/${slug}`),
    ...sectorSlugs().map((slug) => `/sektorler/${slug}`),
    ...toolSlugs().map((slug) => `/araclar/${slug}`),
  ];

  return [...STATIC_PATHS, ...detailPaths].flatMap((path) =>
    site.locales.map((locale) => ({
      url: `${site.urls.production}${locale === 'tr' ? '' : `/${locale}`}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: priorityFor(path),
    })),
  );
}
