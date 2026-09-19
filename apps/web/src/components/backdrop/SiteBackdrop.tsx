'use client';

import { hasWebGL } from '@/lib/webgl';
import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { SiteBackdropFallback } from './SiteBackdropFallback';

/**
 * Site geneli arka plan — KARAR KATMANI (V5 Bölüm 2).
 *
 * `[locale]/layout.tsx`'te bir kez render edilir; rota değişiminde layout
 * kalıcı olduğu için REMOUNT OLMAZ. Sabit `fixed inset-0 -z-10` sarmalayıcı
 * her zaman DOM'da (layout kaymaz); yalnızca içi değişir:
 *
 *   canlı sahne  ⟺  masaüstü (≥768px) + WebGL + reduced-motion yok + cihaz
 *                   düşük performanslı değil
 *   statik yedek ⟺  aksi hâlde (Bölüm 6)
 *
 * Sahne `dynamic(ssr:false)` — three/R3F ilk yük JS'ine girmez.
 */
const SiteBackdropScene = dynamic(() => import('./SiteBackdropScene'), {
  ssr: false,
  loading: () => <SiteBackdropFallback />,
});

/** Kaba bir düşük-performans sezgisi — çekirdek sayısı / RAM. */
function isLowPerfDevice(): boolean {
  const cores = navigator.hardwareConcurrency;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof cores === 'number' && cores > 0 && cores <= 4) return true;
  if (typeof mem === 'number' && mem > 0 && mem <= 4) return true;
  return false;
}

export function SiteBackdrop() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<'scene' | 'fallback'>('fallback');
  const [complexity, setComplexity] = useState(1);

  useEffect(() => {
    if (reduce) {
      setMode('fallback');
      return;
    }
    let frame = 0;
    const decide = () => {
      const wide = window.innerWidth >= 768;
      setComplexity(window.innerWidth < 768 ? 0.5 : 1);
      setMode(wide && hasWebGL() && !isLowPerfDevice() ? 'scene' : 'fallback');
    };
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(decide);
    };
    decide();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
    };
  }, [reduce]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {mode === 'scene' ? <SiteBackdropScene complexity={complexity} /> : <SiteBackdropFallback />}
    </div>
  );
}
