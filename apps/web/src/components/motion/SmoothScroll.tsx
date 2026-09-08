'use client';

import { setScrollProgress } from '@/lib/motion/backdrop-scene';
import { loadGsap } from '@/lib/motion/gsap-lazy';
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
 * V5 Bölüm 2: Lenis scroll ilerlemesi (0..1) kalıcı arka plan sahnesine
 * beslenir (`backdrop-scene.ts`). Sahne kendi rAF'ından okur — scroll'un
 * tek doğruluk kaynağı Lenis.
 *
 * PERFORMANS: `lenis` ve `gsap` STATİK import EDİLMEZ — layout bileşeni olduğu
 * için her sayfanın ilk yük JS'ine girerdi. `import()` ile ayrı chunk; mount
 * sonrası bir tik geç başlar (fark edilmez). reduced-motion'da hiç yüklenmez.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    void (async () => {
      const [{ gsap, ScrollTrigger }, { default: Lenis }] = await Promise.all([
        loadGsap(),
        import('lenis'),
      ]);
      if (cancelled) return;

      // V4-AKIS Bölüm 1: lerp ~0.1 (referans hissi). `duration`/`easing` yerine.
      const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        touchMultiplier: 1.4,
      });

      lenis.on('scroll', ScrollTrigger.update);
      lenis.on('scroll', () => setScrollProgress(lenis.progress));
      setScrollProgress(lenis.progress);

      const onTick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      document.documentElement.setAttribute('data-lenis', 'on');

      teardown = () => {
        gsap.ticker.remove(onTick);
        lenis.destroy();
        document.documentElement.removeAttribute('data-lenis');
      };
    })();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [reduce]);

  return null;
}
