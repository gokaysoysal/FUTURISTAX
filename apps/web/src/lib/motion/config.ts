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

/** cubic-bezier easing eğrileri (motion `ease` alanı number[] kabul eder). */
export const ease = {
  /** Yumuşak çıkış — reveal, giriş, sayaç. */
  out: [0.22, 1, 0.36, 1],
  /** Simetrik — sayfa/rota geçişi. */
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

/** Saniye cinsinden süreler. */
export const duration = {
  fast: 0.18,
  base: 0.32,
  slow: 0.5,
  count: 1.1,
} as const;

/** Piksel cinsinden yer değiştirme mesafeleri. */
export const distance = {
  sm: 6,
  md: 12,
  lg: 24,
} as const;

/** Kademeli (stagger) zamanlama. */
export const stagger = { step: 0.06, groupDelay: 0.04 } as const;

/** Scroll-driven reveal için viewport eşiği — bir kez, alttan %8 pay. */
export const viewportOnce = { once: true, margin: '0px 0px -8% 0px' } as const;
