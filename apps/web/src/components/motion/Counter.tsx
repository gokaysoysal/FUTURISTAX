'use client';

import { duration as D, ease } from '@/lib/motion';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  /** Hedef sayısal değer. */
  value: number;
  /** Görüntüleme biçimi (varsayılan: tr-TR gruplandırma, tam sayı). */
  format?: (n: number) => string;
  /** Saniye. */
  duration?: number;
  className?: string;
};

const defaultFormat = (n: number) =>
  new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(Math.round(n));

/**
 * İstatistik / hesaplama sonucu sayaç animasyonu.
 *
 * - `tabular-nums` korunur.
 * - LAYOUT KAYMAZ: görünmez bir kopya (nihai değer) genişliği sabitler;
 *   animasyonlu değer üstte absolute konumlanır.
 * - Ekran okuyucu nihai değeri okur (`aria-label`); animasyon `aria-hidden`.
 * - prefers-reduced-motion: anında nihai değer, animasyon yok.
 * - Görünür alana girene kadar başlamaz; bir kez çalışır.
 */
export function Counter({ value, format = defaultFormat, duration = D.count, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? value : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: ease.out,
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  const final = format(value);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={final}
      style={{ position: 'relative', display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}
    >
      <span aria-hidden="true" style={{ visibility: 'hidden' }}>
        {final}
      </span>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        {format(display)}
      </span>
    </span>
  );
}
