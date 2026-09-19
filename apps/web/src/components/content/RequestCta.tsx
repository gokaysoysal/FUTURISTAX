import { MagneticButton } from '@/components/motion/MagneticButton';
import Link from 'next/link';

/**
 * "Görüşme talep et" çağrısı. Platformun tek işi nitelikli danışmanlık talebi
 * üretmek olduğu için her içerik sayfasının altında yer alır.
 */
export function RequestCta({
  title = 'İlk görüşme ücretsizdir',
  body = 'Mevcut vergi yapınızı, risk alanlarınızı ve optimizasyon fırsatlarınızı birlikte değerlendirelim. Görüşme yüz yüze ya da çevrim içi yapılabilir.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section
      aria-label="Danışmanlık talebi"
      className="border border-[var(--color-rule)] bg-[var(--color-surface)] p-8 sm:p-12"
    >
      <h2 className="text-[length:var(--text-2xl)]">{title}</h2>
      <p className="mt-3 max-w-prose text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
        {body}
      </p>
      <MagneticButton className="mt-6">
        <Link
          href="/iletisim"
          className="btn btn-primary group px-6 py-3 text-[length:var(--text-sm)]"
        >
          Görüşme talep et
          <span aria-hidden="true" className="btn-arrow">
            →
          </span>
        </Link>
      </MagneticButton>
    </section>
  );
}
