import { formatCurrency, formatPercent } from '@/lib/format';

/**
 * Hesaplayıcı sonucunun görsel kırılımı — bir bütünü oluşturan parçalar.
 *
 * Genel amaçlı DEĞİL: her hesaplayıcı kendi `segments`'ini kendi `detail`'inden
 * kurar (KDV'de matrah/vergi; binek araçta indirilebilir/KKEG; SGK'da işveren
 * maliyeti kırılımı…). Burada yalnızca ortak çizim var, veri araca özel.
 *
 * Erişilebilirlik: tümüyle `aria-hidden`. Veri karşılığı, `ResultLedger`
 * içindeki `steps` tablosudur (her zaman DOM'da, sr-only). Bu bileşen o
 * tablonun görsel eşleniği; klavye/okuyucu ondan okur.
 */
export type LedgerSegment = {
  label: string;
  value: number;
  tone?: 'accent' | 'warning' | 'positive' | 'muted';
};

const TONE_VAR: Record<NonNullable<LedgerSegment['tone']>, string> = {
  accent: 'var(--color-accent)',
  warning: 'var(--color-signal)',
  positive: 'var(--color-positive)',
  muted: 'var(--color-text-muted)',
};

export function LedgerChart({
  segments,
  caption,
}: {
  segments: readonly LedgerSegment[];
  /** Grafik ne gösteriyor — görsel başlık (sr için tablo yeterli). */
  caption: string;
}) {
  const parts = segments.filter((s) => Number.isFinite(s.value) && s.value > 0);
  const total = parts.reduce((sum, s) => sum + s.value, 0);
  if (parts.length < 2 || total <= 0) return null;

  return (
    <figure aria-hidden="true" className="border-t border-[var(--color-rule)] px-5 py-4">
      <figcaption className="basis-ref mb-3 normal-case">{caption}</figcaption>

      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-rule)]">
        {parts.map((s) => (
          <span
            key={s.label}
            className="block h-full"
            style={{
              width: `${(s.value / total) * 100}%`,
              backgroundColor: TONE_VAR[s.tone ?? 'accent'],
            }}
          />
        ))}
      </div>

      <ul className="mt-3 space-y-1.5">
        {parts.map((s) => (
          <li
            key={s.label}
            className="flex items-baseline justify-between gap-3 text-[length:var(--text-xs)]"
          >
            <span className="flex items-center gap-2 text-[var(--color-text-secondary)]">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: TONE_VAR[s.tone ?? 'accent'] }}
              />
              {s.label}
            </span>
            <span data-numeric className="text-[var(--color-text-secondary)]">
              {formatPercent(s.value / total)} · {formatCurrency(s.value)}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
