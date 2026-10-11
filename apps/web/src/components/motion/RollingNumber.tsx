'use client';

import { duration as D, ease } from '@/lib/motion';
import { animate, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  /** Hedef değer. Her değişimde yeniden sayar (Counter'dan farkı: `once` yok). */
  value: number;
  /** Görüntüleme biçimi. */
  format: (n: number) => string;
  /** Saniye. */
  duration?: number;
  className?: string;
};

/**
 * Sonuç değiştikçe yeniden çalışan sayaç — hesaplayıcı çıktısı için.
 *
 * `Counter` bir kez (görünüre girince) çalışır; bu bileşen her `value`
 * değişiminde önceki değerden yenisine animasyon yapar. Hesaplayıcıda kullanıcı
 * girdi değiştirdikçe sonuç akışkan güncellenir.
 *
 * - `tabular-nums` korunur; LAYOUT KAYMAZ (görünmez nihai kopya genişliği sabitler).
 * - Ekran okuyucu yalnızca nihai değeri okur (`aria-label`), ara kareler `aria-hidden`.
 * - prefers-reduced-motion: animasyon yok, anında nihai değer.
 */
export function RollingNumber({ value, format, duration = D.count, className }: Props) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) {
      prev.current = value;
      setDisplay(value);
      return;
    }
    if (prev.current === value) return;
    const from = prev.current;
    prev.current = value;
    const controls = animate(from, value, {
      duration,
      ease: ease.out,
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [value, duration, reduce]);

  const final = format(value);

  return (
    <span
      className={className}
      style={{ position: 'relative', display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}
    >
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" style={{ visibility: 'hidden' }}>
        {final}
      </span>
      <span aria-hidden="true" style={{ position: 'absolute', inset: 0, whiteSpace: 'nowrap' }}>
        {format(display)}
      </span>
    </span>
  );
}
