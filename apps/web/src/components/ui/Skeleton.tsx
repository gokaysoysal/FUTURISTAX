import type { CSSProperties } from 'react';

/**
 * İskelet (skeleton) yükleme bloğu — spinner yerine.
 *
 * Görsel sweep `.skeleton` (depth.css) içinde, yalnızca `transform`.
 * prefers-reduced-motion altında sweep durur (global kural + açık @media).
 * Dekoratif: `aria-hidden`. Yüklenen bölge ayrıca `aria-busy` taşımalı.
 */
export function Skeleton({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return <div className={`skeleton ${className}`.trim()} style={style} aria-hidden="true" />;
}

/** Metin satırları için hazır iskelet grubu. */
export function SkeletonText({
  lines = 3,
  className = '',
}: { lines?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: sabit uzunluklu, sırası değişmeyen iskelet çizgileri
        <Skeleton key={i} style={{ height: '0.85rem', width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  );
}
