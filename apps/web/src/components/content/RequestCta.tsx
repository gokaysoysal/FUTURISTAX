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
      <Link
        href="/iletisim"
        className="mt-6 inline-block bg-[var(--color-ink)] px-6 py-3 text-[length:var(--text-sm)] font-medium text-white hover:bg-[var(--color-ink-strong)]"
      >
        Görüşme talep et
      </Link>
    </section>
  );
}
