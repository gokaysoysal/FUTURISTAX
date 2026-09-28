'use client';

import { fadeUp, staggerContainer, staggerItem, viewportOnce } from '@/lib/motion';
import { motion, useReducedMotion } from 'motion/react';
import { type ReactNode, useEffect, useState } from 'react';

/**
 * Güvenlik ağı (V12 Bölüm 6 hata avı): `whileInView`'in
 * `IntersectionObserver`'ı bir sebeple (nadir tarayıcı/zamanlama tuhaflığı,
 * çok hızlı programatik scroll vb.) hiç tetiklenmezse içerik `opacity:0`'da
 * KALICI olarak takılı kalıyordu — kart "boş" görünüyordu (referans hata:
 * ana sayfa Cenk Yavuz referans kartı). İçerik animasyondan bağımsız HER
 * ZAMAN görünür olmalı; bu yüzden kısa bir süre sonra `animate="shown"`
 * zorla devreye girer. Başarı yolunda (normal durum) `animate` `undefined`
 * kalır, `whileInView` her zamanki gibi sürer — davranış değişmez.
 */
function useRevealFallback(timeoutMs = 1500): boolean {
  const [forced, setForced] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setForced(true), timeoutMs);
    return () => clearTimeout(t);
  }, [timeoutMs]);
  return forced;
}

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
  const forced = useRevealFallback();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="shown"
      animate={forced ? 'shown' : undefined}
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
  const forced = useRevealFallback();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="shown"
      animate={forced ? 'shown' : undefined}
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
  const forced = useRevealFallback();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem} animate={forced ? 'shown' : undefined}>
      {children}
    </motion.div>
  );
}
