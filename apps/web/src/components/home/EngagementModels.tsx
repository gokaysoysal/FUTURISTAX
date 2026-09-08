import { Bento, BentoTile } from '@/components/home/Bento';
import { SceneSection } from '@/components/home/SceneSection';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { engagementModels } from '@/lib/data/placeholder';
import Link from 'next/link';

/**
 * ÇALIŞMA MODELİ (V4-AKIS Bölüm 2 — referans sırası #9 · V6 bento)
 *
 * Referanstaki fiyat tablosunun karşılığı: üç kart, ortadaki `featured`
 * yükseltilmiş (üstte aurora şeridi + hafif kalkış). FİYAT YAZILMAZ — kapsam
 * anlatılır. Her kartta dört madde + CTA.
 */
export function EngagementModels() {
  return (
    <SceneSection
      id="calisma-modeli"
      eyebrow="Çalışma modeli"
      title="İhtiyaca göre üç biçim"
      lead="Fiyat görüşmede netleşir; burada kapsamı anlatıyoruz."
      backdrop="document-grid"
      wide
    >
      <Bento className="lg:grid-cols-3 lg:items-start">
        {engagementModels.map((m) => (
          <BentoTile
            key={m.key}
            interactive={!m.featured}
            className={
              m.featured
                ? 'overflow-hidden border-[var(--color-accent)] ring-1 ring-[var(--color-accent)] lg:-mt-4 lg:mb-4'
                : ''
            }
          >
            {m.featured ? (
              <div aria-hidden="true" className="fill-aurora -mx-6 -mt-6 mb-1 h-1.5" />
            ) : null}
            {m.featured ? (
              <p className="basis-ref text-[var(--color-accent)]">En sık tercih edilen</p>
            ) : null}
            <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">{m.title}</h3>
            <p className="text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
              {m.summary}
            </p>
            <ul className="space-y-2.5 border-t border-[var(--color-rule)] pt-5">
              {m.points.map((p) => (
                <li
                  key={p}
                  className="grid grid-cols-[auto_1fr] gap-2.5 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 rounded-full bg-[var(--color-accent)]"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <MagneticButton className="mt-auto pt-2">
              <Link
                href={m.cta.href}
                className={`btn group px-5 py-2.5 text-[length:var(--text-sm)] ${
                  m.featured ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                {m.cta.label}
                <span aria-hidden="true" className="btn-arrow">
                  →
                </span>
              </Link>
            </MagneticButton>
          </BentoTile>
        ))}
      </Bento>
    </SceneSection>
  );
}
