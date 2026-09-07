'use client';

import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Scroll reveal + yüklenme koreografisi. Merkezî varyantları
 * (`@/lib/motion`) kullanır.
 *
 * prefers-reduced-motion altında TAMAMEN kapalı: içerik hiçbir
 * dönüşüm/geçiş olmadan doğrudan render edilir.
 *
 * `once: true` — bir kez görününce sabit kalır.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="shown"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Bir grup öğeyi kademeli (staggered) ortaya çıkarır. Kart ızgaraları için.
 * Çocuklar `<RevealItem>` ile sarılmalıdır.
 */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="shown"
      viewport={viewportOnce}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
