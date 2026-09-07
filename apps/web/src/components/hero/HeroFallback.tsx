/**
 * Hero WebGL yedeği — sunucu render'lı, statik.
 *
 * Kullanıldığı yerler: prefers-reduced-motion, WebGL yok, mobil (< 768px),
 * ve `HeroScene` yüklenene kadarki `loading` durumu. Shader alanının donmuş
 * hâline görsel olarak yakın: palet renkli sıvı gradyan + grain.
 */
export function HeroFallback() {
  return (
    <div
      aria-hidden="true"
      className="scene-backdrop"
      style={{
        backgroundImage:
          'radial-gradient(120% 90% at 15% 0%, color-mix(in oklab, var(--color-accent) 26%, transparent), transparent 55%),' +
          'radial-gradient(90% 80% at 92% 100%, color-mix(in oklab, var(--color-accent-glow) 20%, transparent), transparent 55%),' +
          'linear-gradient(180deg, var(--color-canvas), var(--color-surface))',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.06,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='h'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23h)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
