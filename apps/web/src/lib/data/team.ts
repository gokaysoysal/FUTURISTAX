import { site } from '@futuristax/config';
import type { TeamMember } from './types';

/**
 * Ekip kayıtları.
 *
 * Kurucu bilgisi tek doğruluk kaynağından (`@futuristax/config` → site.founder)
 * gelir; ad, unvan ve unvanlar burada tekrar yazılmaz.
 *
 * TODO(firma): Kurucu dışındaki ekip üyeleri, kısa biyografileri ve unvanları
 * firma tarafından sağlanacak. Uydurma isim veya özgeçmiş EKLENMEDİ.
 *
 * Biyografi metni TASLAKTIR ve firma onayı bekliyor; deneyim yılı, geçmiş
 * kurum veya sayısal iddia bilinçli olarak yazılmadı.
 */
export const FOUNDER: TeamMember = {
  slug: 'gokay-soysal',
  name: site.founder.name,
  title: site.founder.title.tr,
  bio: [
    `${site.brand.name}'nin kurucusu.`,
    'Serbest Muhasebeci Mali Müşavir (SMMM) unvanıyla, şirketlere vergi, mali mevzuat uyumu ve',
    'finansal karar süreçlerinde danışmanlık veriyor. Çalışma yaklaşımı, yükümlülükleri takip',
    'etmekle başlayıp kalıcı bir mali yapı kurmaya dayanıyor.',
  ].join(' '),
  credentials: [...site.founder.credentials],
  isFounder: true,
  order: 1,
};

export const TEAM: readonly TeamMember[] = [FOUNDER];
