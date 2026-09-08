import { SceneRegion } from '@/components/backdrop/SceneRegion';
import { SceneBackdrop } from '@/components/media/SceneBackdrop';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Reveal } from '@/components/motion/Reveal';
import { SplitHeading } from '@/components/motion/SplitHeading';
import { closingCta } from '@/lib/data/placeholder';
import Link from 'next/link';

/**
 * KAPANIŞ CTA (V4-AKIS Bölüm 2 — referans sırası #10)
 * Büyük başlık + iki buton, ortalanmış.
 */
export function ClosingCta() {
  return (
    <section
      id="iletisim-cta"
      aria-labelledby="closing-cta-title"
      className="relative isolate overflow-hidden py-[var(--spacing-section)]"
    >
      <SceneBackdrop variant="light-field" />
      <SceneRegion tone={0.9} density={0.78} depth={0.9} flow={0.55} />
      <div className="text-scrim relative z-10 mx-auto max-w-3xl px-5 text-center">
        <SplitHeading
          as="h2"
          id="closing-cta-title"
          className="text-[length:var(--text-4xl)] text-[var(--color-text)] sm:text-[length:var(--text-5xl)]"
        >
          {closingCta.title}
        </SplitHeading>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
            {closingCta.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <MagneticButton>
              <Link
                href={closingCta.primaryCta.href}
                className="btn btn-primary group px-7 py-3.5 text-[length:var(--text-sm)]"
              >
                {closingCta.primaryCta.label}
                <span aria-hidden="true" className="btn-arrow">
                  →
                </span>
              </Link>
            </MagneticButton>
            <Link
              href={closingCta.secondaryCta.href}
              className="btn btn-ghost group px-7 py-3.5 text-[length:var(--text-sm)]"
            >
              {closingCta.secondaryCta.label}
              <span aria-hidden="true" className="btn-arrow">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
