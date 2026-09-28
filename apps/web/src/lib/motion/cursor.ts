'use client';

/**
 * İkincil, imleç-duyarlı katman (V10).
 *
 * Kalıcı arka plan sahnesinin scroll'a bağlı ANA hareketinin (`backdrop-scene.ts`)
 * üstüne binen hafif bir "manyetik çekim" hissi — sahne imlece doğru bükülür.
 * Scroll'un sürdüğü hareketi EZMEZ, yalnızca ince bir ikincil katmandır.
 *
 * - Yalnızca gerçek mouse'ta çalışır (`pointer: fine`): dokunmatik-yalnızca
 *   cihazlarda hiç abone olunmaz, katman etkisiz kalır (hedef hep 0,0).
 * - Damped lerp (`backdrop-scene.ts`'teki AYNI sönümleme deseni, kare
 *   hızından bağımsız) — imleç ani sıçradığında sahne sıçramaz.
 * - `prefers-reduced-motion` altında `SiteBackdropScene` bu modülü hiç
 *   çağırmaz (bkz. çağıran taraftaki `reduce` kontrolü) — burada ayrıca bir
 *   kontrol gerekmez.
 */

const DAMP_RATE = 4;

let targetX = 0;
let targetY = 0;
const current = { x: 0, y: 0 };
let active = false;

function onPointerMove(e: PointerEvent): void {
  if (e.pointerType !== 'mouse') return;
  targetX = (e.clientX / window.innerWidth) * 2 - 1;
  targetY = (e.clientY / window.innerHeight) * 2 - 1;
}

function onPointerLeave(): void {
  targetX = 0;
  targetY = 0;
}

/** Mouse varsa izlemeyi başlatır; dönen fonksiyon aboneliği bırakır. */
export function startCursorTracking(): () => void {
  if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
    return () => {};
  }
  active = true;
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  return () => {
    active = false;
    targetX = 0;
    targetY = 0;
    current.x = 0;
    current.y = 0;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerleave', onPointerLeave);
  };
}

/** Kare adımı — hedefe doğru sönümlü ilerle. Mouse yoksa no-op (hedef 0'da kalır). */
export function advanceCursor(dt: number): void {
  if (!active) return;
  const k = 1 - Math.exp(-DAMP_RATE * Math.max(dt, 0.0001));
  current.x += (targetX - current.x) * k;
  current.y += (targetY - current.y) * k;
}

export function readCursor(): { x: number; y: number } {
  return current;
}
