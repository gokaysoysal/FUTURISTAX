import { Bento, BentoTile } from '@/components/home/Bento';
import { SceneSection } from '@/components/home/SceneSection';
import { featureTriad } from '@/lib/data/placeholder';
import type { ReactNode } from 'react';

/**
 * ÖZELLİKLER (V4-AKIS Bölüm 2 — referans sırası #4 · V6 bento)
 *
 * Asimetrik: ilk eksen (Vergi planlaması) `lg`+ ekranda solda tam boy kahraman
 * kutu; Mevzuat uyumu / Risk analizi sağda yığılı. `<lg` yığın.
 */
const ICONS: Record<string, ReactNode> = {
  planlama: (
    <path
      d="M6 30h6v-8H6v8Zm10 0h6V16h-6v14Zm10 0h6V10h-6v20Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinejoin="round"
    />
  ),
  uyum: (
    <path
      d="M20 6 8 11v9c0 8 5 12 12 15 7-3 12-7 12-15v-9L20 6Zm-3 15 3 3 6-7"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  ),
  risk: (
    <g stroke="currentColor" strokeWidth="2" fill="none">
      <circle cx="20" cy="20" r="13" />
      <path d="M20 20 30 12" strokeLinecap="round" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </g>
  ),
};

function Icon({ k, big = false }: { k: string; big?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className={`${big ? 'h-14 w-14' : 'h-10 w-10'} text-[var(--color-accent)]`}
    >
      {ICONS[k]}
    </svg>
  );
}

export function FeatureTriad() {
  const [hero, ...rest] = featureTriad;

  return (
    <SceneSection
      id="ozellikler"
      eyebrow="Yaklaşım"
      title="Vergi işini üç eksende sağlamlaştırırız"
      backdrop="geometric-shadow"
      wide
    >
      <Bento className="lg:grid-cols-[1.5fr_1fr] lg:grid-rows-2">
        <BentoTile span="lg:row-span-2" className="lg:justify-center lg:gap-6 lg:p-10">
          <Icon k={hero.key} big />
          <h3 className="text-[length:var(--text-2xl)] text-[var(--color-text)]">{hero.title}</h3>
          <p className="max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
            {hero.body}
          </p>
        </BentoTile>

        {rest.map((f) => (
          <BentoTile key={f.key}>
            <Icon k={f.key} />
            <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">{f.title}</h3>
            <p className="text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
              {f.body}
            </p>
          </BentoTile>
        ))}
      </Bento>
    </SceneSection>
  );
}
