'use client';

import { SERVICES } from '@/lib/data';
import { prefersReducedMotion, registerScroll } from '@/lib/motion/scroll';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useRef } from 'react';

/**
 * Hizmetler — yatay akan kart dizisi.
 *
 * TABAN: native `overflow-x: auto` + scroll-snap rail. Tab ile kartlar
 * gezilir, ok tuşlarıyla konteyner kaydırılır — klavye erişimi tam, pin YOK
 * (klavye tuzağı yok).
 *
 * ÜST KATMAN (yalnızca reduced-motion yoksa + ince işaretçi): sayfa dikey
 * scroll'una bağlı hafif yatay drift (GSAP ScrollTrigger). Native scroll'u
 * ezmez; reduced-motion'da hiç kurulmaz.
 */
export function ServicesRail() {
  const scope = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el || prefersReducedMotion()) return;
      if (window.matchMedia('(pointer: coarse)').matches) return;
      registerScroll();
      const drift = Math.min(160, Math.max(0, el.scrollWidth - el.clientWidth) * 0.12);
      gsap.fromTo(
        el,
        { x: drift },
        {
          x: -drift,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      );
    },
    { scope },
  );

  return (
    <div ref={scope}>
      <ul
        ref={track}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: kaydırılabilir rail'e klavye erişimi (axe scrollable-region-focusable)
        tabIndex={0}
        aria-label="Hizmetler — yatay kaydırılır"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]"
      >
        {SERVICES.map((service) => (
          <li key={service.slug} className="w-[78vw] shrink-0 snap-start sm:w-[380px]">
            <Link
              href={`/hizmetler/${service.slug}`}
              className="card card-interactive surface-glow flex h-full flex-col p-6"
            >
              <span className="basis-ref">{String(service.order).padStart(2, '0')}</span>
              <h3 className="mt-3 text-[length:var(--text-lg)] text-[var(--color-text)]">
                {service.shortTitle ?? service.title}
              </h3>
              <p className="mt-3 line-clamp-4 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                {service.summary}
              </p>
              <span className="mt-auto pt-4 text-[length:var(--text-xs)] text-[var(--color-accent)]">
                İncele
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
