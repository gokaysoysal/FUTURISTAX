'use client';

import { registerScroll } from '@/lib/motion/scroll';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { useReducedMotion } from 'motion/react';
import { useEffect } from 'react';

/**
 * Akışkan scroll — Lenis. Yan etkili bileşen (çocuk sarmalamaz); window
 * scroll'unu hijack eder, layout'ta bir kez render edilir.
 *
 * KURAL: prefers-reduced-motion: reduce altında Lenis HİÇ başlatılmaz; native
 * scroll'a bırakılır. Aksi hâlde Lenis'in rAF'ı GSAP ticker'ına, scroll olayı
 * ScrollTrigger.update'e bağlanır (tek zamanlayıcı, senkron).
 *
 * `data-lenis="on"` kancası ile CSS gerektiğinde hedeflenebilir.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const ScrollTrigger = registerScroll();
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    document.documentElement.setAttribute('data-lenis', 'on');

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      document.documentElement.removeAttribute('data-lenis');
    };
  }, [reduce]);

  return null;
}
