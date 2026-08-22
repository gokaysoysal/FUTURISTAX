'use client';

import { site } from '@futuristax/config';
import { useEffect } from 'react';

/**
 * Hata sınırı. Özür dilemez; ne olduğunu ve ne yapılacağını söyler.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO(aşama-3): Sentry.captureException(error)
    console.error('[boundary]', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-24">
      <p className="basis-ref uppercase">Hata</p>
      <h1 className="mt-3 text-[length:var(--text-3xl)]">Sayfa yüklenemedi</h1>
      <p className="mt-4 text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
        Bu sayfayı hazırlarken bir sorun oluştu. Yeniden denemek çoğu durumda yeterli
        oluyor. Sorun sürerse bize ulaşın.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="bg-[var(--color-ink)] px-6 py-3 text-[length:var(--text-sm)] font-medium text-white hover:bg-[var(--color-ink-strong)]"
        >
          Yeniden dene
        </button>
        <a
          href={`mailto:${site.contact.email}`}
          className="border border-[var(--color-rule-strong)] px-6 py-3 text-[length:var(--text-sm)] text-[var(--color-text)] hover:border-[var(--color-ink)]"
        >
          Bize bildir
        </a>
      </div>

      {error.digest && <p className="basis-ref mt-6">Hata kodu: {error.digest}</p>}
    </div>
  );
}
