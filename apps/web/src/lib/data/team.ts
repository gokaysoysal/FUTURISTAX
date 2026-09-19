import { site } from '@futuristax/config';
import type { TeamMember } from './types';

/**
 * Ekip kayıtları.
 *
 * Kurucu bilgisi tek doğruluk kaynağından (`@futuristax/config` → site.founder)
 * gelir; ad, unvan ve unvanlar burada tekrar yazılmaz.
 *
 * Biyografi metni firmanın kendi yayınladığı `www.futuristax.com` sitesinden
 * alındı (V10, kaynak doğrulandı) — uydurma değil.
 *
 * TODO(firma): Kurucu dışındaki ekip üyeleri henüz sağlanmadı. Uydurma isim
 * veya özgeçmiş EKLENMEDİ.
 */
export const FOUNDER: TeamMember = {
  slug: 'gokay-soysal',
  name: site.founder.name,
  title: site.founder.title.tr,
  bio: 'Stratejik vergi planlaması, denetim ve mali mevzuat uyumu konularında 12+ yıl deneyimi. Kurumlar vergisi, KDV yapılandırması ve uluslararası vergilendirme alanlarında özelleşmiş çözümler.',
  credentials: [...site.founder.credentials],
  isFounder: true,
  order: 1,
};

export const TEAM: readonly TeamMember[] = [FOUNDER];
