'use client';

/**
 * İmleci izleyen kenar parıltısı — TEK global pointermove dinleyicisi
 * (V12 Bölüm 4). `.card-interactive` işaretli her kart için `--mx`/`--my`
 * (0-100%, imlecin kart içindeki konumu) doğrudan `el.style.setProperty`
 * ile yazılır — React state KULLANILMAZ (sürekli değer her hareket
 * bir re-render tetiklemesin diye; design-taste-frontend ilkesi, aynı
 * desen `cursor.ts`'te de var). CSS tarafı: `depth.css` `.card-interactive::before`.
 *
 * Yalnızca `pointer:fine` — dokunmatikte hiç başlamaz (gerçek fare yoksa
 * hover zaten anlamsız). `prefers-reduced-motion` burada İLGİLİ DEĞİL:
 * parıltı yalnızca CSS `:hover`'da görünür, kendi başına hareket/animasyon
 * üretmez (yalnızca imleç konumunu okur) — statik bir hover durumu.
 */

function onPointerMove(e: PointerEvent): void {
  if (e.pointerType !== 'mouse') return;
  const target = e.target;
  if (!(target instanceof Element)) return;
  const card = target.closest<HTMLElement>('.card-interactive');
  if (!card) return;
  const r = card.getBoundingClientRect();
  const mx = ((e.clientX - r.left) / Math.max(r.width, 1)) * 100;
  const my = ((e.clientY - r.top) / Math.max(r.height, 1)) * 100;
  card.style.setProperty('--mx', `${mx}%`);
  card.style.setProperty('--my', `${my}%`);
}

/** Dinlemeyi başlatır (yalnızca gerçek fare varsa); dönen fonksiyon bırakır. */
export function startCardGlowTracking(): () => void {
  if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
    return () => {};
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  return () => window.removeEventListener('pointermove', onPointerMove);
}
