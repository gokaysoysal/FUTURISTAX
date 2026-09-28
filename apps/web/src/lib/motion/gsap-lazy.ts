'use client';

/**
 * GSAP + split-type tembel yükleyici.
 *
 * NEDEN: `gsap` (+ ScrollTrigger) ve `split-type` statik import edildiğinde
 * layout'taki `SmoothScroll` üzerinden HER sayfanın ilk yük JS'ine giriyordu
 * (~40 KB gz). Bu modül onları `import()` ile ayrı chunk'a alır; çağıran
 * bileşenler yalnızca öğe görünüre yaklaşınca ve `prefers-reduced-motion`
 * kapalıyken yükler. Sonuç anlatıya erişimi geciktirmez (metin SSR'de hazır).
 */

type GsapBundle = {
  gsap: typeof import('gsap').gsap;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
};

let gsapPromise: Promise<GsapBundle> | null = null;

/** GSAP çekirdeği + ScrollTrigger — bir kez yüklenir, plugin bir kez register edilir. */
export function loadGsap(): Promise<GsapBundle> {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, st]) => {
      core.gsap.registerPlugin(st.ScrollTrigger);
      return { gsap: core.gsap, ScrollTrigger: st.ScrollTrigger };
    });
  }
  return gsapPromise;
}

let splitTypePromise: Promise<typeof import('split-type').default> | null = null;

/** split-type varsayılan dışa aktarımı (başlık harf/kelime bölme). */
export function loadSplitType(): Promise<typeof import('split-type').default> {
  if (!splitTypePromise) {
    splitTypePromise = import('split-type').then((m) => m.default);
  }
  return splitTypePromise;
}
