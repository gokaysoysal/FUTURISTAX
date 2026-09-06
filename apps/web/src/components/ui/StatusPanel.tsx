import type { ReactNode } from 'react';

/**
 * Boş ve hata durumları için tek görsel dil.
 *
 * Boş durum bir yön göstergesidir, mood değil: ne olduğunu söyler, gerekiyorsa
 * nereye gidileceğini gösterir. Hata durumu suçlamaz; ne olduğunu ve ne
 * yapılacağını söyler. İkisi de "mali belge" motifini (tasdik kenarı) taşır.
 */
export function StatusPanel({
  tone = 'info',
  label,
  title,
  children,
  action,
}: {
  tone?: 'info' | 'error' | 'empty';
  /** Küçük mono etiket; verilmezse tona göre seçilir */
  label?: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  const accent =
    tone === 'error'
      ? 'border-l-[var(--color-stamp)]'
      : tone === 'empty'
        ? 'border-l-[var(--color-rule-strong)]'
        : 'border-l-[var(--color-ink-strong)]';

  const defaultLabel = tone === 'error' ? 'Durum' : tone === 'empty' ? 'Boş' : 'Bilgi';

  return (
    <div
      role={tone === 'error' ? 'note' : undefined}
      className={`border border-[var(--color-rule)] border-l-2 ${accent} bg-[var(--color-surface)] p-6`}
    >
      <p className="basis-ref uppercase">{label ?? defaultLabel}</p>
      <p
        className={`mt-1 text-[length:var(--text-base)] ${
          tone === 'error' ? 'text-[var(--color-stamp)]' : 'text-[var(--color-text)]'
        }`}
      >
        {title}
      </p>
      {children ? (
        <div className="mt-2 max-w-prose text-[length:var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
          {children}
        </div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
