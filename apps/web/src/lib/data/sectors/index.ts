import type { SectorRecord } from '../types';
import { eTicaretVePerakende } from './e-ticaret-ve-perakende';
import { enerjiVeCevre } from './enerji-ve-cevre';
import { finansVeSermayePiyasalari } from './finans-ve-sermaye-piyasalari';
import { gayrimenkulVeInsaat } from './gayrimenkul-ve-insaat';
import { saglikVeEczacilik } from './saglik-ve-eczacilik';
import { tarimVeGida } from './tarim-ve-gida';
import { teknolojiVeBilisim } from './teknoloji-ve-bilisim';
import { uretimVeSanayi } from './uretim-ve-sanayi';

/**
 * Sektör kayıtları. Her kayıt kendi dosyasında — CMS'e taşındığında bu dizin
 * yerini bir yükleyiciye bırakır, sayfa kodu değişmez.
 *
 * 8 sektör (V10, www.futuristax.com'dan doğrulandı) — önceki 7 sektör
 * varsayımı yanlıştı, bkz. docs/PROJECT-STATUS.md V10 notu.
 */
export const SECTORS: readonly SectorRecord[] = [
  teknolojiVeBilisim,
  uretimVeSanayi,
  eTicaretVePerakende,
  gayrimenkulVeInsaat,
  finansVeSermayePiyasalari,
  saglikVeEczacilik,
  tarimVeGida,
  enerjiVeCevre,
].sort((a, b) => a.order - b.order);

const BY_SLUG = new Map(SECTORS.map((s) => [s.slug, s]));

export function getSector(slug: string): SectorRecord | undefined {
  return BY_SLUG.get(slug);
}

export function sectorSlugs(): string[] {
  return SECTORS.map((s) => s.slug);
}
