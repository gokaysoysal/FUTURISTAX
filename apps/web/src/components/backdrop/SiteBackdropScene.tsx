'use client';

import { advanceScene, readScene, settleScene } from '@/lib/motion/backdrop-scene';
import { advanceCursor, readCursor, startCursorTracking } from '@/lib/motion/cursor';
import { subscribeFrame } from '@/lib/motion/raf';
import { readColorToken } from '@/lib/webgl';
import { useReducedMotion } from 'motion/react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

/**
 * Site geneli KALICI arka plan sahnesi (V5 Bölüm 2, sadeleştirildi V7 — tek
 * odaklı küre; V8'de aydınlatılmış/hacimli küreye yeniden çizildi; V9'da
 * hazır bir bileşenden kurulduğu için TAMAMEN DEĞİŞTİ, bkz.
 * docs/PROJECT-STATUS.md §0-T).
 *
 * V9: üç turdur elle yazılan shader'ı sıfırdan kurmak yerine, react-bits'in
 * `Backgrounds/Orb` bileşeninin (MIT+Commons Clause, tek bağımlılık `ogl`)
 * fragment shader'ı taban alındı — noise/ışık/renk matematiği ondan, yalnızca
 * şunlar bizim: uCenter/uScale/uPresence (bölüm hedefli konum/boyut/opaklık,
 * `backdrop-scene.ts`'ten) ve dış render döngüsü. Orijinal bileşenin kendi
 * `requestAnimationFrame` döngüsü, mouse-hover çarpıtması ve dönme mantığı
 * KALDIRILDI — bunun yerine V5'ten beri var olan TEK paylaşımlı rAF'a
 * (`raf.ts`, sekme arka plandayken otomatik durur) ve `SceneRegion` hedef
 * parametrelerine (`tone/density/depth/flow`) bağlandı; three.js/R3F/drei
 * bağımlılığı tamamen kaldırıldı (yalnızca `ogl`, çok daha küçük).
 *
 * - `[locale]/layout.tsx` seviyesinde bir kez mount; rota değişiminde
 *   REMOUNT OLMAZ (App Router layout kalıcı).
 * - Render TEK paylaşımlı rAF'tan sürülür (`raf.ts`); sekme arka plandayken
 *   durur. `prefers-reduced-motion` altında hiç abone olmaz, TEK kare çizip
 *   durur (`settleScene`).
 * - Bölüm parametreleri (tone/density/depth/flow) AYNI sönümlü lerp ile
 *   karışır (`backdrop-scene.ts` değişmedi) — `depth` küre boyutu/konumu/
 *   opaklığını sürer (hero'da büyük/yakın/parlak, kapanışta küçük/uzak/soluk,
 *   iz asla sıfıra inmez); `tone` renk sıcaklığını (hue döndürme), `flow`
 *   iç zaman akış hızını sürer.
 * - Yedekler bu bileşenin DIŞINDA (`SiteBackdrop`): reduced-motion / WebGL yok /
 *   düşük performans → `SiteBackdropFallback`. Mobilde `complexity=0.5` →
 *   düşük devicePixelRatio tavanı.
 *
 * V10: imlece duyarlı ikincil katman eklendi (`lib/motion/cursor.ts`) — sahne
 * imlece doğru hafifçe çekilir (uCenter'a küçük, sönümlü bir ofset). Scroll'un
 * sürdüğü ANA hareketin üstüne biner, onu ezmez. Yalnızca gerçek mouse'ta
 * (`pointer: fine`) çalışır; dokunmatikte ve `prefers-reduced-motion`de kapalı.
 */

const VERT = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Taban: react-bits Backgrounds/Orb (MIT+Commons Clause, davidhdev/react-bits)
// fragment shader'ı — noise/ışık/renk matematiği değiştirilmedi. Eklenen
// uniformlar: uCenter/uScale (SceneRegion depth'ten konum+boyut), uPresence
// (depth'ten opaklık tabanı — asla sıfıra inmez), uHueShift (tone'dan).
const FRAG = /* glsl */ `
  precision highp float;

  uniform float iTime;
  uniform vec3 iResolution;
  uniform float hue;
  uniform vec2 uCenter;
  uniform float uScale;
  uniform float uPresence;
  uniform vec3 uAccent;
  uniform vec3 uGlow;
  varying vec2 vUv;

  vec3 rgb2yiq(vec3 c) {
    float y = dot(c, vec3(0.299, 0.587, 0.114));
    float i = dot(c, vec3(0.596, -0.274, -0.322));
    float q = dot(c, vec3(0.211, -0.523, 0.312));
    return vec3(y, i, q);
  }

  vec3 yiq2rgb(vec3 c) {
    float r = c.x + 0.956 * c.y + 0.621 * c.z;
    float g = c.x - 0.272 * c.y - 0.647 * c.z;
    float b = c.x - 1.106 * c.y + 1.703 * c.z;
    return vec3(r, g, b);
  }

  vec3 adjustHue(vec3 color, float hueDeg) {
    float hueRad = hueDeg * 3.14159265 / 180.0;
    vec3 yiq = rgb2yiq(color);
    float cosA = cos(hueRad);
    float sinA = sin(hueRad);
    float i = yiq.y * cosA - yiq.z * sinA;
    float q = yiq.y * sinA + yiq.z * cosA;
    yiq.y = i;
    yiq.z = q;
    return yiq2rgb(yiq);
  }

  vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
    p3 += dot(p3, p3.yxz + 19.19);
    return -1.0 + 2.0 * fract(vec3(
      p3.x + p3.y,
      p3.x + p3.z,
      p3.y + p3.z
    ) * p3.zyx);
  }

  float snoise3(vec3 p) {
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;
    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
    vec3 e = step(vec3(0.0), d0 - d0.yzx);
    vec3 i1 = e * (1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy * (1.0 - e);
    vec3 d1 = d0 - (i1 - K2);
    vec3 d2 = d0 - (i2 - K1);
    vec3 d3 = d0 - 0.5;
    vec4 h = max(0.6 - vec4(
      dot(d0, d0),
      dot(d1, d1),
      dot(d2, d2),
      dot(d3, d3)
    ), 0.0);
    vec4 n = h * h * h * h * vec4(
      dot(d0, hash33(i)),
      dot(d1, hash33(i + i1)),
      dot(d2, hash33(i + i2)),
      dot(d3, hash33(i + 1.0))
    );
    return dot(vec4(31.316), n);
  }

  vec4 extractAlpha(vec3 colorIn) {
    float a = max(max(colorIn.r, colorIn.g), colorIn.b);
    return vec4(colorIn.rgb / (a + 1e-5), a);
  }

  // Orb'un kendi sabit paletinin yerine site tema tokenları (--color-accent /
  // --color-accent-glow) geçti — açık/koyu tema değişiminde güncellenir
  // (bkz. render() içindeki matchMedia dinleyicisi). Üçüncü renk (en koyu
  // karışım ucu) marka tokenı değil, iç gölgeleme çapası — Orb'daki gibi sabit.
  const vec3 baseColor3 = vec3(0.062745, 0.078431, 0.600000);
  const float innerRadius = 0.6;
  const float noiseScale = 0.65;

  float light1(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * attenuation);
  }

  float light2(float intensity, float attenuation, float dist) {
    return intensity / (1.0 + dist * dist * attenuation);
  }

  vec4 draw(vec2 uv) {
    vec3 color1 = adjustHue(uGlow, hue);
    vec3 color2 = adjustHue(uAccent, hue);
    vec3 color3 = adjustHue(baseColor3, hue);

    float len = length(uv);
    float invLen = len > 0.0 ? 1.0 / len : 0.0;

    float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
    float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
    float d0 = distance(uv, (r0 * invLen) * uv);
    float v0 = light1(1.0, 10.0, d0);

    v0 *= smoothstep(r0 * 1.05, r0, len);
    v0 *= smoothstep(r0 * 0.8, r0 * 0.95, len);
    float cl = cos(iTime * 2.0) * 0.5 + 0.5;

    float a = iTime * -1.0;
    vec2 pos = vec2(cos(a), sin(a)) * r0;
    float d = distance(uv, pos);
    float v1 = light2(1.5, 5.0, d);
    v1 *= light1(1.0, 50.0, d0);

    float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
    float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

    vec3 colBase = mix(color1, color2, cl);

    vec3 darkCol = mix(color3, colBase, v0);
    darkCol = (darkCol + v1) * v2 * v3;

    // Orb'un orijinali içi boş, ince bir HALKA çiziyor (probe ile doğrulandı:
    // innerRadius'u 0.6→0.95 aralığında değiştirmek görünüşü neredeyse hiç
    // etkilemiyor — boşluk v2/v3 maskesinden geliyor, sabit değil). Referans
    // dolu, merkezden kenara gradyanlı bir "backlit küre" gösteriyor — Orb'un
    // ışık/gürültü matematiğini bozmadan, TEK ek terim olarak yumuşak bir
    // gaussian çekirdek parıltısı eklendi. Kendi test ortamımızda gerçek
    // rAF çalışmadığından bu ayarlama, shader kaynağını canlı canvas'a
    // doğrudan derleyip enjekte eden bir problarla görsel olarak doğrulandı.
    float core = exp(-len * len * 2.5);
    darkCol += colBase * core * 0.9;
    darkCol = clamp(darkCol, 0.0, 1.0);

    return extractAlpha(darkCol);
  }

  void main() {
    vec2 fragCoord = vUv * iResolution.xy;
    vec2 center = iResolution.xy * uCenter;
    float size = min(iResolution.x, iResolution.y) * uScale;
    vec2 uv = (fragCoord - center) / size * 2.0;

    vec4 col = draw(uv);
    gl_FragColor = vec4(col.rgb * col.a * uPresence, col.a * uPresence);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const trimmed = hex.trim();
  if (!/^#[0-9a-f]{6}$/i.test(trimmed)) return [0.3, 0.49, 1];
  const int = Number.parseInt(trimmed.slice(1), 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

export default function SiteBackdropScene({ complexity = 1 }: { complexity?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false, antialias: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.inset = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [gl.canvas.width, gl.canvas.height, 1] },
        hue: { value: 0 },
        uCenter: { value: [0.5, 0.42] },
        uScale: { value: 0.9 },
        uPresence: { value: 0.5 },
        uAccent: { value: hexToRgb('#4d7cff') },
        uGlow: { value: hexToRgb('#7b6bff') },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, complexity < 1 ? 1.5 : 2);
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      program.uniforms.iResolution.value = [
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / Math.max(1, gl.canvas.height),
      ];
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const syncPalette = () => {
      program.uniforms.uAccent.value = hexToRgb(readColorToken('--color-accent', '#4d7cff'));
      program.uniforms.uGlow.value = hexToRgb(readColorToken('--color-accent-glow', '#7b6bff'));
    };
    syncPalette();
    const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    themeQuery.addEventListener('change', syncPalette);

    function render(
      s: { tone: number; density: number; depth: number; flow: number },
      time: number,
      cursor: { x: number; y: number },
    ) {
      // depth: hero'da düşük (büyük/yakın/parlak) → kapanışta yüksek (küçük/uzak/soluk).
      program.uniforms.uScale.value = 1.15 - s.depth * 0.75; // 1.15 → 0.40
      // İmleç ofseti: hafif manyetik çekim — ana depth/scroll hareketinin
      // ÜSTÜNE biner, genliği küçük tutulur ki ana hareketi ezmesin.
      const pull = 0.035;
      program.uniforms.uCenter.value = [
        0.5 + cursor.x * pull,
        0.38 + s.depth * 0.1 + cursor.y * pull * 0.6,
      ];
      program.uniforms.uPresence.value =
        Math.max(0.16, 0.85 - s.depth * 0.6) * (0.85 + s.density * 0.3);
      program.uniforms.hue.value = s.tone * 45; // hafif sıcak kayma — orb'un varsayılan mor/camgöbeği/lacivert ailesinde kalır
      program.uniforms.iTime.value = time;
      renderer.render({ scene: mesh });
    }

    if (reduce) {
      settleScene();
      const s = readScene();
      render(s, 0, { x: 0, y: 0 });
      return () => {
        window.removeEventListener('resize', resize);
        themeQuery.removeEventListener('change', syncPalette);
        container.removeChild(gl.canvas);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    const stopCursor = startCursorTracking();
    let simTime = 0;
    const unsub = subscribeFrame((dt) => {
      advanceScene(dt);
      advanceCursor(dt);
      const s = readScene();
      simTime += dt * (0.15 + s.flow * 0.5);
      render(s, simTime, readCursor());
    });

    return () => {
      unsub();
      stopCursor();
      window.removeEventListener('resize', resize);
      themeQuery.removeEventListener('change', syncPalette);
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [complexity, reduce]);

  return (
    <div
      ref={containerRef}
      className="site-backdrop"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}
