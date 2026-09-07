'use client';

import { readColorToken } from '@/lib/webgl';
import { ScreenQuad } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * WebGL hero — KONSEPT: "shader alanı".
 *
 * Neden bu konsept (parçacık sistemi / katmanlı ızgara yerine):
 *  - GPU-hafif: tek tam ekran üçgen + fragment shader. Zayıf mobil GPU'da
 *    bile 60fps; DPR ve frameloop ile kolayca kısılır.
 *  - Palete bağlı: renkler CSS tokenlarından üniform olarak okunur; sahne
 *    kendi rengini getirmez (prefers-color-scheme değişimi izlenir).
 *  - Yedek paritesi: statik CSS gradyan yedeği (HeroFallback) görsel olarak
 *    neredeyse aynı — kusursuz degradasyon.
 *  - Varlık bağımsız: sprite/doku gerektirmez.
 *
 * Yedekler bu bileşenin DIŞINDA (Hero.tsx): reduced-motion / WebGL yok /
 * mobil (< 768px) → HeroFallback. Burada ek olarak: sekme gizliyken render
 * durur (frameloop 'demand').
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
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform vec3 uBg;
  uniform vec3 uAccent;
  uniform vec3 uGlow;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int k = 0; k < 4; k++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    uv.x *= uAspect;
    vec2 m = uMouse; m.x *= uAspect;
    float t = uTime * 0.04;

    vec2 q = vec2(fbm(uv * 1.4 + t), fbm(uv * 1.4 - t + 5.2));
    vec2 r = vec2(fbm(uv * 1.8 + q * 1.6 + t * 1.3), fbm(uv * 1.8 + q * 1.6 - t));
    float n = fbm(uv * 1.2 + r * 1.4 + 0.14 * (m - 0.5));

    vec3 col = uBg;
    col = mix(col, uAccent, smoothstep(0.36, 0.92, n) * 0.5);
    col = mix(col, uGlow, smoothstep(0.58, 1.0, r.x) * 0.24);

    float vig = smoothstep(1.35, 0.15, length((vUv - 0.5) * vec2(uAspect, 1.0)));
    col = mix(uBg, col, 0.32 + 0.68 * vig);
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.018;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Field({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const uniforms = useMemo(
    () => ({
      uTime: { value: reduce ? 11.0 : 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: 1 },
      uBg: { value: new THREE.Color('#07090d') },
      uAccent: { value: new THREE.Color('#4d7cff') },
      uGlow: { value: new THREE.Color('#7b6bff') },
    }),
    [reduce],
  );
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const sync = () => {
      uniforms.uBg.value.set(readColorToken('--color-canvas', '#07090d'));
      uniforms.uAccent.value.set(readColorToken('--color-accent', '#4d7cff'));
      uniforms.uGlow.value.set(readColorToken('--color-accent-glow', '#7b6bff'));
    };
    sync();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [uniforms]);

  useFrame((state, delta) => {
    uniforms.uAspect.value = state.size.width / Math.max(1, state.size.height);
    if (!active || reduce) return;
    uniforms.uTime.value += Math.min(delta, 0.05);
    target.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    uniforms.uMouse.value.lerp(target.current, 0.035);
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        key={reduce ? 'r' : 'a'}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export default function HeroScene() {
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  const active = !reduce && !hidden;

  return (
    <Canvas
      className="scene-backdrop"
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'demand'}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 1] }}
      style={{ pointerEvents: 'none' }}
    >
      <Field active={active} />
    </Canvas>
  );
}
