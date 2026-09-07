'use client';

import { hasWebGL } from '@/lib/webgl';
import { useReducedMotion } from 'motion/react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { HeroFallback } from './HeroFallback';

/**
 * Hero arka planı — karar katmanı. Metin SSR ile gelir (bkz. Hero'yu kullanan
 * sunucu bileşeni); bu istemci adası sahneyi progressive olarak üstüne bindirir.
 *
 * Sahne YALNIZCA şu koşulda: masaüstü (>= 768px) + WebGL var +
 * prefers-reduced-motion yok. Aksi hâlde statik HeroFallback.
 * Sahne `dynamic(ssr:false)` — ilk yüklemeyi bloklamaz, yüklenirken fallback.
 */
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function HeroCanvas() {
  const reduce = useReducedMotion();
  const [scene, setScene] = useState(false);

  useEffect(() => {
    if (reduce) {
      setScene(false);
      return;
    }
    const decide = () => setScene(window.innerWidth >= 768 && hasWebGL());
    decide();
    window.addEventListener('resize', decide, { passive: true });
    return () => window.removeEventListener('resize', decide);
  }, [reduce]);

  return scene ? <HeroScene /> : <HeroFallback />;
}
