import type { SectorRecord } from '../types';
import { bilisimVeYazilim } from './bilisim-ve-yazilim';
import { hizmetVeDanismanlik } from './hizmet-ve-danismanlik';
import { imalat } from './imalat';
import { insaatVeGayrimenkul } from './insaat-ve-gayrimenkul';
import { lojistik } from './lojistik';
import { perakendeVeETicaret } from './perakende-ve-e-ticaret';
import { saglik } from './saglik';

/**
 * Sektör kayıtları. Her kayıt kendi dosyasında — CMS'e taşındığında bu dizin
 * yerini bir yükleyiciye bırakır, sayfa kodu değişmez.
 */
export const SECTORS: readonly SectorRecord[] = [
  imalat,
  insaatVeGayrimenkul,
  bilisimVeYazilim,
  saglik,
  perakendeVeETicaret,
  lojistik,
  hizmetVeDanismanlik,
].sort((a, b) => a.order - b.order);

const BY_SLUG = new Map(SECTORS.map((s) => [s.slug, s]));

export function getSector(slug: string): SectorRecord | undefined {
  return BY_SLUG.get(slug);
}

export function sectorSlugs(): string[] {
  return SECTORS.map((s) => s.slug);
}
