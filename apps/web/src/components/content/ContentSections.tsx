import type { ContentSection } from '@/lib/data';

/**
 * Hizmet ve sektör kayıtlarının `sections` alanını defter düzeninde render eder.
 * Her bölüm bir alt başlık ve bir paragraf taşır.
 */
export function ContentSections({ sections }: { sections: readonly ContentSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="mb-2 text-[length:var(--text-xl)] text-[var(--color-text)]">
            {section.heading}
          </h2>
          <p className="max-w-prose text-[length:var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
            {section.body}
          </p>
        </section>
      ))}
    </div>
  );
}
