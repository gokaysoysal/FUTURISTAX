/**
 * Soyut marka işaretleri — logo şeridi ve referans kartları için.
 *
 * GERÇEK şirket logosu KULLANILMAZ (telif + V4-AKIS "üç istisna"). Bunlar
 * palet tokenlı, anlamı olmayan geometrik SVG'ler; `aria-hidden`.
 */
import type { ReactElement } from 'react';

type MarkProps = { className?: string };

const marks: ((p: MarkProps) => ReactElement)[] = [
  ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M24 4v10M24 34v10M4 24h10M34 24h10" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <rect x="8" y="8" width="14" height="14" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="26" width="14" height="14" fill="currentColor" opacity="0.7" />
      <path d="M22 15h9v9" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <path d="M24 6 42 38H6L24 6Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="28" r="4" fill="currentColor" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <path d="M12 6h20l6 8-6 8H12l-6-8 6-8Z" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 26h20l6 8-6 8H12l-6-8 6-8Z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <path d="M6 34c8 0 8-20 18-20s10 20 18 20" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="14" r="3" fill="currentColor" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <rect x="7" y="7" width="34" height="34" rx="6" stroke="currentColor" strokeWidth="2" />
      <path d="M7 24h34M24 7v34" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <circle cx="16" cy="24" r="9" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="24" r="9" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    </svg>
  ),
  ({ className }) => (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <path d="M10 38V10l14 10 14-10v28" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
];

export const BRAND_MARK_COUNT = marks.length;

export function BrandMark({ index, className }: { index: number; className?: string }) {
  const Mark = marks[index % marks.length];
  return Mark ? <Mark className={className} /> : null;
}
