import { SceneRegion } from '@/components/backdrop/SceneRegion';
import { SceneSection } from '@/components/home/SceneSection';
import { Counter } from '@/components/motion/Counter';
import { Reveal } from '@/components/motion/Reveal';
import { SECTORS, SERVICES } from '@/lib/data';
import { TOOLS } from '@/lib/tools';
import { site } from '@futuristax/config';

/**
 * RAKAMLAR (V4-AKIS Bölüm 2 — referans sırası #7 · V6 bento)
 *
 * Dört gevşek hücre yerine tek yükseltilmiş pano (`card surface-glow`), içeride
 * hairline ızgara; kuruluş yılı görsel vurgulu. Sayaçlar görünüre girince sayar.
 * GERÇEK veriler — uydurma yüzde YOK.
 *
 * NOT: Sunucu bileşeni → `Counter`'a FONKSİYON geçilemez (RSC sınırı);
 * yıl için binlik ayırıcı `groupless` bayrağıyla kapatılır.
 */
export function StatsRow() {
  const stats: { value: number; label: string; groupless?: boolean }[] = [
    { value: site.brand.foundedYear, label: "2013'ten beri", groupless: true },
    { value: SERVICES.length, label: 'Hizmet başlığı' },
    { value: SECTORS.length, label: 'Sektör' },
    { value: TOOLS.length, label: 'Hesaplama aracı' },
  ];

  return (
    <SceneSection id="rakamlar" eyebrow="Rakamlar" title="Sayılarla" backdrop="light-field" wide>
      <SceneRegion tone={0.72} density={0.48} depth={0.72} flow={0.36} />
      <Reveal>
        <div className="card surface-glow overflow-hidden">
          <dl className="grid grid-cols-2 gap-px bg-[var(--color-rule)] lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className="bg-[var(--color-surface-lift)] p-6 lg:p-8">
                <dd
                  className={`font-[family-name:var(--font-display)] text-[var(--color-text)] ${
                    i === 0 ? 'text-[length:var(--text-6xl)]' : 'text-[length:var(--text-5xl)]'
                  }`}
                >
                  <Counter value={s.value} groupless={s.groupless} />
                </dd>
                <dt
                  className={`mt-2 text-[length:var(--text-sm)] ${
                    i === 0 ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </SceneSection>
  );
}
