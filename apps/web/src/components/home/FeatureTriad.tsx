import { SceneSection } from '@/components/home/SceneSection';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { featureTriad } from '@/lib/data/placeholder';
import type { ReactNode } from 'react';

/**
 * ÖZELLİKLER (V4-AKIS Bölüm 2 — referans sırası #4)
 * Üç kart: görsel + başlık + kısa açıklama. Vergi planlaması / Mevzuat uyumu /
 * Risk analizi.
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

export function FeatureTriad() {
  return (
    <SceneSection
      id="ozellikler"
      eyebrow="Yaklaşım"
      title="Vergi işini üç eksende sağlamlaştırırız"
      backdrop="geometric-shadow"
    >
      <RevealGroup className="grid gap-px bg-[var(--color-rule)] sm:grid-cols-3">
        {featureTriad.map((f) => (
          <RevealItem key={f.key} className="bg-[var(--color-canvas)]">
            <article className="card card-interactive surface-glow flex h-full flex-col gap-4 p-6">
              <svg
                viewBox="0 0 40 40"
                aria-hidden="true"
                className="h-10 w-10 text-[var(--color-accent)]"
              >
                {ICONS[f.key]}
              </svg>
              <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">{f.title}</h3>
              <p className="text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                {f.body}
              </p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </SceneSection>
  );
}
