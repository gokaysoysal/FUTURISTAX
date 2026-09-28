import { Bento, BentoTile } from '@/components/home/Bento';
import { SceneSection } from '@/components/home/SceneSection';
import { publishableTestimonials } from '@/lib/data';

/**
 * REFERANSLAR (V4-AKIS Bölüm 2 — referans sırası #8 · V6 bento)
 *
 * Asimetrik: ilk görüş `lg`+ ekranda 2×2 geniş alıntı (büyük tip); diğer ikisi
 * 3. sütunda yığılı. Avatar yerine soyut geometrik işaret.
 *
 * V10: GERÇEK, yazılı yayın izinli görüşler (`lib/data/testimonials.ts`) —
 * "Örnek Müşteri A" yer tutucularının yerini aldı.
 */
const MARK = (
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
);

export function TestimonialTriad() {
  const testimonials = publishableTestimonials();
  const hero = testimonials[0];
  if (!hero) return null;
  const rest = testimonials.slice(1);

  return (
    <SceneSection
      id="referanslar"
      eyebrow="Referanslar"
      title="Çalışma biçimimiz nasıl karşılanıyor"
      backdrop="geometric-shadow"
      wide
    >
      <Bento className="lg:grid-cols-3 lg:grid-rows-2">
        <BentoTile
          as="figure"
          span="lg:col-span-2 lg:row-span-2"
          className="lg:justify-center lg:p-10"
        >
          {MARK}
          <blockquote className="text-[length:var(--text-xl)] leading-relaxed text-[var(--color-text)]">
            “{hero.quote}”
          </blockquote>
          <figcaption className="mt-auto text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
            {hero.authorName} · {hero.authorTitle}
            {hero.company ? `, ${hero.company}` : ''}
          </figcaption>
        </BentoTile>

        {rest.map((t) => (
          <BentoTile key={t.slug} as="figure">
            {MARK}
            <blockquote className="text-[length:var(--text-sm)] leading-relaxed text-[var(--color-text)]">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-auto text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
              {t.authorName} · {t.authorTitle}
              {t.company ? `, ${t.company}` : ''}
            </figcaption>
          </BentoTile>
        ))}
      </Bento>
    </SceneSection>
  );
}
