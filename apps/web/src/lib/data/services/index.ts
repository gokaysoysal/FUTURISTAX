import type { ServiceRecord } from '../types';
import { bagimsizDenetimDestegi } from './bagimsiz-denetim-destegi';
import { finansalDanismanlik } from './finansal-danismanlik';
import { kurumsalRaporlama } from './kurumsal-raporlama';
import { kurumsalYapilandirma } from './kurumsal-yapilandirma';
import { mevzuatUyumu } from './mevzuat-uyumu';
import { uluslararasiVergilendirme } from './uluslararasi-vergilendirme';
import { vergiDanismanligi } from './vergi-danismanligi';
import { vergiDenetimi } from './vergi-denetimi';
import { yatirimTesvikYonetimi } from './yatirim-tesvik-yonetimi';

/**
 * Hizmet kayıtları. Her kayıt kendi dosyasında — CMS'e taşındığında bu dizin
 * yerini bir yükleyiciye bırakır, sayfa kodu değişmez.
 */
export const SERVICES: readonly ServiceRecord[] = [
  vergiDanismanligi,
  vergiDenetimi,
  finansalDanismanlik,
  mevzuatUyumu,
  kurumsalRaporlama,
  uluslararasiVergilendirme,
  kurumsalYapilandirma,
  yatirimTesvikYonetimi,
  bagimsizDenetimDestegi,
].sort((a, b) => a.order - b.order);

const BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));

export function getService(slug: string): ServiceRecord | undefined {
  return BY_SLUG.get(slug);
}

export function serviceSlugs(): string[] {
  return SERVICES.map((s) => s.slug);
}
