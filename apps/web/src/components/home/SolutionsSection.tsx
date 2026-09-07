import { TaxBurdenPanel } from '@/components/dashboards/TaxBurdenPanel';
import { SceneBackdrop } from '@/components/media/SceneBackdrop';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { solutionsContent } from '@/lib/data/placeholder';
import Link from 'next/link';

/**
 * ÇÖZÜMLER (V4-AKIS Bölüm 2 — referans sırası #2)
 *
 * Etiket + büyük başlık + iki buton + açıklama; yanında GERÇEK bir dashboard
 * bileşeni (Vergi Yükü Panosu — canlı hesap + grafik, statik resim değil).
 */
export function SolutionsSection() {
  return (
    <section
      id="cozumler"
      aria-labelledby="cozumler-title"
      className="relative isolate overflow-hidden py-[var(--spacing-section)]"
    >
      <SceneBackdrop variant="light-field" />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div>
          <p className="basis-ref uppercase">{solutionsContent.eyebrow}</p>
          <SplitHeading
            as="h2"
            id="cozumler-title"
            className="mt-2 text-[length:var(--text-3xl)] text-[var(--color-text)] sm:text-[length:var(--text-4xl)]"
          >
            {solutionsContent.title}
          </SplitHeading>
          <Reveal delay={0.08}>
            <p className="mt-4 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
              {solutionsContent.body}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton>
                <Link
                  href={solutionsContent.primaryCta.href}
                  className="btn btn-primary group px-6 py-3 text-[length:var(--text-sm)]"
                >
                  {solutionsContent.primaryCta.label}
                  <span aria-hidden="true" className="btn-arrow">
                    →
                  </span>
                </Link>
              </MagneticButton>
              <Link
                href={solutionsContent.secondaryCta.href}
                className="btn btn-ghost group px-6 py-3 text-[length:var(--text-sm)]"
              >
                {solutionsContent.secondaryCta.label}
                <span aria-hidden="true" className="btn-arrow">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="surface-glow">
          <TaxBurdenPanel />
        </Reveal>
      </div>
    </section>
  );
}
