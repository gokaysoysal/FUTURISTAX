import { UnverifiedRatesNotice } from '@/components/ui/UnverifiedRatesNotice';
import { formatByKind } from '@/lib/format';
import { site } from '@futuristax/config';
import type { CalculationResult } from '@futuristax/tax-engine';

/**
 * Hesap sonucunu defter düzeninde gösterir.
 *
 * Tasarım kararı: sadece sonucu değil, hesabın nasıl çıktığını gösteriyoruz.
 * Bir danışmanlık markasında asıl değer budur — kullanıcı hangi kalemin nereden
 * geldiğini görür, hangi kanun maddesine dayandığını okur. Rakip hesaplayıcılar
 * tek bir sayı verip kapatır.
 */

const EMPHASIS_COLOR = {
  positive: 'text-[var(--color-approved)]',
  warning: 'text-[var(--color-stamp)]',
  neutral: 'text-[var(--color-text)]',
} as const;

export function ResultLedger<T>({ result }: { result: CalculationResult<T> }) {
  return (
    <div className="border border-[var(--color-rule)] bg-[var(--color-surface)]">
      <div className="flex items-baseline justify-between gap-4 border-b border-[var(--color-rule)] px-5 py-4">
        <span className="text-[length:var(--text-xs)] uppercase tracking-wide text-[var(--color-text-secondary)]">
          {result.headline.label}
        </span>
        <span
          data-numeric
          className="font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] text-[var(--color-text)]"
        >
          {formatByKind(result.headline.value, result.headline.kind)}
        </span>
      </div>

      <table className="w-full border-collapse">
        <caption className="sr-only">Hesaplama adımları ve yasal dayanakları</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Kalem</th>
            <th scope="col">Tutar</th>
          </tr>
        </thead>
        <tbody>
          {result.steps.map((step) => (
            <tr key={step.label} className="ledger-rule last:border-b-0">
              <th
                scope="row"
                className="px-5 py-2.5 text-left align-top font-normal text-[length:var(--text-sm)] text-[var(--color-text-secondary)]"
              >
                {step.label}
                {step.basis ? <span className="basis-ref ml-2">{step.basis}</span> : null}
              </th>
              <td
                data-numeric
                className={`px-5 py-2.5 text-right text-[length:var(--text-sm)] ${
                  EMPHASIS_COLOR[step.emphasis ?? 'neutral']
                }`}
              >
                {formatByKind(step.value, step.kind)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-3 border-t border-[var(--color-rule)] px-5 py-4">
        <UnverifiedRatesNotice provenance={result.provenance} />
        <p className="text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          {site.disclaimers.calculator.tr}
        </p>
      </div>
    </div>
  );
}
