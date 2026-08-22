import type { RateSet, TaxYear } from '../types';
import { rates2024 } from './2024';
import { rates2025 } from './2025';
import { rates2026 } from './2026';

const REGISTRY: Record<TaxYear, RateSet> = {
  2024: rates2024,
  2025: rates2025,
  2026: rates2026,
};

export const SUPPORTED_YEARS: readonly TaxYear[] = [2024, 2025, 2026] as const;

/** Varsayılan yıl — beyan dönemi mantığına göre UI tarafında ezilebilir. */
export const DEFAULT_YEAR: TaxYear = 2025;

export function getRates(year: TaxYear): RateSet {
  const set = REGISTRY[year];
  if (!set) throw new Error(`Desteklenmeyen vergi yılı: ${year}`);
  return set;
}

/** Doğrulanmamış bir yıl mı? UI uyarı bandı bu bayrağa bakar. */
export function isYearVerified(year: TaxYear): boolean {
  return getRates(year).provenance.verified;
}

export { rates2024, rates2025, rates2026 };
