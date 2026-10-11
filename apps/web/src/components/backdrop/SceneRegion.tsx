'use client';

import type { SceneParams } from '@/lib/motion/backdrop-scene';
import { registerRegion, setRegionWeight, unregisterRegion } from '@/lib/motion/backdrop-scene';
import { useEffect, useRef } from 'react';

/**
 * Bir sayfa bölümünün arka plan sahnesine hedef parametre kaydı (V5 Bölüm 2).
 *
 * Görünmez işaretçi (`<span>`, sıfır kutu). Bölümün içine konur; kendi
 * görünürlüğünü `IntersectionObserver` ile ölçer ve ağırlık olarak sahneye
 * bildirir. Aktif bölümlerin ağırlıklı ortalaması sahnenin hedefidir; geçiş
 * sönümlü lerp ile (`backdrop-scene.ts`).
 *
 * İmza sayfası (ana sayfa) bölümleri bunu kullanır; diğer rotalar hiç
 * kaydetmez → sahne yalnızca scroll ilerlemesinden yumuşak sürüklenir.
 */
export function SceneRegion(params: Partial<SceneParams>) {
  const ref = useRef<HTMLSpanElement>(null);
  const { tone, density, depth, flow } = params;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const key = registerRegion({ tone, density, depth, flow });

    if (typeof IntersectionObserver !== 'function') {
      setRegionWeight(key, 1);
      return () => unregisterRegion(key);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Bölüm viewport ortasına yaklaştıkça ağırlık artar.
          setRegionWeight(key, e.isIntersecting ? e.intersectionRatio : 0);
        }
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1], rootMargin: '-20% 0px -20% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      unregisterRegion(key);
    };
  }, [tone, density, depth, flow]);

  // `absolute` + sıfır kutu: hiçbir akış/flex/grid düzenini etkilemez.
  return <span ref={ref} aria-hidden="true" className="pointer-events-none absolute h-0 w-0" />;
}
