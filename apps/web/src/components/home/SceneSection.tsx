import { SceneBackdrop } from '@/components/media/SceneBackdrop';
import { SplitHeading } from '@/components/motion/SplitHeading';
import type { ReactNode } from 'react';

/**
 * Ana sayfa "sahne" sarmalayıcısı — her bölüm bir sahne, aralarında görsel
 * nefes (SceneBackdrop + ince ayraç). Gradyan her yüzeye yayılmaz: backdrop
 * seçici ve düşük opaklıkta.
 */
export function SceneSection({
  id,
  eyebrow,
  title,
  lead,
  backdrop,
  divider = true,
  children,
  className = '',
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  backdrop?: 'concrete' | 'geometric-shadow' | 'document-grid' | 'light-field' | 'none';
  divider?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`relative isolate overflow-hidden py-[var(--spacing-section)] ${className}`.trim()}
    >
      {backdrop && backdrop !== 'none' ? <SceneBackdrop variant={backdrop} /> : null}
      <div className="relative z-10 mx-auto max-w-6xl px-5">
        {(eyebrow || title) && (
          <header className="max-w-2xl">
            {eyebrow ? <p className="basis-ref uppercase">{eyebrow}</p> : null}
            {title ? (
              <SplitHeading
                as="h2"
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
      {divider ? (
        <hr className="scene-divider mx-auto mt-[var(--spacing-section)] max-w-6xl" />
      ) : null}
    </section>
  );
}
