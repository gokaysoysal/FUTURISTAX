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
 * sadeleştirildi V7 — tek odaklı küre/orb).
 *
 * - `[locale]/layout.tsx` seviyesinde bir kez mount; rota değişiminde
 *   REMOUNT OLMAZ (App Router layout kalıcı).
 * - `frameloop="never"` — render TEK paylaşımlı rAF'tan (`raf.ts`) sürülür;
 *   Lenis scroll ilerlemesi 0..1 sahneye uniform geçer (`backdrop-scene.ts`).
 * - Sekme arka plandayken `raf.ts` durur → render durur.
 * - Bölüm parametreleri (tone/density/depth/flow) AYNI sönümlü lerp ile
 *   karışır (`backdrop-scene.ts` değişmedi) — `depth` zaten hero'da düşük
 *   (yakın/parlak), kapanışta yüksek (uzak/soluk) olacak şekilde
 *   kayıtlıydı; V7'de bu doğrudan kürenin konum/boyut/opaklığını sürüyor.
 * - Yedekler bu bileşenin DIŞINDA (`SiteBackdrop`): reduced-motion / WebGL yok /
 *   düşük performans → `SiteBackdropFallback`. Mobilde `complexity=0.5`
 *   (ikinci halkayı ve iç sıcak çekirdeği kapatır).
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

    float radius = mix(0.3, 0.12, uDepth) * mix(0.92, 1.06, uDensity);
    // Kürenin çekirdek opaklığı derinlikle düşer ama SIFIRA inmez — iz kalır.
    float coreAlpha = mix(0.95, 0.18, uDepth) * mix(0.8, 1.0, uDensity);

    // Tek, yumuşak iç ışıma — çok parçacık yok, tek odak noktası.
    float core = exp(-pow(dist / radius, 2.0) * 2.6);
    float hotCore = uComplexity > 0.5
      ? exp(-pow(dist / (radius * 0.4), 2.0) * 3.0) * 0.55
      : 0.0;

    // İnce halka deseni — hafif organik dalgalanma, katı bir CAD çemberi değil.
    float angle = atan(uv.y - center.y, uv.x - center.x);
    float wobble = (hash(vec2(floor(angle * 6.0), floor(uTime * 0.08))) - 0.5) * 0.01;
    float ringR = radius * 2.05 + wobble + sin(uTime * (0.1 + uFlow * 0.12)) * radius * 0.012;
    float ringWidth = 0.005 + radius * 0.012;
    float ring = smoothstep(ringWidth, 0.0, abs(dist - ringR)) * 0.45;
    float ring2 = uComplexity > 0.5
      ? smoothstep(ringWidth * 0.7, 0.0, abs(dist - ringR * 1.5)) * 0.18
      : 0.0;

    // Renk sıcaklığı: soğuk azur → sıcak (menekşe + hafif mercan ucu).
    vec3 warm = mix(uGlow, vec3(1.0, 0.55, 0.42), 0.18);
    vec3 lightCol = mix(uAccent, warm, clamp(uTone, 0.0, 1.0));

    vec3 col = lightCol * (core + hotCore + ring + ring2);
    float a = clamp((core * 0.85 + hotCore * 0.5 + ring + ring2) * coreAlpha, 0.0, 0.62);

    // Bantlaşmayı kır — tek ince dither, yoğun doku değil.
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.015;

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
