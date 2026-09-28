import type { ScenePathState } from './backdrop-path';

/**
 * V11 sahne — çalışma zamanı yardımcıları (docs/V11-SAHNE-PROMPT.md Bölüm 3-4).
 *
 * `backdrop-path.ts` saf/testli kalsın diye kare-başına sönümleme ve fare
 * ofseti burada — bunlar da saf fonksiyonlar (yan etkisiz), ama React/DOM'a
 * bağımlı değiller; `SiteBackdropScene.tsx` içine gömülmek yerine ayrı
 * dosyada (CLAUDE.md kural 6 — 300 satır sınırı).
 */

/** Sönümlü lerp — `current`'ı `target`'a doğru `k` kadar ilerletir (k = 1-exp(-RATE*dt)). */
export function dampScenePath(
  current: ScenePathState,
  target: ScenePathState,
  k: number,
): ScenePathState {
  const lerp = (a: number, b: number) => a + (b - a) * k;
  return {
    smallSphere: {
      x: lerp(current.smallSphere.x, target.smallSphere.x),
      y: lerp(current.smallSphere.y, target.smallSphere.y),
      r: lerp(current.smallSphere.r, target.smallSphere.r),
    },
    bigSphere: {
      x: lerp(current.bigSphere.x, target.bigSphere.x),
      y: lerp(current.bigSphere.y, target.bigSphere.y),
      r: lerp(current.bigSphere.r, target.bigSphere.r),
    },
    light: lerp(current.light, target.light),
  };
}

const SMALL_SPHERE_MOUSE_PULL = 0.02; // ±%2 — Bölüm 4
const BIG_SPHERE_MOUSE_PULL = -0.01; // ∓%1, ters yön (derinlik hissi) — Bölüm 4

/** Sahne durumu + fare ofsetinden shader'a verilecek [x,y,r] üniformlarını üretir. */
export function sceneToUniforms(state: ScenePathState, cursor: { x: number; y: number }) {
  return {
    small: [
      state.smallSphere.x + cursor.x * SMALL_SPHERE_MOUSE_PULL,
      state.smallSphere.y + cursor.y * SMALL_SPHERE_MOUSE_PULL * 0.6,
      state.smallSphere.r,
    ] as [number, number, number],
    big: [
      state.bigSphere.x + cursor.x * BIG_SPHERE_MOUSE_PULL,
      state.bigSphere.y + cursor.y * BIG_SPHERE_MOUSE_PULL * 0.6,
      state.bigSphere.r,
    ] as [number, number, number],
  };
}

/**
 * V12 Bölüm 2.4 — silüette çok yavaş, düşük genlikli yarıçap dalgalanması
 * (yarıçapın %1.5-3'ü, periyot 12-20sn). Saf fonksiyon: `time` saniyede,
 * ilerlemez kalırsa (reduced-motion/doğrulama modunda `time` hep 0'dır)
 * `sin(phase)` sabitlenir — dalgalanma kendiliğinden durur, ayrı bir
 * reduced-motion bayrağı gerekmez.
 */
export function wobbleRadius(
  r: number,
  time: number,
  periodSec: number,
  ampFrac: number,
  phase = 0,
): number {
  return r * (1 + Math.sin(((time / periodSec) * Math.PI * 2 + phase) % (Math.PI * 2)) * ampFrac);
}
