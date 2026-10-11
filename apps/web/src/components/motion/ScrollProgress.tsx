'use client';

import { motion, useScroll } from 'motion/react';

/**
 * Sayfa üstü scroll ilerleme çubuğu — ince, `transform: scaleX` ile.
 * Konum göstergesi olduğu için reduced-motion'da da kalır (dekoratif hareket
 * değil); yay yok, doğrudan scroll ilerlemesini yansıtır.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[var(--color-accent)]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
