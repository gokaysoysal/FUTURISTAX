import { ClosingCta } from '@/components/home/ClosingCta';
import { EngagementModels } from '@/components/home/EngagementModels';
import { FeatureTriad } from '@/components/home/FeatureTriad';
import { Hero } from '@/components/home/Hero';
import { LogoMarquee } from '@/components/home/LogoMarquee';
import { PhraseMarquee } from '@/components/home/PhraseMarquee';
import { PinnedCapabilities } from '@/components/home/PinnedCapabilities';
import { ServicesQuad } from '@/components/home/ServicesQuad';
import { SolutionsSection } from '@/components/home/SolutionsSection';
import { StatsRow } from '@/components/home/StatsRow';
import { TestimonialTriad } from '@/components/home/TestimonialTriad';
import { BURDEN_DEFAULTS, computeBurden } from '@/lib/charts/burden';
import { formatCurrency } from '@/lib/format';
import { DEFAULT_YEAR, getUpcomingDeadlines } from '@futuristax/tax-engine';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description:
    'Ankara merkezli vergi ve mali danışmanlık. Beyanname takvimi, hesaplama araçları ve ' +
    'kurumsal vergi planlaması.',
};

/*
 * ANA SAYFA — V4-AKIS: referansa (futureoffinance.peachweb.io) sadık akış.
 *
 * Bölüm sırası referanstan: hero → çözümler → logo şeridi → özellikler →
 * pinlenmiş temel yetenekler → hizmetler → rakamlar → referanslar →
 * çalışma modeli → kapanış CTA. Footer + scroll % layout'ta.
 *
 * Altyapıya dokunulmadı: hero kartları ve Çözümler panosu tax-engine + saf
 * hesap katmanından GERÇEK veri gösterir. Metinler CONTENT_IS_PLACEHOLDER
 * bayrağı arkasında (src/lib/data/placeholder/).
 */
export default function HomePage() {
  const referenceDate = new Date().toISOString().slice(0, 10);
  const deadlines = getUpcomingDeadlines({ referenceDate, horizonDays: 30, taxpayerType: 'all' });
  const next = deadlines[0];
  const nextDeadline = next
    ? { title: next.title, date: next.date, daysRemaining: next.daysRemaining }
    : null;
  const burdenTotalLabel = formatCurrency(
    computeBurden({ ...BURDEN_DEFAULTS, year: DEFAULT_YEAR }).total,
  );

  return (
    <>
      <Hero
        nextDeadline={nextDeadline}
        deadlineCount={deadlines.length}
        burdenTotalLabel={burdenTotalLabel}
      />
      <PhraseMarquee />
      <SolutionsSection />
      <LogoMarquee />
      <FeatureTriad />
      <PinnedCapabilities />
      <ServicesQuad />
      <StatsRow />
      <TestimonialTriad />
      <EngagementModels />
      <ClosingCta />
    </>
  );
}
