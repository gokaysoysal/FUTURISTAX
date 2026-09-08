import { SceneRegion } from '@/components/backdrop/SceneRegion';
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
 * alt başlık + iki CTA. Kalıcı site-geneli arka plan sahnesinin önünde
 * (V5 Bölüm 2 — hero'nun kendi WebGL canvas'ı kaldırıldı).
 *
 * DÜZEN (V5 Bölüm 1 — görünen hatalar):
 *  - Başlık sütunu `max-w-3xl`, ortalanmış; boyutu akışkan (`--text-hero`).
 *  - Yüzen kartlar bu sütunun DIŞINDA: `xl`+ ekranda sol/sağ raylarda
 *    (kapsayıcı `76rem`, sütun `48rem` → her rayda ~14rem, kart 12rem).
 *    `xl` altında CTA'ların ALTINDA ızgara — başlığın üstüne asla binmez.
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
    <section className="section-beam section-beam--strong relative isolate flex min-h-[88vh] items-center overflow-hidden px-5 pt-20 pb-[var(--spacing-section)]">
      <SceneRegion tone={0.12} density={0.78} depth={0.1} flow={0.58} />

      <div className="relative z-10 mx-auto w-full max-w-[80rem]">
        <div className="text-scrim relative mx-auto max-w-3xl xl:text-center">
          <Reveal>
            <p className="basis-ref uppercase">{heroContent.eyebrow}</p>
          </Reveal>
          <SplitHeading
            as="h1"
            by="words"
            className="mt-4 text-[length:var(--text-hero)] leading-[0.95] text-[var(--color-text)] [hyphens:auto]"
          >
            {heroContent.title}
          </SplitHeading>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)] sm:text-[length:var(--text-lg)]">
              {heroContent.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3 xl:justify-center">
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
        </div>

        <HeroFloatingCards
          nextDeadline={nextDeadline}
          deadlineCount={deadlineCount}
          burdenTotalLabel={burdenTotalLabel}
        />
      </div>
    </section>
  );
}
