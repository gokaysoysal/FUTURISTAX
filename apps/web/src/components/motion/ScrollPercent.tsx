'use client';

import { useEffect, useState } from 'react';

/**
 * Sağ altta scroll ilerleme yüzdesi (V4-AKIS Bölüm 2 #11 / Bölüm 4).
 *
 * Konum göstergesi — dekoratif hareket değil; reduced-motion'da da kalır ama
 * `aria-hidden` (ekran okuyucu için anlamsız). Yalnızca `rAF` + metin; layout
 * kaymaz (sabit genişlik, `tabular-nums`).
 */
export function ScrollPercent() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setPct(max > 0 ? Math.round((doc.scrollTop / max) * 100) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="glass pointer-events-none fixed bottom-4 right-4 z-40 hidden select-none rounded-full border border-[var(--color-rule)] px-3 py-1 font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] tabular-nums text-[var(--color-text-secondary)] sm:block"
    >
      {String(pct).padStart(2, '0')}%
    </div>
  );
}
