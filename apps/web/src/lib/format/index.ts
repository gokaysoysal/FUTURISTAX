import type { CalculationStep } from '@futuristax/tax-engine';

/**
 * Biçimlendirme yardımcıları.
 *
 * Tüm parasal ve oransal gösterim buradan geçer; bileşenler kendi
 * `toLocaleString` çağrılarını yapmaz. Böylece biçim tek yerden değişir.
 */

const TRY = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const PERCENT = new Intl.NumberFormat('tr-TR', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const PLAIN = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });

export const formatCurrency = (value: number) => TRY.format(value);
export const formatPercent = (value: number) => PERCENT.format(value);
export const formatNumber = (value: number) => PLAIN.format(value);

export function formatByKind(value: number, kind: CalculationStep['kind']): string {
  switch (kind) {
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    default:
      return formatNumber(value);
  }
}

const LONG_DATE = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatIsoDate(iso: string): string {
  return LONG_DATE.format(new Date(`${iso}T00:00:00Z`));
}

/** "3 gün kaldı" / "bugün son gün" gibi insan okunur ifade */
export function formatDaysRemaining(days: number): string {
  if (days === 0) return 'Bugün son gün';
  if (days === 1) return 'Yarın son gün';
  return `${days} gün kaldı`;
}
