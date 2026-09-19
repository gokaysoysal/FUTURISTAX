'use client';

import { type RefObject, useEffect, useState } from 'react';

/**
 * Bir öğe görünüre YAKLAŞINCA `true` döner (tek yön, geri dönmez).
 *
 * Ağır bağımlılıkları (GSAP, Recharts, Lottie) yalnızca gerekince yüklemek
 * için: `rootMargin` ile öğe ekrana girmeden biraz önce tetiklenir, böylece
 * kullanıcı oraya vardığında içerik hazırdır. `IntersectionObserver` yoksa
 * (çok eski tarayıcı) hemen `true` — kademeli düşüş.
 */
export function useNearViewport(ref: RefObject<Element | null>, rootMargin = '256px'): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver !== 'function') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, near]);

  return near;
}
