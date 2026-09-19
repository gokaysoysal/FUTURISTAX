'use client';

import { distance, ease } from '@/lib/motion';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { type ReactNode, useRef } from 'react';

/**
 * Katmanlı derinlik — element viewport'tan geçerken dikey olarak
 * yavaşça kayar (parallax). Hero ve bölüm arka planlarında.
 *
 * prefers-reduced-motion: hareket yok, düz kapsayıcı döner.
 * Yalnızca `transform: translateY` — layout tetiklemez.
 *
 * @param speed  -1..1 arası. Pozitif = yavaş (geride), negatif = hızlı (önde).
 */
export function Parallax({
  children,
  speed = 0.2,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const range = distance.parallax * speed;
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [range, -range]), {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, willChange: 'transform' }}
      transition={{ ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
