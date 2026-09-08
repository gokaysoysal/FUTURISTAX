import { Bento, BentoTile } from '@/components/home/Bento';
import { SceneSection } from '@/components/home/SceneSection';
import { serviceGroups } from '@/lib/data/placeholder';

/**
 * HİZMETLER (V4-AKIS Bölüm 2 — referans sırası #6 · V6 bento)
 *
 * Asimetrik bento: ilk grup (Vergi danışmanlığı) `lg`+ ekranda 2×3 kahraman
 * kutu; diğer üç grup 3. sütunda 01–04 numaralı yığın. `<lg` 2×2, base yığın.
 * Mevcut 9 hizmet dört gruba toplandı.
 */
const GROUP_ICON: Record<string, string> = {
  vergi: 'M8 32V12l12-6 12 6v20M8 22h24M20 6v26',
  denetim: 'M17 25a8 8 0 1 0-8-8M17 25l6 6M9 33l6-6',
  finans: 'M6 30h6V20H6v10Zm10 0h6V14h-6v16Zm10 0h6V24h-6v6ZM6 12l10-4 8 3 10-5',
  yapi: 'M10 34V14l10-6 10 6v20M10 24h20M20 8v26M4 34h32',
};

function GroupIcon({ path, big = false }: { path: string | undefined; big?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={`${big ? 'h-14 w-14' : 'h-9 w-9'} text-[var(--color-accent)]`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d={path} />
    </svg>
  );
}

function TileNumber({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="text-aurora font-[family-name:var(--font-display)] text-[length:var(--text-xl)] tabular-nums"
    >
      {String(n).padStart(2, '0')}
    </span>
  );
}

export function ServicesQuad() {
  const [hero, ...rest] = serviceGroups;

  return (
    <SceneSection
      id="hizmetler"
      eyebrow="Hizmetler"
      title="Dokuz hizmet, dört çalışma alanı"
      lead="Çoğu şirket bunlardan birkaçına aynı anda ihtiyaç duyar; birlikte yürürler."
      backdrop="concrete"
      wide
    >
      <Bento className="sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3">
        <BentoTile
          span="lg:col-span-2 lg:row-span-3"
          href={`/hizmetler/${hero.serviceSlugs[0]}`}
          className="lg:justify-center lg:gap-6 lg:p-10"
        >
          <div className="flex items-center justify-between">
            <GroupIcon path={GROUP_ICON[hero.key]} big />
            <TileNumber n={1} />
          </div>
          <h3 className="text-[length:var(--text-2xl)] text-[var(--color-text)]">{hero.title}</h3>
          <p className="max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
            {hero.body}
          </p>
          <span className="mt-auto pt-2 text-[length:var(--text-sm)] text-[var(--color-accent)]">
            Hizmetleri gör →
          </span>
        </BentoTile>

        {rest.map((g, i) => (
          <BentoTile key={g.key} href={`/hizmetler/${g.serviceSlugs[0]}`}>
            <div className="flex items-center justify-between">
              <GroupIcon path={GROUP_ICON[g.key]} />
              <TileNumber n={i + 2} />
            </div>
            <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">{g.title}</h3>
            <p className="text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
              {g.body}
            </p>
            <span className="mt-auto pt-2 text-[length:var(--text-xs)] text-[var(--color-accent)]">
              Hizmetleri gör
            </span>
          </BentoTile>
        ))}
      </Bento>
    </SceneSection>
  );
}
