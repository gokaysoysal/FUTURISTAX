import type { Variants } from 'motion/react';
import { distance, duration, ease, stagger } from './config';

/**
 * Yeniden kullanılabilir Motion varyantları. Tümü transform/opacity.
 * reduced-motion guard'ı bunları kullanan bileşende yapılır (varyant
 * seviyesinde değil) — kapalıyken bileşen düz <div> döndürür.
 */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: distance.md },
  shown: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  shown: { opacity: 1, scale: 1, transition: { duration: duration.base, ease: ease.out } },
};

/** Kademeli grup — çocuklar `staggerItem` ile sarılır. */
export const staggerContainer: Variants = {
  hidden: {},
  shown: {
    transition: { staggerChildren: stagger.step, delayChildren: stagger.groupDelay },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: distance.sm },
  shown: { opacity: 1, y: 0, transition: { duration: duration.fast, ease: ease.out } },
};
