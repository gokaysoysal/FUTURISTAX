import { FaqJsonLd } from '@/components/seo/JsonLd';
import type { Faq } from '@/lib/data';

/**
 * SSS bölümü — tanım listesi (dl) olarak.
 *
 * `withSchema` yalnızca sayfada TEK bir FAQPage şeması olması için kullanılır:
 * birden fazla kategori render edilirken şema sayfa düzeyinde ayrıca verilir.
 */
export function FaqSection({
  items,
  heading = 'Sık sorulan sorular',
  withSchema = true,
}: {
  items: readonly Faq[];
  heading?: string;
  withSchema?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <section aria-label={heading}>
      {withSchema ? (
        <FaqJsonLd
          items={items.map((item) => ({ question: item.question, answer: item.answer }))}
        />
      ) : null}
      <h2 className="text-[length:var(--text-xl)] text-[var(--color-text)]">{heading}</h2>
      <dl className="mt-5 divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
        {items.map((item) => (
          <div key={item.question} className="py-4">
            <dt className="text-[length:var(--text-sm)] font-medium text-[var(--color-text)]">
              {item.question}
            </dt>
            <dd className="mt-2 max-w-prose text-[length:var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
