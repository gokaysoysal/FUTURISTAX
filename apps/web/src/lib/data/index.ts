/**
 * İçerik veri katmanı — tek giriş noktası.
 *
 * Sayfalar içeriği yalnızca buradan alır. Kaynak bugün `src/lib/data/` altındaki
 * tipli sabitlerdir; yarın bir CMS (Sanity veya dosya tabanlı MDX) olabilir.
 * Geçişte yalnızca bu modülün altındaki yükleyiciler değişir.
 */

export type {
  ContentSection,
  Faq,
  SectorRecord,
  SeoMeta,
  ServiceRecord,
  TeamMember,
  Testimonial,
} from './types';

export { SERVICES, getService, serviceSlugs } from './services';
export { SECTORS, getSector, sectorSlugs } from './sectors';
export { FAQ_CATEGORIES, GENERAL_FAQS } from './faq';
export type { FaqCategory } from './faq';
export { TEAM, FOUNDER } from './team';
export { TESTIMONIALS, publishableTestimonials } from './testimonials';
