import { SceneSection } from '@/components/home/SceneSection';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { placeholderTestimonials } from '@/lib/data/placeholder';

/**
 * REFERANSLAR (V4-AKIS Bölüm 2 — referans sırası #8)
 *
 * Üç kart. Avatar yerine soyut geometrik işaret; ad yerine
 * "Örnek Müşteri A · İmalat sektörü". Metinler YER TUTUCU — gerçek görüş
 * yalnızca yazılı izinle eklenir (src/lib/data/testimonials.ts asıl kaynak).
 */
export function TestimonialTriad() {
  return (
    <SceneSection
      id="referanslar"
      eyebrow="Referanslar"
      title="Çalışma biçimimiz nasıl karşılanıyor"
      backdrop="geometric-shadow"
    >
      <p className="mb-8 max-w-prose text-[length:var(--text-sm)] text-[var(--color-text-muted)]">
        Aşağıdaki görüşler düzen amaçlı yer tutucudur. Gerçek müşteri görüşleri yalnızca yazılı
        yayın izniyle, isimle birlikte eklenir.
      </p>
      <RevealGroup className="grid gap-6 sm:grid-cols-3">
        {placeholderTestimonials.map((t) => (
          <RevealItem key={t.key}>
            <figure className="card card-interactive surface-glow flex h-full flex-col gap-4 p-6">
              <svg
                viewBox="0 0 40 40"
                aria-hidden="true"
                className="h-10 w-10 text-[var(--color-accent)]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="7" y="7" width="26" height="26" rx="4" />
                <path d="M13 27l7-9 5 6 3-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <blockquote className="text-[length:var(--text-sm)] leading-relaxed text-[var(--color-text)]">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-auto text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
                {t.label} · {t.sector}
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </SceneSection>
  );
}
