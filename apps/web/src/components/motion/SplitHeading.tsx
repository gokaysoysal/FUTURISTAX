'use client';

import { prefersReducedMotion, registerScroll } from '@/lib/motion/scroll';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import SplitType from 'split-type';

/**
 * Başlık animasyonu — split-type ile harf bazında kademeli scroll girişi.
 *
 * TÜRKÇE GLİF KONTROLÜ: bölme sonrası düz metin orijinaliyle karşılaştırılır
 * (boşluklar hariç). Bir karakter düşerse (ör. ı/İ/ğ) split geri alınır ve
 * animasyon yapılmaz — metin bozulmadan durur.
 *
 * reduced-motion: hiç bölünmez, düz başlık render edilir.
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

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const originalText = (el.textContent ?? '').replace(/\s+/g, '');
      const split = new SplitType(el, { types: 'words,chars', tagName: 'span' });

      if ((el.textContent ?? '').replace(/\s+/g, '') !== originalText) {
        split.revert();
        return;
      }

      registerScroll();
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(split.chars, {
        autoAlpha: 0,
        yPercent: 55,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.012,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      });

      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
