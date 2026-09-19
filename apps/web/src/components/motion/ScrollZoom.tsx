'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { type ReactNode, useRef } from 'react';

/**
 * Scroll ilerledikçe ölçeklenme — görseller ve kartlar viewport'a
 * girerken hafifçe büyür. Yalnızca `transform: scale` + opacity.
 *
 * prefers-reduced-motion: sabit, tam ölçekte.
 *
 * @param from  Başlangıç ölçeği (varsayılan 0.92).
 */
export function ScrollZoom({
  children,
  from = 0.92,
  className,
}: {
  children: ReactNode;
  from?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.4'],
  });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [from, 1]), {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.55, 1]);

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
      style={{ scale, opacity, willChange: 'transform, opacity', transformOrigin: 'center' }}
    >
      {children}
    </motion.div>
  );
}
