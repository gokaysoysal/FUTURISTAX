import { SceneBackdrop } from '@/components/media/SceneBackdrop';
import { SplitHeading } from '@/components/motion/SplitHeading';
import type { ReactNode } from 'react';

/**
 * Ana sayfa "sahne" sarmalayıcısı — her bölüm bir sahne, aralarında görsel
 * nefes yalnızca SceneBackdrop + `.section-beam` yumuşak ışık huzmesiyle
 * verilir. Sert ayraç çizgisi KALDIRILDI (kullanıcı, 2026-09-08): koyu
 * zeminde açık bir "beyaz çizgi" gibi okunuyordu. Gradyan her yüzeye
 * yayılmaz: backdrop seçici ve düşük opaklıkta.
 */
export function SceneSection({
  id,
  eyebrow,
  title,
  lead,
  backdrop,
  wide = false,
  children,
  className = '',
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  backdrop?: 'concrete' | 'geometric-shadow' | 'document-grid' | 'light-field' | 'none';
  /** V6: geniş bento bölümleri için kapsayıcı 72rem → 80rem */
  wide?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const headingId = id && title ? `${id}-title` : undefined;
  const container = wide ? 'max-w-7xl' : 'max-w-6xl';
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`section-beam relative isolate overflow-hidden py-[var(--spacing-section)] ${className}`.trim()}
    >
      {backdrop && backdrop !== 'none' ? <SceneBackdrop variant={backdrop} /> : null}
      <div className={`relative z-10 mx-auto ${container} px-5`}>
        {(eyebrow || title) && (
          <header className="text-scrim max-w-2xl">
            {eyebrow ? <p className="basis-ref uppercase">{eyebrow}</p> : null}
            {title ? (
              <SplitHeading
                as="h2"
                id={headingId}
                className="mt-2 text-[length:var(--text-3xl)] text-[var(--color-text)] sm:text-[length:var(--text-4xl)]"
              >
                {title}
              </SplitHeading>
            ) : null}
            {lead ? (
              <p className="mt-4 text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
                {lead}
              </p>
            ) : null}
          </header>
        )}
        <div className={eyebrow || title ? 'mt-12' : ''}>{children}</div>
      </div>
    </section>
  );
}
