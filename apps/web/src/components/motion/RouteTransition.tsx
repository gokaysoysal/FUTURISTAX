'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Sayfa geçişi — rota değişiminde perde/maske.
 *
 * Layout'ta BİR KEZ mount edilir (template.tsx gibi rota başına yeniden
 * kurulmaz), böylece "ilk yükte oynama" bayrağı güvenilir. İlk sert yüklemede
 * perde YOK — LCP gecikmez. Sonraki istemci gezinmelerinde canvas renkli bir
 * panel yukarı doğru açılır.
 *
 * Perde İÇERİĞE DOKUNMAZ: ayrı `position: fixed`, `pointer-events: none` katman;
 * yeni sayfa altta zaten render'lı. reduced-motion → hiç render edilmez.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const firstRef = useRef(true);
  const isFirst = firstRef.current;

  useEffect(() => {
    firstRef.current = false;
  }, []);

  if (reduce) return null;

  return (
    <AnimatePresence mode="wait">
      {!isFirst && (
        <motion.div
          key={pathname}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[70] bg-[var(--color-canvas)]"
          style={{ transformOrigin: 'top' }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
