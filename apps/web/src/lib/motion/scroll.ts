'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll koreografisi — merkezî yapılandırma.
 *
 * STACK AYRIMI (bkz. config.ts): GSAP + ScrollTrigger YALNIZCA scroll'a bağlı
 * sahne koreografisi (pin, yatay scroll, timeline sekansları). Bileşen içi
 * mikro etkileşim Framer Motion'da kalır. Aynı öğeyi ikisiyle animasyon etme.
 *
 * prefers-reduced-motion: reduce → hiçbir ScrollTrigger animasyonu OYNAMAZ;
 * öğeler anında son hâline atlar, pin'ler kurulmaz. `withReducedMotion` bunu
 * her yardımcıya uygular.
 */

let registered = false;

export function registerScroll(): typeof ScrollTrigger {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return ScrollTrigger;
}

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

/**
 * Bir öğeyi scroll ile ortaya çıkarır (opaklık + kayma + hafif ölçek).
 * reduced-motion: hiç kurulmaz — öğe zaten CSS'te görünür olmalı.
 */
export function revealOnScroll(
  target: gsap.TweenTarget,
  opts: { y?: number; stagger?: number } = {},
): ScrollTrigger | undefined {
  if (prefersReducedMotion()) return undefined;
  registerScroll();
  const tween = gsap.from(target, {
    autoAlpha: 0,
    y: opts.y ?? 24,
    duration: 0.8,
    ease: scrollConfig.ease,
    stagger: opts.stagger ?? 0,
    scrollTrigger: {
      trigger: target as gsap.DOMTarget,
      start: scrollConfig.start,
      once: true,
    },
  });
  return tween.scrollTrigger;
}
