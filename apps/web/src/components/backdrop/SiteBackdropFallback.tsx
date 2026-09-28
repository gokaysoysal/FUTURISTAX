/**
 * Site geneli arka plan — statik CSS yedeği (V11, docs/V11-SAHNE-PROMPT.md
 * Bölüm 6).
 *
 * Kullanıldığı yerler: WebGL yok, düşük performanslı cihaz, ve
 * `SiteBackdropScene` yüklenene kadarki `loading` durumu (`SiteBackdrop`
 * karar katmanı; ayrıca gerçek WebGL sahnesi de `prefers-reduced-motion`
 * altında `settleScene` ile TEK kare çiziyor — bu bileşen o karar mantığının
 * DIŞINDA, saf CSS). `--scene-*` tokenlarıyla (docs/qa/palet.md) gerçek
 * shader'ın panel + gren + vinyet izlenimini `repeating-linear-gradient` ile
 * taklit eder; küre/scroll hareketi yok (statik).
 */
export function SiteBackdropFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ backgroundColor: 'var(--scene-ground-dark)' }}
    >
      {/* Oluklu panel — genişliğin ~%47,4'ünde sert kenarla biter (Bölüm 1). */}
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: '47.4%',
          backgroundImage: `repeating-linear-gradient(
            to right,
            var(--scene-groove-dark) 0,
            var(--scene-groove-dark) 3px,
            color-mix(in srgb, var(--scene-ground-dark) 70%, var(--scene-ground-bright)) 3px,
            color-mix(in srgb, var(--scene-ground-dark) 70%, var(--scene-ground-bright)) clamp(22px, 2.55vw, 60px)
          )`,
        }}
      />
      {/* Düz duvar — panelin sağı, yumuşak azur ışık kaynağı huzmesi. */}
      <div
        className="absolute inset-y-0 right-0"
        style={{
          width: '52.6%',
          backgroundImage:
            'radial-gradient(120% 90% at 85% 10%, color-mix(in srgb, var(--scene-edge-light) 22%, transparent), transparent 60%),' +
            'linear-gradient(180deg, var(--scene-ground-dark), color-mix(in srgb, var(--scene-ground-dark) 55%, var(--scene-ground-bright)))',
        }}
      />
      {/* Film greni. */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.06,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='sb'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23sb)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Vinyet — güçlü, sinematik (Bölüm 1). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(120% 100% at 50% 45%, transparent 45%, color-mix(in srgb, var(--scene-groove-dark) 55%, transparent) 100%)',
        }}
      />
    </div>
  );
}
