'use client';

import { advanceScene, readScene, settleScene } from '@/lib/motion/backdrop-scene';
import { subscribeFrame } from '@/lib/motion/raf';
import { readColorToken } from '@/lib/webgl';
import { ScreenQuad } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Site geneli KALICI arka plan sahnesi — R3F shader alanı (V5 Bölüm 2,
 * sadeleştirildi V7 — tek odaklı küre; V8'de aydınlatılmış/hacimli küreye
 * yeniden çizildi — referans futureoffinance.peachweb.io'daki backlit
 * küre hissine yakınlaştırma, bkz. docs/PROJECT-STATUS.md §0-U).
 *
 * - `[locale]/layout.tsx` seviyesinde bir kez mount; rota değişiminde
 *   REMOUNT OLMAZ (App Router layout kalıcı).
 * - `frameloop="never"` — render TEK paylaşımlı rAF'tan (`raf.ts`) sürülür;
 *   Lenis scroll ilerlemesi 0..1 sahneye uniform geçer (`backdrop-scene.ts`).
 * - Sekme arka plandayken `raf.ts` durur → render durur.
 * - Bölüm parametreleri (tone/density/depth/flow) AYNI sönümlü lerp ile
 *   karışır (`backdrop-scene.ts` değişmedi) — `depth` zaten hero'da düşük
 *   (yakın/parlak), kapanışta yüksek (uzak/soluk) olacak şekilde
 *   kayıtlıydı; bu doğrudan kürenin konum/boyut/opaklığını sürüyor.
 * - V8: ekran-uzayı disk artık gerçek bir kürenin izdüşümü gibi gölgeleniyor
 *   (yüzey normali + tek fresnel kenar ışığı) — düz gaussian leke ve ayrık
 *   halka deseni kaldırıldı; net siluet + yumuşak dış sızıntı.
 * - Yedekler bu bileşenin DIŞINDA (`SiteBackdrop`): reduced-motion / WebGL yok /
 *   düşük performans → `SiteBackdropFallback`. Mobilde `complexity=0.5`
 *   (yüzey parıltısını kapatır).
 */

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform float uTone;
  uniform float uDensity;
  uniform float uDepth;
  uniform float uFlow;
  uniform float uComplexity;
  uniform vec2  uMouse;
  uniform vec3  uAccent;
  uniform vec3  uGlow;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main(){
    vec2 uv = vUv;
    uv.x *= uAspect;
    vec2 mouse = (uMouse - 0.5) * 0.02;

    // Küre konumu: hero'da üst-merkeze yakın; derinlik arttıkça yukarı/geriye
    // kayar (parallax) — konum sıçramaz, depth zaten sönümlü.
    vec2 center = vec2(0.5 * uAspect, mix(0.6, 0.94, uDepth)) + mouse;
    float dist = length(uv - center);
    float radius = mix(0.36, 0.15, uDepth) * mix(0.94, 1.05, uDensity);

    // Ekran-uzayı diski gerçek bir kürenin izdüşümü gibi ele al: r2<1 içinde
    // bir "yükseklik" (z) türet, bundan yüzey normali çıkar — referanstaki
    // gibi hacimli/aydınlatılmış tek küre, düz bir gaussian leke değil.
    vec2 p = (uv - center) / radius;
    float r2 = dot(p, p);
    float z = sqrt(max(0.0, 1.0 - r2));
    vec3 normal = normalize(vec3(p, z + 0.0001));

    // Tek ışık kaynağı, sırttan/yukarıdan — kenar aydınlatması (fresnel),
    // referanstaki backlit küre hissi. Çoklu ışık/parçacık yok.
    vec3 lightDir = normalize(vec3(0.3, 0.6, -0.5));
    float fresnel = pow(clamp(1.0 - z, 0.0, 1.0), 2.2);
    float backLight = clamp(dot(normal, lightDir), 0.0, 1.0);
    float innerGlow = exp(-r2 * 2.0);

    // Yüzeyde hafif, çok yavaş kayan bir parıltı — katı doku değil.
    float sheenN = hash(vec2(floor(uv.x * 26.0 + uv.y * 8.0), floor(uTime * (0.1 + uFlow * 0.08))));
    float sheen = uComplexity > 0.5 ? (sheenN - 0.5) * 0.05 : 0.0;

    // Renk sıcaklığı: soğuk azur → sıcak (menekşe + hafif mercan ucu).
    vec3 warm = mix(uGlow, vec3(1.0, 0.55, 0.42), 0.18);
    vec3 rimColor = mix(uAccent, warm, clamp(uTone, 0.0, 1.0));

    float body = innerGlow * 0.62 + fresnel * 1.15 + backLight * 0.3 + sheen;
    vec3 sphereCol = rimColor * body;

    // Kürenin kenarı belirgin/anti-alias'lı — referanstaki gibi net bir
    // siluet, sınırsız yumuşak bulut değil.
    float mask = 1.0 - smoothstep(0.86, 1.0, r2);
    // Diskin hemen dışında yumuşak ambiyans sızıntısı — sert kesim olmasın.
    float halo = exp(-pow(max(dist - radius, 0.0) / (radius * 0.85), 2.0)) * 0.24;

    // Sahnenin görünürlüğü derinlikle düşer ama SIFIRA inmez — iz kalır.
    float presence = mix(0.92, 0.2, uDepth) * mix(0.85, 1.0, uDensity);

    vec3 col = sphereCol * mask * presence + rimColor * halo * presence * 0.55;
    float a = clamp((0.55 * mask + 0.5 * fresnel * mask + halo * 0.4) * presence, 0.0, 0.85);

    // Bantlaşmayı kır — tek ince dither, yoğun doku değil.
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.012;

    gl_FragColor = vec4(col, a);
  }
`;

function Driver({ complexity }: { complexity: number }) {
  const reduce = useReducedMotion();
  const advance = useThree((s) => s.advance);
  const size = useThree((s) => s.size);
  const pointer = useRef({ x: 0.5, y: 0.5 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uTone: { value: 0.2 },
      uDensity: { value: 0.5 },
      uDepth: { value: 0.2 },
      uFlow: { value: 0.4 },
      uComplexity: { value: complexity },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAccent: { value: new THREE.Color('#4d7cff') },
      uGlow: { value: new THREE.Color('#7b6bff') },
    }),
    [complexity],
  );

  // Palet — tokenlardan; tema değişiminde güncelle.
  useEffect(() => {
    const sync = () => {
      uniforms.uAccent.value.set(readColorToken('--color-accent', '#4d7cff'));
      uniforms.uGlow.value.set(readColorToken('--color-accent-glow', '#7b6bff'));
    };
    sync();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [uniforms]);

  // İnce imleç etkisi — yalnızca ince işaretçi.
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth;
      pointer.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // TEK rAF — sahneyi ilerlet, uniformları yaz, bir kare render et.
  // `uniforms` nesnesi doğrudan mutasyonla güncellenir (three referansla okur).
  useEffect(() => {
    if (reduce) {
      settleScene();
      const s = readScene();
      uniforms.uTone.value = s.tone;
      uniforms.uDensity.value = s.density;
      uniforms.uDepth.value = s.depth;
      advance(performance.now());
      return;
    }

    const unsub = subscribeFrame((dt) => {
      advanceScene(dt);
      const s = readScene();
      uniforms.uTime.value += dt * (0.15 + s.flow * 0.5);
      uniforms.uTone.value = s.tone;
      uniforms.uDensity.value = s.density;
      uniforms.uDepth.value = s.depth;
      uniforms.uFlow.value = s.flow;
      const mv = uniforms.uMouse.value;
      mv.set(
        THREE.MathUtils.lerp(mv.x, pointer.current.x, 0.04),
        THREE.MathUtils.lerp(mv.y, pointer.current.y, 0.04),
      );
      advance(performance.now());
    });
    return unsub;
  }, [advance, reduce, uniforms]);

  uniforms.uAspect.value = size.width / Math.max(1, size.height);

  return (
    <ScreenQuad>
      <shaderMaterial
        key={complexity}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export default function SiteBackdropScene({ complexity = 1 }: { complexity?: number }) {
  return (
    <Canvas
      className="site-backdrop"
      frameloop="never"
      dpr={[1, complexity < 1 ? 1.5 : 2]}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 1] }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
    >
      <Driver complexity={complexity} />
    </Canvas>
  );
}
