import { binekAracGiderKisiti } from './binek-arac-gider-kisiti';
import { binekAracKiraSiniri } from './binek-arac-kira-siniri';
import { gelirVergisi } from './gelir-vergisi';
import { kdv } from './kdv';
import { kidemTazminati } from './kidem-tazminati';
import { kurCevirici } from './kur-cevirici';
import { kurumlarVergisi } from './kurumlar-vergisi';
import { sgkIsverenMaliyeti } from './sgk-isveren-maliyeti';
import { tufeGuncelleme } from './tufe-guncelleme';
import type { ToolMeta } from './types';

export type { ToolMeta } from './types';

export const TOOLS: readonly ToolMeta[] = [
  kdv,
  gelirVergisi,
  kurumlarVergisi,
  binekAracGiderKisiti,
  binekAracKiraSiniri,
  sgkIsverenMaliyeti,
  kidemTazminati,
  tufeGuncelleme,
  kurCevirici,
].sort((a, b) => a.order - b.order);

const BY_SLUG = new Map(TOOLS.map((tool) => [tool.slug, tool]));

export function getTool(slug: string): ToolMeta | undefined {
  return BY_SLUG.get(slug);
}

export function toolSlugs(): string[] {
  return TOOLS.map((tool) => tool.slug);
}
