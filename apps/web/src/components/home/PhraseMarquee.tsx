import { featureTriad, serviceGroups } from '@/lib/data/placeholder';

/**
 * KELİME BANDI (V6 — referans "ticker" hissi)
 *
 * Hero'dan hemen sonra sonsuz yatay kayan bir kelime şeridi. İçerik uydurma
 * DEĞİL — mevcut hizmet grupları ve yaklaşım eksenlerinin başlıkları. Tümüyle
 * dekoratif: `aria-hidden` (aynı başlıklar aşağıda bölüm olarak var), ekran
 * okuyucu bandı okumaz. `.marquee` (home.css) reduced-motion altında durur ama
 * iki kopya olduğu için görsel olarak dolu kalır.
 */
const PHRASES = [...serviceGroups.map((g) => g.title), ...featureTriad.map((f) => f.title)];

export function PhraseMarquee() {
  return (
    <section
      aria-hidden="true"
      className="section-beam relative overflow-hidden border-y border-[var(--color-rule)] py-6"
    >
      <div className="marquee marquee-slow">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {PHRASES.map((phrase) => (
              <span
                key={`${copy}-${phrase}`}
                className="flex shrink-0 items-center gap-8 px-8 font-[family-name:var(--font-display)] text-[length:var(--text-3xl)] text-[var(--color-text-muted)]"
              >
                {phrase}
                <span className="text-[var(--color-accent)]">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-canvas)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-canvas)] to-transparent" />
    </section>
  );
}
