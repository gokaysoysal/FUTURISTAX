import { HeroCanvas } from '@/components/hero/HeroCanvas';
import { HeroFloatingCards } from '@/components/home/HeroFloatingCards';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { heroContent } from '@/lib/data/placeholder';
import Link from 'next/link';

/**
 * HERO (V4-AKIS Bölüm 2 — referans sırası #1)
 *
 * Büyük display başlık (split-type kelime kelime, Türkçe glif korumalı) +
 * alt başlık + iki CTA. Başlığın çevresinde dört yüzen kart (GERÇEK veri),
 * WebGL sahnesinin önünde. Metin SSR ile gelir; sahne progressive biner.
 */
export function Hero({
  nextDeadline,
  deadlineCount,
  burdenTotalLabel,
}: {
  nextDeadline: { title: string; date: string; daysRemaining: number } | null;
  deadlineCount: number;
  burdenTotalLabel: string;
}) {
  return (
    <section className="section-beam relative isolate flex min-h-[88vh] items-center overflow-hidden px-5 pt-20 pb-[var(--spacing-section)]">
      <HeroCanvas />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="relative lg:mx-auto lg:max-w-3xl lg:text-center">
          <Reveal>
            <p className="basis-ref uppercase">{heroContent.eyebrow}</p>
          </Reveal>
          <SplitHeading
            as="h1"
            by="words"
            className="mt-4 text-[length:var(--text-4xl)] text-[var(--color-text)] sm:text-[length:var(--text-6xl)]"
          >
            {heroContent.title}
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)] sm:text-[length:var(--text-lg)]">
              {heroContent.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3 lg:justify-center">
              <MagneticButton>
                <Link
                  href={heroContent.primaryCta.href}
                  className="btn btn-primary group px-7 py-3.5 text-[length:var(--text-sm)]"
                >
                  {heroContent.primaryCta.label}
                  <span aria-hidden="true" className="btn-arrow">
                    →
                  </span>
                </Link>
              </MagneticButton>
              <Link
                href={heroContent.secondaryCta.href}
                className="btn btn-ghost group px-7 py-3.5 text-[length:var(--text-sm)]"
              >
                {heroContent.secondaryCta.label}
                <span aria-hidden="true" className="btn-arrow">
                  →
                </span>
              </Link>
            </div>
          </Reveal>

          <HeroFloatingCards
            nextDeadline={nextDeadline}
            deadlineCount={deadlineCount}
            burdenTotalLabel={burdenTotalLabel}
          />
        </div>
      </div>
    </section>
  );
}
