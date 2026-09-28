'use client';

import { backdropPathAt } from '@/lib/motion/backdrop-path';
import { dampScenePath, sceneToUniforms, wobbleRadius } from '@/lib/motion/backdrop-runtime';
import { getScrollProgress } from '@/lib/motion/backdrop-scene';
import { advanceCursor, readCursor, startCursorTracking } from '@/lib/motion/cursor';
import { subscribeFrame } from '@/lib/motion/raf';
import { hexToRgb, readColorToken } from '@/lib/webgl';
import { useReducedMotion } from 'motion/react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import { FRAG, VERT } from './backdrop-shader';

/**
 * Site geneli KALICI arka plan sahnesi — V11 (docs/V11-SAHNE-PROMPT.md).
 *
 * V9/V10'daki react-bits Orb shader'ı TAMAMEN KALDIRILDI. Yerine, altı
 * referans kareye (docs/referans/1..6.png) benzeyen ÖZGÜN bir "kuantize
 * yükseklik alanı" sahnesi geldi: solda oluklu/şeritli bir panel, sert dikey
 * kenarla düz bir duvara açılıyor; panel içinde küçük bir küre şeritleri
 * kubbe gibi kaldırıyor (şerit indeksi kuantize, y sürekli → basamak/hilal
 * biçimleri buradan emergent), duvarda devasa ikinci bir küre yalnızca
 * silüet kenarıyla görünüyor. Raymarching YOK — kapalı-form yükseklik alanı
 * + sahte Lambert/Fresnel gölgeleme (shader kaynağı: `backdrop-shader.ts`).
 * Konum/parametre modeli tamamen değişti; ogl + Lenis + paylaşımlı rAF
 * altyapısı (raf.ts, cursor.ts) KORUNDU.
 *
 * - Scroll yolu saf bir modülde (`lib/motion/backdrop-path.ts`, birim
 *   testli): Lenis ilerlemesi (`getScrollProgress`, 0..1) → altı anahtar
 *   karede Catmull-Rom ile enterpolasyon. Hedef her karede sönümlü lerp ile
 *   (`backdrop-runtime.ts`, ~0.06, kare hızından bağımsız) süzülür — scroll
 *   durunca sahne durur.
 * - Fare: `cursor.ts`'in AYNI sönümlü katmanı (damp≈0.06/kare 60fps'te) hem
 *   ışık odağını hem küçük/büyük kürenin hafif ters yönlü kaymasını sürer
 *   (`sceneToUniforms`) — yalnızca gerçek mouse'ta (`pointer:fine`);
 *   dokunmatik ve reduced-motion'da devre dışı (cursor.ts'te zaten no-op).
 * - Palet CSS'ten (`--scene-*`, docs/qa/palet.md) okunur, sabit değil.
 * - Okunabilirlik (Bölüm 5, ESNEMEZ): sahnenin en parlak ölçülen tonu
 *   `--scene-ground-bright` (#5a789b, rel. luminance ≈0.19). `.text-scrim`
 *   (depth.css) metin bloklarının arkasına `--color-canvas`'ı ≥%55 (hero'da
 *   ~%86) opaklıkla bindirir; oklab karışımı neredeyse siyaha çeker →
 *   kompozit luminance ≈0.03, `--color-text` (≈0.96) karşısında ≈13:1 —
 *   4.5:1 tabanının çok üzerinde. Palet bu iki token DIŞINDA değişirse hesap
 *   tekrarlanmalı.
 * - Doğrulama modu (Bölüm 7.A): `NEXT_PUBLIC_SCENE_DEBUG=1` derlemesinde
 *   `?scene-debug=1&p&mx&my` sahneyi tek deterministik karede dondurur,
 *   `preserveDrawingBuffer` açar, hazır olunca `window.__sceneReady=true`
 *   olur. Bayrak kapalıyken (üretim) bu dal ölü koddur.
 */

const DEBUG_ENABLED = process.env.NEXT_PUBLIC_SCENE_DEBUG === '1';

function readPalette() {
  return {
    groundDark: hexToRgb(readColorToken('--scene-ground-dark', '#0a0e28')),
    groundBright: hexToRgb(readColorToken('--scene-ground-bright', '#5a789b')),
    grooveDark: hexToRgb(readColorToken('--scene-groove-dark', '#020410')),
    edgeLight: hexToRgb(readColorToken('--scene-edge-light', '#a1c3ce')),
  };
}

export default function SiteBackdropScene({ complexity = 1 }: { complexity?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerEl = container; // const, closure'lar için daraltılmış referans

    let debugParams: URLSearchParams | null = null;
    if (DEBUG_ENABLED && typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('scene-debug') === '1') debugParams = sp;
    }

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: Boolean(debugParams),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    container.appendChild(gl.canvas);
    Object.assign(gl.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      opacity: '0',
      transition: reduce ? 'none' : 'opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)',
    });

    const geometry = new Triangle(gl);
    const palette = readPalette();
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [gl.canvas.width, gl.canvas.height, 1] },
        uStripStepPx: { value: 49 },
        uPanelEdgeFrac: { value: 0.474 },
        uSmall: { value: [0.78, 0.23, 0.34] },
        uBig: { value: [0.87, 1.35, 1.7] },
        uLight: { value: 0.1 },
        uMouseFocus: { value: [0, 0] },
        uGroundDark: { value: palette.groundDark },
        uGroundBright: { value: palette.groundBright },
        uGrooveDark: { value: palette.grooveDark },
        uEdgeLight: { value: palette.edgeLight },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const internalScale = complexity < 1 ? 0.7 : 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr * internalScale, height * dpr * internalScale);
      program.uniforms.iResolution.value = [gl.canvas.width, gl.canvas.height, 1];
      const stripStepCss = Math.max(width * 0.0255, 22);
      program.uniforms.uStripStepPx.value = stripStepCss * dpr * internalScale;
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    const syncPalette = () => {
      const p = readPalette();
      program.uniforms.uGroundDark.value = p.groundDark;
      program.uniforms.uGroundBright.value = p.groundBright;
      program.uniforms.uGrooveDark.value = p.grooveDark;
      program.uniforms.uEdgeLight.value = p.edgeLight;
    };
    const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    themeQuery.addEventListener('change', syncPalette);

    function paint(
      state: ReturnType<typeof backdropPathAt>,
      time: number,
      p: number,
      cursorOverride?: { x: number; y: number },
      wobble = false,
    ) {
      const cursor = cursorOverride ?? readCursor();
      const { small, big } = sceneToUniforms(state, cursor);
      if (wobble) {
        // Bölüm 2.4: çok yavaş, düşük genlikli silüet dalgalanması —
        // yalnızca canlı rAF döngüsünde (reduced-motion/doğrulama modunda
        // `time` hep 0 kalır, wobbleRadius kendiliğinden sabitlenir).
        small[2] = wobbleRadius(small[2], time, 14, 0.025, 0);
        big[2] = wobbleRadius(big[2], time, 18, 0.015, 1.7);
      }
      program.uniforms.uSmall.value = small;
      program.uniforms.uBig.value = big;
      program.uniforms.uLight.value = state.light;
      program.uniforms.uMouseFocus.value = [cursor.x, cursor.y];
      program.uniforms.iTime.value = time;
      renderer.render({ scene: mesh });
      containerEl.dataset.backdropState = p.toFixed(4);
    }

    const cleanupBase = () => {
      window.removeEventListener('resize', resize);
      themeQuery.removeEventListener('change', syncPalette);
      container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };

    // ── Doğrulama modu (Bölüm 7.A) — yalnızca NEXT_PUBLIC_SCENE_DEBUG=1 ──
    if (debugParams) {
      const p = Number.parseFloat(debugParams.get('p') ?? '0.2');
      const mx = Number.parseFloat(debugParams.get('mx') ?? '0.5');
      const my = Number.parseFloat(debugParams.get('my') ?? '0.5');
      // Belirlenimci tek kare: (p, mx, my) → fare hiçbir sönümlemeden geçmeden
      // doğrudan cursorOverride olarak uygulanır (rAF/cursor.ts devre dışı).
      paint(backdropPathAt(p), 0, p, { x: mx * 2 - 1, y: my * 2 - 1 });
      gl.canvas.style.transition = 'none';
      gl.canvas.style.opacity = '1';
      (window as Window & { __sceneReady?: boolean }).__sceneReady = true;
      return cleanupBase;
    }

    const reveal = () =>
      requestAnimationFrame(() => {
        gl.canvas.style.opacity = '1';
      });

    if (reduce) {
      paint(backdropPathAt(getScrollProgress()), 0, getScrollProgress());
      reveal();
      return cleanupBase;
    }

    const stopCursor = startCursorTracking();
    let simTime = 0;
    let current = backdropPathAt(getScrollProgress());
    const DAMP_RATE = 3.2; // 60fps'te k≈0.05-0.06 (1-exp(-RATE*dt)) — Bölüm 3

    let idleHandle: number | ReturnType<typeof setTimeout> = 0;
    let unsub: (() => void) | null = null;
    const startLoop = () => {
      unsub = subscribeFrame((dt) => {
        advanceCursor(dt);
        const target = backdropPathAt(getScrollProgress());
        const k = 1 - Math.exp(-DAMP_RATE * Math.max(dt, 0.0001));
        current = dampScenePath(current, target, k);
        simTime += dt;
        paint(current, simTime, getScrollProgress(), undefined, true);
      });
      reveal();
    };

    // Mount'u idle sonrasına al — hero LCP'yi geciktirmesin (Bölüm 6).
    if ('requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(startLoop, { timeout: 400 });
    } else {
      idleHandle = setTimeout(startLoop, 1);
    }

    return () => {
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleHandle as number);
      else clearTimeout(idleHandle as ReturnType<typeof setTimeout>);
      unsub?.();
      stopCursor();
      cleanupBase();
    };
  }, [complexity, reduce]);

  return (
    <div
      ref={containerRef}
      className="site-backdrop"
      data-backdrop-state="0"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}
