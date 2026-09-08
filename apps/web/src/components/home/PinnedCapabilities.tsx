'use client';

import { SceneRegion } from '@/components/backdrop/SceneRegion';
import { capabilitySteps } from '@/lib/data/placeholder';
import { loadGsap } from '@/lib/motion/gsap-lazy';
import { prefersReducedMotion } from '@/lib/motion/scroll';
import { useEffect, useRef, useState } from 'react';

/**
 * TEMEL YETENEKLER — PİNLENMİŞ BÖLÜM (V4-AKIS Bölüm 2 #5, imza hareket)
 *
 * Referansın en güçlü deseni. Motion + JS varken: bölüm viewport'a pinlenir,
 * scroll ilerledikçe soldaki içerik ve sağdaki görsel değişir, 01/02/03 sayacı
 * ilerler, altta ince ilerleme çubuğu.
 *
 * FALLBACK (SSR / reduced-motion / IO yok): üç adım alt alta, hepsi görünür ve
 * etkileşimli. Pin YOK. `enhanced` yalnızca istemcide, motion açıkken, bölüm
 * görünüre yaklaşınca `true` olur.
 *
 * KLAVYE: pinli modda aktif olmayan adımlar `inert` — Tab onları atlar, tuzak
 * yok, bölümden çıkılır. Scroll (Space/PageDown/ok) pin'i ilerletir.
 */
const VISUALS = [
  // 01 Analiz — ızgara üzerinde büyüteç
  <g key="0" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 12h40M12 28h40M12 44h40M20 6v48M36 6v48" opacity="0.35" />
    <circle cx="34" cy="30" r="12" />
    <path d="M43 39l9 9" strokeLinecap="round" />
  </g>,
  // 02 Yapılandırma — birleşen bloklar
  <g key="1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <rect x="8" y="30" width="18" height="18" />
    <rect x="30" y="20" width="18" height="18" fill="currentColor" opacity="0.15" />
    <path d="M20 30l10-10M26 40h4" strokeLinecap="round" />
  </g>,
  // 03 Sürekli takip — nabız çizgisi
  <g key="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M6 32h12l6-14 8 26 6-16h20" />
    <circle cx="52" cy="28" r="3" fill="currentColor" />
  </g>,
];

export function PinnedCapabilities() {
  const rootRef = useRef<HTMLElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver !== 'function') return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          setEnhanced(true);
        }
      },
      { rootMargin: '300px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!enhanced) return;
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;
    let kill: (() => void) | undefined;
    void (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (cancelled) return;
      const pin = el.querySelector<HTMLElement>('[data-pin]');
      const bar = el.querySelector<HTMLElement>('[data-bar]');
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: '+=260%',
        pin: pin ?? true,
        scrub: true,
        onUpdate: (self) => {
          if (bar) bar.style.setProperty('--pin-progress', String(self.progress));
          setActive(
            Math.min(
              capabilitySteps.length - 1,
              Math.floor(self.progress * capabilitySteps.length),
            ),
          );
        },
      });
      gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
      kill = () => trigger.kill();
    })();
    return () => {
      cancelled = true;
      kill?.();
    };
  }, [enhanced]);

  const heading = (
    <header className="max-w-2xl">
      <p className="basis-ref uppercase">Temel yetenekler</p>
      <h2 className="mt-2 text-[length:var(--text-3xl)] text-[var(--color-text)] sm:text-[length:var(--text-4xl)]">
        Analizden sürekli takibe
      </h2>
    </header>
  );

  if (!enhanced) {
    return (
      <section
        ref={rootRef}
        aria-labelledby="yetenekler-title"
        className="relative isolate overflow-hidden py-[var(--spacing-section)]"
      >
        <div className="mx-auto max-w-6xl px-5">
          <div id="yetenekler-title">{heading}</div>
          <ol className="mt-12 space-y-16">
            {capabilitySteps.map((s, i) => (
              <li key={s.n} className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-[length:var(--text-4xl)] text-[var(--color-accent)]">
                    {s.n}
                  </p>
                  <h3 className="mt-2 text-[length:var(--text-xl)] text-[var(--color-text)]">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                    {s.body}
                  </p>
                </div>
                <div className="card surface-glow flex aspect-[4/3] items-center justify-center p-8">
                  <svg
                    viewBox="0 0 60 60"
                    aria-hidden="true"
                    className="h-28 w-28 text-[var(--color-accent)]"
                  >
                    {VISUALS[i]}
                  </svg>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      aria-labelledby="yetenekler-title"
      className="relative isolate overflow-hidden"
    >
      <SceneRegion tone={0.55} density={0.62} depth={0.62} flow={0.55} />
      <div
        data-pin
        className="flex min-h-screen flex-col justify-center py-[var(--spacing-section)]"
      >
        <div className="mx-auto w-full max-w-6xl px-5">
          <div id="yetenekler-title">{heading}</div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="relative min-h-[220px]">
              {capabilitySteps.map((s, i) => (
                <div
                  key={s.n}
                  inert={i !== active}
                  className="absolute inset-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ opacity: i === active ? 1 : 0 }}
                >
                  <p className="font-[family-name:var(--font-display)] text-[length:var(--text-5xl)] text-[var(--color-accent)] tabular-nums">
                    {s.n}
                  </p>
                  <h3 className="mt-2 text-[length:var(--text-xl)] text-[var(--color-text)]">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative aspect-[4/3] w-full">
              {capabilitySteps.map((s, i) => (
                <div
                  key={s.n}
                  aria-hidden="true"
                  className="card surface-glow absolute inset-0 flex items-center justify-center p-8 transition-opacity duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ opacity: i === active ? 1 : 0 }}
                >
                  <svg
                    viewBox="0 0 60 60"
                    aria-hidden="true"
                    className="h-32 w-32 text-[var(--color-accent)]"
                  >
                    {VISUALS[i]}
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div
            data-bar
            className="pin-progress mt-10 h-px w-full bg-[var(--color-rule)]"
            aria-hidden="true"
          >
            <span className="block h-full bg-[var(--color-accent)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
