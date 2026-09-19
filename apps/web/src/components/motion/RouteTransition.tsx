'use client';

import { ease } from '@/lib/motion';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * Sayfa geçişi — rota değişiminde perde (V4-AKIS Bölüm 5).
 *
 * Mevcut sayfa perde ile maskelenir; perde yukarı çekilerek yeni sayfa
 * ALTTAN açılır. Perdenin üstünde yeni sayfanın başlığı KISA süre görünür.
 *
 * - Toplam ≤ 400ms (perde çekilme 320ms + başlık 120ms fade).
 * - Layout'ta BİR KEZ mount → "ilk yük" bayrağı güvenilir; ilk sert yüklemede
 *   perde YOK (LCP gecikmez). Perde ayrı `position: fixed` katman,
 *   `pointer-events: none`; yeni sayfa altta zaten render'lı.
 * - `prefers-reduced-motion` → hiç render edilmez.
 *
 * NOT: `document.startViewTransition` (View Transitions API) tarayıcıda varsa,
 * Next kararlı desteğe geçince `<Link>` gezinmeleri ona devredilir; bu perde
 * o zaman markalı bir katman olarak kalır. Şimdilik Motion yedeği.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const firstRef = useRef(true);
  const [title, setTitle] = useState('');

  // biome-ignore lint/correctness/useExhaustiveDependencies: `pathname` bilerek dep — rota değişiminde yeniden çalışması gerekiyor.
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    // Yeni belge başlığı bir tik sonra güncellenir; kısa gecikmeyle oku.
    const id = window.setTimeout(() => {
      const raw = document.title.split('·')[0]?.trim();
      setTitle(raw || document.title);
    }, 30);
    return () => window.clearTimeout(id);
  }, [pathname]);

  if (reduce || firstRef.current) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-[var(--color-canvas)]"
        style={{ transformOrigin: 'top' }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.32, ease: ease.inOut }}
      >
        <motion.span
          className="font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] text-[var(--color-text-secondary)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.32, times: [0, 0.4, 1], ease: 'linear' }}
        >
          {title}
        </motion.span>
      </motion.div>
    </AnimatePresence>
  );
}
