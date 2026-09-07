import { SceneSection } from '@/components/home/SceneSection';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { serviceGroups } from '@/lib/data/placeholder';
import Link from 'next/link';

/**
 * HİZMETLER (V4-AKIS Bölüm 2 — referans sırası #6)
 * Dört kart, vektör görselli. Mevcut 9 hizmet dört gruba toplandı.
 */
const GROUP_ICON: Record<string, string> = {
  vergi: 'M8 32V12l12-6 12 6v20M8 22h24M20 6v26',
  denetim: 'M17 25a8 8 0 1 0-8-8M17 25l6 6M9 33l6-6',
  finans: 'M6 30h6V20H6v10Zm10 0h6V14h-6v16Zm10 0h6V24h-6v6ZM6 12l10-4 8 3 10-5',
  yapi: 'M10 34V14l10-6 10 6v20M10 24h20M20 8v26M4 34h32',
};

export function ServicesQuad() {
  return (
    <SceneSection
      id="hizmetler"
      eyebrow="Hizmetler"
      title="Dokuz hizmet, dört çalışma alanı"
      lead="Çoğu şirket bunlardan birkaçına aynı anda ihtiyaç duyar; birlikte yürürler."
      backdrop="concrete"
    >
      <RevealGroup className="grid gap-px bg-[var(--color-rule)] sm:grid-cols-2">
        {serviceGroups.map((g) => (
          <RevealItem key={g.key} className="bg-[var(--color-canvas)]">
            <Link
              href={`/hizmetler/${g.serviceSlugs[0]}`}
              className="card card-interactive surface-glow flex h-full flex-col gap-4 p-6"
            >
              <svg
                viewBox="0 0 40 40"
                aria-hidden="true"
                className="h-10 w-10 text-[var(--color-accent)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <path d={GROUP_ICON[g.key]} />
              </svg>
              <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">{g.title}</h3>
              <p className="text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                {g.body}
              </p>
              <span className="mt-auto pt-2 text-[length:var(--text-xs)] text-[var(--color-accent)]">
                Hizmetleri gör
              </span>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </SceneSection>
  );
}
