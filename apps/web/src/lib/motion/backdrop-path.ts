/**
 * V11 sahne — scroll yolu (docs/V11-SAHNE-PROMPT.md Bölüm 3).
 *
 * Saf modül: yan etkisi yok, React/DOM/WebGL'e bağımlı değil. Altı referans
 * karesi (docs/referans/1..6.png), tüm scroll ilerlemesinin (Lenis, 0..1)
 * eşit aralıklı örnekleri sayılıp p = 0, .2, .4, .6, .8, 1 anahtar kareleri
 * olarak alındı. Anahtar kareler arası Catmull-Rom ile yumuşak enterpolasyon
 * (uçlarda kenetli/clamped — ilk ve son değer tekrarlanır).
 *
 * Konum/yarıçap birimleri: x = genişliğin oranı, y ve r = yüksekliğin oranı
 * (böylece r gerçek bir daire yarıçapı olarak kalır; sahne shader'ı x'i
 * `aspect` ile çarparak aynı birime çevirir). y ekranın ALTINA doğru artar;
 * 0'ın altı/1'in üstü ekran dışıdır (bkz. büyük kürenin geniş taşması).
 *
 * IŞIK DÜZELTMESİ (docs/qa/palet.md): doc'un "koyu→parlak→koyu" tahmini,
 * altı karenin ölçülen ortalama parlaklığıyla ÇELİŞTİ — gerçek eğri neredeyse
 * monoton artan (2. kare en koyu, 6. en parlak). Talimat Bölüm 0.3 gereği
 * ("çelişki varsa karelere güven") `light` burada ölçülen değerlerle.
 *
 * DÖNGÜ TASARIMI (Bölüm 3, açık talimat): son parça (p=0.8→1.0) küçük
 * küreyi bilerek ekran dışına çıkarıp üstten yeniden sokar — bu 6. karenin
 * BİREBİR okunuşu değil, talimatın kendisinin istediği "döngü hissi"
 * tasarım kararı.
 */

export type Circle = { x: number; y: number; r: number };

export type ScenePathState = {
  smallSphere: Circle;
  bigSphere: Circle;
  /** 0 (en koyu) .. 1 (en parlak) ışık evresi. */
  light: number;
};

type Keyframe = {
  p: number;
  small: [x: number, y: number, r: number];
  big: [x: number, y: number, r: number];
  light: number;
};

// p, küçük küre (x,y,r), büyük küre (x,y,r), ışık — bkz. dosya üstü not.
export const PATH_KEYFRAMES: readonly Keyframe[] = [
  { p: 0.0, small: [0.78, 0.23, 0.34], big: [0.87, 1.35, 1.7], light: 0.04 },
  { p: 0.2, small: [0.6, -0.1, 0.34], big: [0.8, 1.1, 1.75], light: 0.0 },
  { p: 0.4, small: [0.2, 0.31, 0.3], big: [0.95, 1.6, 1.9], light: 0.25 },
  { p: 0.6, small: [0.18, 0.64, 0.31], big: [1.05, 1.7, 2.0], light: 0.6 },
  { p: 0.8, small: [0.34, 0.92, 0.3], big: [0.75, 1.15, 1.8], light: 0.87 },
  { p: 1.0, small: [0.62, -0.25, 0.3], big: [0.7, 1.05, 1.75], light: 1.0 },
] as const;

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
}

/** Uçlarda kenetli (clamped) tekdüze Catmull-Rom — `values` p=0..1'de eşit aralıklı. */
function sampleSpline(values: readonly number[], p: number): number {
  const segCount = values.length - 1;
  const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
  const scaled = clamped * segCount;
  const seg = Math.min(segCount - 1, Math.floor(scaled));
  const t = scaled - seg;
  const i0 = Math.max(0, seg - 1);
  const i2 = Math.min(segCount, seg + 1);
  const i3 = Math.min(segCount, seg + 2);
  // i0/seg/i2/i3 yapısı gereği her zaman [0, values.length-1] içinde.
  return catmullRom(
    values[i0] as number,
    values[seg] as number,
    values[i2] as number,
    values[i3] as number,
    t,
  );
}

const smallX = PATH_KEYFRAMES.map((k) => k.small[0]);
const smallY = PATH_KEYFRAMES.map((k) => k.small[1]);
const smallR = PATH_KEYFRAMES.map((k) => k.small[2]);
const bigX = PATH_KEYFRAMES.map((k) => k.big[0]);
const bigY = PATH_KEYFRAMES.map((k) => k.big[1]);
const bigR = PATH_KEYFRAMES.map((k) => k.big[2]);
const lightV = PATH_KEYFRAMES.map((k) => k.light);

/** Scroll ilerlemesinden (0..1, sınır dışı kenetlenir) sahne hedef durumunu hesaplar. */
export function backdropPathAt(p: number): ScenePathState {
  return {
    smallSphere: {
      x: sampleSpline(smallX, p),
      y: sampleSpline(smallY, p),
      r: sampleSpline(smallR, p),
    },
    bigSphere: {
      x: sampleSpline(bigX, p),
      y: sampleSpline(bigY, p),
      r: sampleSpline(bigR, p),
    },
    light: sampleSpline(lightV, p),
  };
}
