/**
 * Merkezî hareket yapılandırması — easing eğrileri, süreler, mesafeler,
 * scroll eşikleri TEK yerde. Bileşenler bu sabitleri içe aktarır; sihirli
 * sayı gömmez.
 *
 * İlke (CLAUDE.md → Hareket): yalnızca transform/opacity; prefers-reduced-motion
 * altında her şey kapanır (guard bileşenlerde); animasyon içeriğe erişimi
 * geciktirmez.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STACK AYRIMI — Framer Motion ve GSAP birlikte kullanılır, iş bölümü NET:
 *
 *  • Framer Motion (`motion` / `motion/react`, bu klasör):
 *      bileşen içi mikro etkileşim, hover, giriş/çıkış, layout animasyonları,
 *      sayfa/rota geçişleri. Deklaratif, bileşen ömrüne bağlı.
 *
 *  • GSAP + ScrollTrigger (`gsap`, `@gsap/react`):
 *      YALNIZCA scroll'a bağlı sahne koreografisi — pin, yatay scroll,
 *      timeline sekansları. Imperatif, scroll konumuna bağlı.
 *
 *  KURAL: Aynı öğeyi ikisiyle birden animasyon ETME. Bir öğe ya Framer
 *  Motion'ın ya da GSAP'in kontrolünde; ikisi transform'a aynı anda yazarsa
 *  çakışır.
 *
 *  Lenis (smooth scroll): `prefers-reduced-motion: reduce` altında HİÇ
 *  başlatma — native scroll'a bırak. ScrollTrigger kullanılacaksa Lenis'in
 *  scroll olayı ScrollTrigger.update'e bağlanır (yine reduced-motion'da kapalı).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * TEK EASING AİLESİ — expo.out. Reveal, giriş, hover, sayaç, parallax:
 * HEPSİ `ease.out`. Farklı bölümde farklı easing KULLANMA (V4-AKIS Bölüm 1).
 * `inOut` YALNIZCA sayfa/rota perde geçişi için (simetrik gerekir).
 */
export const ease = {
  /** expo.out — cubic-bezier(0.16, 1, 0.3, 1). Site genelinde tek çıkış eğrisi. */
  out: [0.16, 1, 0.3, 1],
  /** Simetrik — YALNIZCA rota perde geçişi (RouteTransition). */
  inOut: [0.65, 0, 0.35, 1],
} as const;

/**
 * Yay (spring) ayarları.
 * `spring.*`  → `transition={...}` içinde (type alanı ile).
 * `springConfig.*` → `useSpring(value, ...)` içinde (type alanı YOK).
 */
export const spring = {
  gentle: { type: 'spring', stiffness: 220, damping: 28, mass: 0.7 },
  snappy: { type: 'spring', stiffness: 380, damping: 32, mass: 0.6 },
} as const;

export const springConfig = {
  gentle: { stiffness: 220, damping: 28, mass: 0.7 },
  snappy: { stiffness: 380, damping: 32, mass: 0.6 },
} as const;

/**
 * Süre ölçeği — SADECE üç değer (V4-AKIS Bölüm 1).
 *   fast  200ms — mikro etkileşim (hover, buton oku, alt çizgi)
 *   base  600ms — reveal, giriş/çıkış
 *   scene 1200ms — sahne düzeyi koreografi (pin geçişleri, hero)
 * `count` sayaç animasyonu için ayrı (görsel his; layout etkilemez).
 */
export const duration = {
  fast: 0.2,
  base: 0.6,
  scene: 1.2,
  count: 1.6,
} as const;

/**
 * Yer değiştirme mesafeleri (px). Reveal HER ZAMAN `revealShift` kadar
 * ALTTAN gelir — başka yön/mesafe yok (V4-AKIS Bölüm 1).
 */
export const distance = {
  revealShift: 24,
  parallax: 120,
} as const;

/** Kademeli (stagger) zamanlama — 60–80ms aralığında sabit. */
export const stagger = { step: 0.07, groupDelay: 0.04 } as const;

/** Scroll-driven reveal için viewport eşiği — bir kez, alttan %8 pay. */
export const viewportOnce = { once: true, margin: '0px 0px -8% 0px' } as const;
