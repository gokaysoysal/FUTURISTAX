import type { Variants } from 'motion/react';
import { distance, duration, ease, stagger } from './config';

/**
 * Yeniden kullanılabilir Motion varyantları. Tümü transform/opacity.
 * reduced-motion guard'ı bunları kullanan bileşende yapılır (varyant
 * seviyesinde değil) — kapalıyken bileşen düz <div> döndürür.
 *
 * V4-AKIS Bölüm 1: TEK reveal deseni — 24px alttan + opaklık, `ease.out`,
 * `duration.base`. Farklı yön/mesafe/easing yok.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: distance.revealShift },
  shown: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
};

/** Kademeli grup — çocuklar `staggerItem` ile sarılır. */
export const staggerContainer: Variants = {
  hidden: {},
  shown: {
    transition: { staggerChildren: stagger.step, delayChildren: stagger.groupDelay },
  },
};

/** Grup öğesi — `fadeUp` ile AYNI yön/mesafe/süre (tek desen). */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: distance.revealShift },
  shown: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
};
