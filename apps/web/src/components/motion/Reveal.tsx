'use client';

import { type Variants, motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Scroll reveal + sayfa yüklenme koreografisi.
 *
 * prefers-reduced-motion altında TAMAMEN kapalı: hareket tercihi kapalıysa
 * içerik hiçbir dönüşüm/geçiş olmadan doğrudan render edilir (Motion CSS
 * geçişi değil JS animasyonu kullandığı için bu guard şart).
 *
 * `once: true` — bir kez görününce sabit kalır; kaydırdıkça yanıp sönmez.
 */
const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.42, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.36, ease: EASE } },
};

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
      variants={listVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
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
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
