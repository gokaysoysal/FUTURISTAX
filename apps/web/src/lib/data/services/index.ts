import type { ServiceRecord } from '../types';
import { finansalDanismanlik } from './finansal-danismanlik';
import { kurumsalRaporlama } from './kurumsal-raporlama';
import { mevzuatUyumu } from './mevzuat-uyumu';
import { sgkVeIsciMevzuati } from './sgk-ve-isci-mevzuati';
import { stratejikYapilandirma } from './stratejik-yapilandirma';
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
  stratejikYapilandirma,
  uluslararasiVergilendirme,
  sgkVeIsciMevzuati,
  yatirimTesvikYonetimi,
].sort((a, b) => a.order - b.order);

const BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));

export function getService(slug: string): ServiceRecord | undefined {
  return BY_SLUG.get(slug);
}

export function serviceSlugs(): string[] {
  return SERVICES.map((s) => s.slug);
}
