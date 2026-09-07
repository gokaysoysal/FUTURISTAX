'use client';

import { loadGsap, loadSplitType } from '@/lib/motion/gsap-lazy';
import { prefersReducedMotion } from '@/lib/motion/scroll';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

/**
 * Başlık animasyonu — split-type ile harf bazında kademeli scroll girişi.
 *
 * TÜRKÇE GLİF KONTROLÜ: bölme sonrası düz metin orijinaliyle karşılaştırılır
 * (boşluklar hariç). Bir karakter düşerse (ör. ı/İ/ğ) split geri alınır ve
 * animasyon yapılmaz — metin bozulmadan durur.
 *
 * PERFORMANS: GSAP + split-type STATİK import EDİLMEZ. `IntersectionObserver`
 * başlık görünüre yaklaşınca kütüphaneleri `import()` ile getirir. Başlık metni
 * SSR'de tam ve görünür; animasyon yalnızca üstüne biner.
 *
 * reduced-motion: hiç bölünmez, hiçbir şey yüklenmez — düz başlık.
 */
export function SplitHeading({
  as: Tag = 'h2',
  children,
  className,
}: {
  as?: 'h1' | 'h2' | 'h3';
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (typeof IntersectionObserver !== 'function') return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const run = async () => {
      const original = (el.textContent ?? '').replace(/\s+/g, '');
      const [{ gsap }, SplitType] = await Promise.all([loadGsap(), loadSplitType()]);
      if (cancelled) return;

      const split = new SplitType(el, { types: 'words,chars', tagName: 'span' });
      if ((el.textContent ?? '').replace(/\s+/g, '') !== original) {
        split.revert();
        return;
      }

      gsap.set(el, { autoAlpha: 1 });
      const tween = gsap.from(split.chars, {
        autoAlpha: 0,
        yPercent: 55,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.012,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      };
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        void run();
      },
      { rootMargin: '128px' },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
