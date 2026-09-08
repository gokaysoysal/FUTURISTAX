'use client';

import {
  advanceScene,
  getScrollProgress,
  readScene,
  settleScene,
} from '@/lib/motion/backdrop-scene';
import { subscribeFrame } from '@/lib/motion/raf';
import { readColorToken } from '@/lib/webgl';
import { ScreenQuad } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Site geneli KALICI arka plan sahnesi — R3F shader alanı (V5 Bölüm 2).
 *
 * - `[locale]/layout.tsx` seviyesinde bir kez mount; rota değişiminde
 *   REMOUNT OLMAZ (App Router layout kalıcı).
 * - `frameloop="never"` — render TEK paylaşımlı rAF'tan (`raf.ts`) sürülür;
 *   Lenis scroll ilerlemesi 0..1 sahneye uniform geçer (`backdrop-scene.ts`).
 * - Sekme arka plandayken `raf.ts` durur → render durur.
 * - Bölüm parametreleri (tone/density/depth/flow) sönümlü lerp ile karışır.
 * - Yedekler bu bileşenin DIŞINDA (`SiteBackdrop`): reduced-motion / WebGL yok /
 *   düşük performans → `SiteBackdropFallback`. Mobilde `complexity=0.5`.
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
  uniform float uProgress;
  uniform float uTone;
  uniform float uDensity;
  uniform float uDepth;
  uniform float uFlow;
  uniform float uOctaves;
  uniform vec2  uMouse;
  uniform vec3  uAccent;
  uniform vec3  uGlow;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int k = 0; k < 4; k++) {
      if (float(k) >= uOctaves) break;      // mobilde yarı karmaşıklık
      v += a * noise(p);
      p *= 2.0; a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    uv.x *= uAspect;
    float zoom = mix(1.05, 1.55, uDepth);
    uv *= zoom;

    float t = uTime * (0.5 + uFlow);
    vec2 m = (uMouse - 0.5) * 0.12;

    vec2 q = vec2(fbm(uv * 1.3 + t * 0.6), fbm(uv * 1.3 - t * 0.5 + 5.2));
    vec2 r = vec2(fbm(uv * 1.7 + q * 1.5 + t * 0.8 + m), fbm(uv * 1.7 + q * 1.5 - t * 0.7));
    float n = fbm(uv * 1.1 + r * 1.4);

    // Renk sıcaklığı: soğuk azur → sıcak (menekşe + hafif mercan ucu).
    vec3 warm = mix(uGlow, vec3(1.0, 0.55, 0.42), 0.18);
    vec3 lightCol = mix(uAccent, warm, clamp(uTone, 0.0, 1.0));

    float field = smoothstep(0.34, 0.92, n + (uProgress - 0.5) * 0.12);
    float bright = smoothstep(0.55, 1.0, r.x) * 0.5;

    vec3 col = lightCol * (field + bright);

    // Kenar sönümü — geniş ekranda köşeler kararmasın (V5 Bölüm 1 dersi).
    float vig = smoothstep(1.95, 0.4, length((vUv - 0.5) * vec2(uAspect, 1.0)));
    float cover = (field * 0.8 + bright * 0.6) * (0.55 + 0.45 * vig);

    float a = clamp(cover * (0.16 + 0.36 * uDensity), 0.0, 0.55);

    // Bantlaşmayı kır.
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.02;

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
      uProgress: { value: 0 },
      uTone: { value: 0.2 },
      uDensity: { value: 0.5 },
      uDepth: { value: 0.2 },
      uFlow: { value: 0.4 },
      uOctaves: { value: complexity < 1 ? 2 : 4 },
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
      uniforms.uProgress.value = getScrollProgress();
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
      uniforms.uProgress.value = getScrollProgress();
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
