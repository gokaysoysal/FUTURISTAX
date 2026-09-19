'use client';

import { springConfig } from '@/lib/motion';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';

/**
 * Manyetik hover — birincil eylemler imlece hafifçe yaklaşır, ayrılınca
 * yayla geri döner. Sarmalayıcı bir `motion.span`'dır; içindeki gerçek
 * <button>/<a> dokunulmaz kalır (klavye odağı, semantik etkilenmez).
 *
 * Kapalı olduğu durumlar (düz passthrough):
 *  - prefers-reduced-motion: reduce
 *  - kaba işaretçi (dokunmatik) — `(pointer: coarse)`, mount sonrası tespit
 *    (hidrasyon uyuşmazlığını önlemek için sunucuyla aynı başlangıç).
 *
 * Yalnızca `transform: translate` — layout tetiklemez.
 */
export function MagneticButton({
  children,
  strength = 0.25,
  max = 8,
  className,
}: {
  children: ReactNode;
  strength?: number;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [coarse, setCoarse] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springConfig.gentle);
  const sy = useSpring(y, springConfig.gentle);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(pointer: coarse)');
    const sync = () => setCoarse(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (reduce || coarse) {
    return <span className={className}>{children}</span>;
  }

  const clamp = (n: number) => Math.max(-max, Math.min(max, n));

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: 'inline-flex', willChange: 'transform' }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set(clamp((e.clientX - (r.left + r.width / 2)) * strength));
        y.set(clamp((e.clientY - (r.top + r.height / 2)) * strength));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
