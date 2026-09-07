import { SceneSection } from '@/components/home/SceneSection';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { engagementModels } from '@/lib/data/placeholder';
import Link from 'next/link';

/**
 * ÇALIŞMA MODELİ (V4-AKIS Bölüm 2 — referans sırası #9)
 *
 * Referanstaki fiyat tablosunun karşılığı: aynı görsel düzen, üç kart, ortadaki
 * öne çıkarılmış. FİYAT YAZILMAZ — kapsam anlatılır. Her kartta dört madde + CTA.
 */
export function EngagementModels() {
  return (
    <SceneSection
      id="calisma-modeli"
      eyebrow="Çalışma modeli"
      title="İhtiyaca göre üç biçim"
      lead="Fiyat görüşmede netleşir; burada kapsamı anlatıyoruz."
      backdrop="document-grid"
    >
      <RevealGroup className="grid gap-6 lg:grid-cols-3">
        {engagementModels.map((m) => (
          <RevealItem key={m.key}>
            <article
              className={`card surface-glow flex h-full flex-col p-6 ${
                m.featured
                  ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                  : 'card-interactive'
              }`}
            >
              {m.featured ? (
                <p className="basis-ref mb-3 text-[var(--color-accent)]">En sık tercih edilen</p>
              ) : null}
              <h3 className="text-[length:var(--text-lg)] text-[var(--color-text)]">{m.title}</h3>
              <p className="mt-2 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                {m.summary}
              </p>
              <ul className="mt-5 space-y-2.5 border-t border-[var(--color-rule)] pt-5">
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
              <MagneticButton className="mt-6">
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
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </SceneSection>
  );
}
