import { SceneSection } from '@/components/home/SceneSection';
import { Counter } from '@/components/motion/Counter';
import { Reveal } from '@/components/motion/Reveal';
import { SECTORS, SERVICES } from '@/lib/data';
import { TOOLS } from '@/lib/tools';
import { site } from '@futuristax/config';

/**
 * RAKAMLAR (V4-AKIS Bölüm 2 — referans sırası #7)
 *
 * Dört sayaç, görünüre girince sayar. GERÇEK veriler — uydurma yüzde YOK:
 * kuruluş yılı, hizmet / sektör / hesaplama aracı sayısı.
 */
const plain = (n: number) => new Intl.NumberFormat('tr-TR', { useGrouping: false }).format(n);

export function StatsRow() {
  const stats = [
    { value: site.brand.foundedYear, label: 'Kuruluş yılı', fmt: plain },
    { value: SERVICES.length, label: 'Hizmet başlığı' },
    { value: SECTORS.length, label: 'Sektör' },
    { value: TOOLS.length, label: 'Hesaplama aracı' },
  ];

  return (
    <SceneSection id="rakamlar" eyebrow="Rakamlar" title="Sayılarla" backdrop="light-field">
      <Reveal>
        <dl className="grid grid-cols-2 gap-px bg-[var(--color-rule)] sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--color-canvas)] px-5 py-8">
              <dd className="font-[family-name:var(--font-display)] text-[length:var(--text-5xl)] text-[var(--color-text)]">
                <Counter value={s.value} format={s.fmt} />
              </dd>
              <dt className="mt-2 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </SceneSection>
  );
}
