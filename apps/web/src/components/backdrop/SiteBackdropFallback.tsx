/**
 * Site geneli arka plan — statik yedek (V5 Bölüm 2 / Bölüm 6).
 *
 * Kullanıldığı yerler: prefers-reduced-motion, WebGL yok, düşük performanslı
 * cihaz, ve `SiteBackdropScene` yüklenene kadarki `loading` durumu.
 * Sunucu render'lı, hareketsiz: palet renkli yumuşak ışık + ince gren.
 * Konumu `SiteBackdrop`'un sabit sarmalayıcısından gelir — burada `absolute`.
 */
export function SiteBackdropFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          'radial-gradient(90% 60% at 12% -10%, color-mix(in oklab, var(--color-accent) 20%, transparent), transparent 60%),' +
          'radial-gradient(80% 60% at 100% 108%, color-mix(in oklab, var(--color-accent-glow) 14%, transparent), transparent 62%),' +
          'linear-gradient(180deg, var(--color-canvas), var(--color-canvas))',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.05,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='sb'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sb)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
