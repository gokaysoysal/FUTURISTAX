'use client';

/**
 * Kalıcı arka plan sahnesi — paylaşılan durum (V5 Bölüm 2).
 *
 * React state DEĞİL: kare başına okunur, yeniden render tetiklemez. Sahne
 * canvas'ı (`SiteBackdropScene`) her karede `advance(dt)` + `read()` çağırır;
 * bölümler (`SceneRegion`) görünürlüklerine göre hedef parametre kaydeder.
 *
 * Parametreler 0..1:
 *   tone     renk sıcaklığı  (0 soğuk azur · 1 sıcak menekşe/mercan ucu)
 *   density  alan yoğunluğu  (bulut örtüsü ne kadar dolu)
 *   depth    kamera derinliği (paralaks/ölçek hissi)
 *   flow     akış hızı       (zaman ilerleme çarpanı)
 *
 * Bölümler arası geçiş sönümlü lerp ile (kare-hızından bağımsız):
 *   k = 1 - exp(-RATE * dt)   → RATE ≈ 3  (≈ 60fps'te kare başına ~0.05).
 */

export type SceneParams = {
  tone: number;
  density: number;
  depth: number;
  flow: number;
};

const DAMP_RATE = 3;

const DEFAULTS: SceneParams = { tone: 0.2, density: 0.5, depth: 0.2, flow: 0.4 };

type Region = { params: Partial<SceneParams>; weight: number };

const regions = new Map<symbol, Region>();

let progress = 0; // 0..1 — tüm sayfa scroll ilerlemesi (Lenis besler)
const current: SceneParams = { ...DEFAULTS };

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Lenis `scroll` olayından (veya yedek) çağrılır. */
export function setScrollProgress(p: number): void {
  progress = clamp01(p);
}

export function getScrollProgress(): number {
  return progress;
}

/** Bir bölümü kaydet; anahtar geri döner (unregister için). */
export function registerRegion(params: Partial<SceneParams>): symbol {
  const key = Symbol('scene-region');
  regions.set(key, { params, weight: 0 });
  return key;
}

export function setRegionWeight(key: symbol, weight: number): void {
  const r = regions.get(key);
  if (r) r.weight = clamp01(weight);
}

export function unregisterRegion(key: symbol): void {
  regions.delete(key);
}

/**
 * Aktif bölümlerin ağırlıklı ortalaması hedeftir. Hiç aktif bölüm yoksa
 * (imza sayfası dışındaki rotalar) hedef scroll ilerlemesinden türetilir —
 * sayfa hiçbir yerde "durmuş" hissettirmesin.
 */
function computeTarget(): SceneParams {
  let total = 0;
  const acc: SceneParams = { tone: 0, density: 0, depth: 0, flow: 0 };
  for (const { params, weight } of regions.values()) {
    if (weight <= 0) continue;
    total += weight;
    acc.tone += (params.tone ?? DEFAULTS.tone) * weight;
    acc.density += (params.density ?? DEFAULTS.density) * weight;
    acc.depth += (params.depth ?? DEFAULTS.depth) * weight;
    acc.flow += (params.flow ?? DEFAULTS.flow) * weight;
  }
  if (total > 0) {
    return {
      tone: acc.tone / total,
      density: acc.density / total,
      depth: acc.depth / total,
      flow: acc.flow / total,
    };
  }
  return {
    tone: 0.1 + progress * 0.8,
    density: 0.45 + Math.sin(progress * Math.PI) * 0.15,
    depth: progress,
    flow: 0.32 + progress * 0.3,
  };
}

/** Kare adımı — hedefe doğru sönümlü ilerle. */
export function advanceScene(dt: number): void {
  const target = computeTarget();
  const k = 1 - Math.exp(-DAMP_RATE * Math.max(dt, 0.0001));
  current.tone += (target.tone - current.tone) * k;
  current.density += (target.density - current.density) * k;
  current.depth += (target.depth - current.depth) * k;
  current.flow += (target.flow - current.flow) * k;
}

export function readScene(): SceneParams {
  return current;
}

/** reduced-motion / donmuş yedek: hedefe anında otur (tek kare). */
export function settleScene(): void {
  const t = computeTarget();
  current.tone = t.tone;
  current.density = t.density;
  current.depth = t.depth;
  current.flow = 0;
}
