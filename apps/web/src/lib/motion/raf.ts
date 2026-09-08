'use client';

/**
 * TEK paylaşımlı requestAnimationFrame döngüsü (V5 Bölüm 2 — performans).
 *
 * Site genelinde kalıcı arka plan sahnesi bunun üzerinden döner; her bileşen
 * kendi rAF'ını açmaz. Lenis kendi akışkan-scroll tick'ini (gsap.ticker)
 * sürdürür ama sahne buradan beslenir — sahne için tek döngü.
 *
 * - İlk aboneyle başlar, son abone gidince durur.
 * - `document.hidden` iken duraklar (sekme arka planda → render yok);
 *   görünür olunca `last` sıfırlanır (dt sıçraması olmaz).
 * - dt saniye cinsinden ve 50ms'ye kırpılır (uzun duraklama sonrası patlama yok).
 */

type FrameFn = (dtSeconds: number) => void;

const subscribers = new Set<FrameFn>();
let rafId = 0;
let last = 0;

function loop(now: number): void {
  rafId = requestAnimationFrame(loop);
  if (last === 0) last = now;
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  for (const fn of subscribers) {
    try {
      fn(dt);
    } catch {
      /* bir abonenin hatası döngüyü düşürmesin */
    }
  }
}

function start(): void {
  if (rafId || typeof requestAnimationFrame !== 'function') return;
  if (typeof document !== 'undefined' && document.hidden) return;
  last = 0;
  rafId = requestAnimationFrame(loop);
}

function stop(): void {
  if (!rafId) return;
  cancelAnimationFrame(rafId);
  rafId = 0;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else if (subscribers.size > 0) {
      start();
    }
  });
}

/** Döngüye katıl. Dönen fonksiyon aboneliği bırakır (ve gerekiyorsa döngüyü durdurur). */
export function subscribeFrame(fn: FrameFn): () => void {
  subscribers.add(fn);
  start();
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) stop();
  };
}
