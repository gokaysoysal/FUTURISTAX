'use client';

import { loadGsap, loadSplitType } from '@/lib/motion/gsap-lazy';
import { prefersReducedMotion } from '@/lib/motion/scroll';
import { scrollConfig } from '@/lib/motion/scroll';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

/**
 * Başlık animasyonu — split-type ile kademeli scroll girişi.
 *
 * `by="words"` (V4-AKIS hero): kelime kelime. `by="chars"` (varsayılan): harf.
 *
 * NOT (V5 Bölüm 1): `by="words"` artık YALNIZCA `words` böler — `lines` bırakıldı.
 * split-type her görsel satırı `overflow: hidden` bir `<div>`e sarıp genişliğini
 * o anki ölçümle donduruyordu; web fontu geç yüklendiğinde ya da genişlik
 * geçişte farklıyken bu, başlığı soldan kırpıyordu ("...ergiyi yönetile...").
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
  by = 'chars',
  id,
  children,
  className,
}: {
  as?: 'h1' | 'h2' | 'h3';
  by?: 'words' | 'chars';
  id?: string;
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

      const split = new SplitType(el, {
        types: by === 'words' ? 'words' : 'words,chars',
        tagName: 'span',
      });
      if ((el.textContent ?? '').replace(/\s+/g, '') !== original) {
        split.revert();
        return;
      }

      const targets = by === 'words' ? split.words : split.chars;
      if (!targets || targets.length === 0) {
        split.revert();
        return;
      }

      gsap.set(el, { autoAlpha: 1 });
      const tween = gsap.from(targets, {
        autoAlpha: 0,
        yPercent: by === 'words' ? 110 : 55,
        duration: scrollConfig.durBase,
        ease: scrollConfig.ease,
        stagger: by === 'words' ? scrollConfig.stagger : 0.012,
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
  }, [by]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
