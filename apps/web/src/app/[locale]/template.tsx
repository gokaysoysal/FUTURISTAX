'use client';

import { duration, ease } from '@/lib/motion';
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useRef } from 'react';

/**
 * Sayfa geçişi — rota değiştiğinde akışkan giriş.
 *
 * İLK sert yüklemede animasyon YOK: içerik anında görünür, LCP gecikmez.
 * Yalnızca istemci-taraflı rota değişimlerinde çalışır (modül bayrağı).
 * prefers-reduced-motion: tamamen kapalı.
 *
 * Not: Next App Router'da `template.tsx` her gezinmede yeniden kurulur;
 * exit animasyonu için ayrı bir AnimatePresence katmanı gerekir — içeriğe
 * erişimi geciktirmemek için bilinçli olarak yalnızca giriş yapıyoruz.
 */
let navigatedOnce = false;

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const isFirst = useRef(!navigatedOnce);
  if (isFirst.current) navigatedOnce = true;

  if (reduce || isFirst.current) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
