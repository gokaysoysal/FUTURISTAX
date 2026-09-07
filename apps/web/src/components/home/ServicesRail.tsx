'use client';

import { SERVICES } from '@/lib/data';
import { loadGsap } from '@/lib/motion/gsap-lazy';
import { prefersReducedMotion } from '@/lib/motion/scroll';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

/**
 * Hizmetler — yatay akan kart dizisi.
 *
 * TABAN: native `overflow-x: auto` + scroll-snap rail. Tab ile kartlar
 * gezilir, ok tuşlarıyla konteyner kaydırılır — klavye erişimi tam, pin YOK
 * (klavye tuzağı yok).
 *
 * ÜST KATMAN (yalnızca reduced-motion yoksa + ince işaretçi + görünüre
 * yaklaşınca): sayfa dikey scroll'una bağlı hafif yatay drift (GSAP
 * ScrollTrigger, `import()` ile tembel). Native scroll'u ezmez.
 */
export function ServicesRail() {
  const scope = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const scopeEl = scope.current;
    const el = track.current;
    if (!scopeEl || !el || prefersReducedMotion()) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (typeof IntersectionObserver !== 'function') return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const run = async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      const drift = Math.min(160, Math.max(0, el.scrollWidth - el.clientWidth) * 0.12);
      const tween = gsap.fromTo(
        el,
        { x: drift },
        {
          x: -drift,
          ease: 'none',
          scrollTrigger: { trigger: scopeEl, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      );
      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        void run();
      },
      { rootMargin: '256px' },
    );
    io.observe(scopeEl);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, []);

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
