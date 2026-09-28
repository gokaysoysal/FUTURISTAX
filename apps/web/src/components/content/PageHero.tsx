import { SceneBackdrop } from '@/components/media/SceneBackdrop';
import { SplitHeading } from '@/components/motion/SplitHeading';
import type { ReactNode } from 'react';

/**
 * İç sayfa giriş sahnesi — ana sayfayla aynı ritim.
 *
 * `SceneSection`'ın sayfa-başı karşılığı: seçici `SceneBackdrop` + `basis-ref`
 * eyebrow + `SplitHeading` (harf animasyonu, Türkçe glif korumalı) + lead +
 * ince `scene-divider`. Her iç sayfa bunu kullanır; başlık düzeni ve görsel
 * nefes site genelinde tek yerden gelir.
 */
type Backdrop = 'concrete' | 'geometric-shadow' | 'document-grid' | 'light-field' | 'none';

export function PageHero({
  eyebrow,
  title,
  lead,
  backdrop = 'light-field',
  breadcrumbs,
  actions,
}: {
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  backdrop?: Backdrop;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden pb-8">
      {backdrop !== 'none' ? <SceneBackdrop variant={backdrop} /> : null}
      <div className="relative z-10">
        {breadcrumbs}
        <p className="basis-ref mt-6 uppercase">{eyebrow}</p>
        <SplitHeading
          as="h1"
          className="mt-2 text-[length:var(--text-4xl)] text-[var(--color-text)] sm:text-[length:var(--text-5xl)]"
        >
          {title}
        </SplitHeading>
        {lead ? (
          <p className="mt-4 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
            {lead}
          </p>
        ) : null}
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      <hr className="scene-divider mt-8" />
    </header>
  );
}
