'use client';

/**
 * Scroll koreografisi — merkezî yapılandırma.
 *
 * STACK AYRIMI (bkz. config.ts): GSAP + ScrollTrigger YALNIZCA scroll'a bağlı
 * sahne koreografisi (pin, yatay scroll, timeline sekansları). Bileşen içi
 * mikro etkileşim Framer Motion'da kalır. Aynı öğeyi ikisiyle animasyon etme.
 *
 * prefers-reduced-motion: reduce → hiçbir ScrollTrigger animasyonu OYNAMAZ;
 * öğeler anında son hâline atlar, pin'ler kurulmaz.
 *
 * GSAP artık STATİK import edilmez — `@/lib/motion/gsap-lazy` üzerinden
 * `import()` ile ayrı chunk. Bu dosya yalnızca yapılandırma taşır.
 */

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Ortak ScrollTrigger easing/scrub değerleri. */
export const scrollConfig = {
  scrub: 0.6,
  ease: 'power2.out',
  start: 'top 80%',
  pinEnd: '+=120%',
} as const;
