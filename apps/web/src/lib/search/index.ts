import { SECTORS, SERVICES } from '@/lib/data';
import { FAQ_CATEGORIES } from '@/lib/data/faq';
import { LEGISLATION_ARTICLES } from '@/lib/data/legislation';
import { TOOLS } from '@/lib/tools';
import { normalizeTr } from './normalize';

/**
 * Site geneli arama dizini — istemci tarafında, sunucuya gitmeden.
 *
 * Kaynaklar: hizmetler, sektörler, mevzuat makaleleri, hesaplayıcılar, SSS,
 * ana sayfalar. Her giriş normalize edilmiş metin taşır (Türkçe arama için).
 */

export type SearchGroup = 'Hizmet' | 'Sektör' | 'Makale' | 'Hesaplayıcı' | 'SSS' | 'Sayfa';

export type SearchEntry = {
  id: string;
  title: string;
  description: string;
  group: SearchGroup;
  href: string;
  /** normalize edilmiş başlık — yüksek ağırlık */
  nTitle: string;
  /** normalize edilmiş tüm metin */
  nBody: string;
};

const STATIC_PAGES: { title: string; description: string; href: string }[] = [
  { title: 'Kurumsal', description: 'Firma, yaklaşım ve ekip', href: '/kurumsal' },
  { title: 'İletişim', description: 'Görüşme talebi ve iletişim bilgileri', href: '/iletisim' },
  { title: 'Kariyer', description: 'Açık pozisyonlar ve başvuru', href: '/kariyer' },
  { title: 'Mevzuat merkezi', description: 'Editoryal yazılar ve resmî besleme', href: '/mevzuat' },
  { title: 'Hesaplama araçları', description: 'Tüm hesaplayıcılar ve yıl karşılaştırma', href: '/araclar' },
  { title: 'Sıkça sorulan sorular', description: 'Çalışma biçimi ve süreç soruları', href: '/sss' },
];

function entry(
  id: string,
  title: string,
  description: string,
  group: SearchGroup,
  href: string,
  extra = '',
): SearchEntry {
  return {
    id,
    title,
    description,
    group,
    href,
    nTitle: normalizeTr(title),
    nBody: normalizeTr([title, description, extra].join(' ')),
  };
}

let cache: SearchEntry[] | null = null;

export function buildSearchIndex(): SearchEntry[] {
  if (cache) return cache;

  const entries: SearchEntry[] = [
    ...SERVICES.map((s) =>
      entry(`svc-${s.slug}`, s.title, s.summary, 'Hizmet', `/hizmetler/${s.slug}`, s.seo.keywords?.join(' ') ?? ''),
    ),
    ...SECTORS.map((s) =>
      entry(`sec-${s.slug}`, s.title, s.summary, 'Sektör', `/sektorler/${s.slug}`, s.seo.keywords?.join(' ') ?? ''),
    ),
    ...LEGISLATION_ARTICLES.map((a) =>
      entry(`art-${a.slug}`, a.title, a.summary, 'Makale', `/mevzuat/${a.slug}`),
    ),
    ...TOOLS.map((t) =>
      entry(`tool-${t.slug}`, t.title, t.description, 'Hesaplayıcı', `/araclar/${t.slug}`, t.basis),
    ),
    ...FAQ_CATEGORIES.flatMap((category) =>
      category.items.map((faq, i) =>
        entry(`faq-${category.slug}-${i}`, faq.question, faq.answer, 'SSS', '/sss'),
      ),
    ),
    ...STATIC_PAGES.map((p, i) => entry(`page-${i}`, p.title, p.description, 'Sayfa', p.href)),
  ];

  cache = entries;
  return entries;
}
