import { type Deadline, getUpcomingDeadlines, type TaxpayerType } from '@futuristax/tax-engine';
import { formatDaysRemaining, formatIsoDate } from '@/lib/format';

/**
 * VERGİ TAKVİMİ — sitenin imza bileşeni.
 *
 * Neden bu: rakip danışmanlık siteleri hero'da soyut sloganlar gösteriyor.
 * Bu panel ziyaretçinin gerçekten ihtiyacı olan tek şeyi verir — bir sonraki
 * beyanname ne zaman. Faydadan gelen ayırt edicilik, süslemeden gelen değil.
 *
 * Sunucuda render edilir: referans tarih sunucudan geçirilir, bileşen saat
 * okumaz. Böylece hydration uyuşmazlığı olmaz ve motor deterministik kalır.
 */

interface Props {
  /** Sunucudan geçirilen referans tarih, ISO (YYYY-MM-DD) */
  referenceDate: string;
  taxpayerType?: TaxpayerType;
  horizonDays?: number;
  limit?: number;
}

const URGENCY_STYLES: Record<Deadline['urgency'], { dot: string; text: string; label: string }> = {
  imminent: {
    dot: 'bg-[var(--color-stamp)]',
    text: 'text-[var(--color-stamp)]',
    label: 'Son günler',
  },
  soon: {
    dot: 'bg-[var(--color-ink)]',
    text: 'text-[var(--color-ink)]',
    label: 'Yaklaşıyor',
  },
  upcoming: {
    dot: 'bg-[var(--color-rule-strong)]',
    text: 'text-[var(--color-text-muted)]',
    label: 'Planlı',
  },
  past: {
    dot: 'bg-[var(--color-rule)]',
    text: 'text-[var(--color-text-muted)]',
    label: 'Geçti',
  },
};

export function TaxCalendarPanel({
  referenceDate,
  taxpayerType = 'all',
  horizonDays = 60,
  limit = 6,
}: Props) {
  const deadlines = getUpcomingDeadlines({ referenceDate, horizonDays, taxpayerType }).slice(
    0,
    limit,
  );

  const icsHref = `/api/calendar?taxpayerType=${taxpayerType}`;

  return (
    <section
      aria-labelledby="tax-calendar-heading"
      className="border border-[var(--color-rule)] bg-[var(--color-surface)]"
    >
      <header className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--color-rule)] px-6 py-5">
        <div>
          <p className="basis-ref uppercase">Vergi Takvimi</p>
          <h2
            id="tax-calendar-heading"
            className="mt-1 text-[length:var(--text-xl)] text-[var(--color-text)]"
          >
            Yaklaşan yükümlülükler
          </h2>
        </div>
        <a
          href={icsHref}
          className="text-[length:var(--text-xs)] text-[var(--color-ink)] underline underline-offset-4 hover:text-[var(--color-ink-strong)]"
          download="futuristax-vergi-takvimi.ics"
        >
          Takvimime ekle (.ics)
        </a>
      </header>

      {deadlines.length === 0 ? (
        <p className="px-6 py-10 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
          Önümüzdeki {horizonDays} gün içinde bu mükellef tipi için tanımlı bir son tarih yok.
          Farklı bir mükellef tipi seçerek bakabilirsiniz.
        </p>
      ) : (
        <ol className="divide-y divide-[var(--color-rule)]">
          {deadlines.map((deadline) => {
            const style = URGENCY_STYLES[deadline.urgency];
            return (
              <li
                key={`${deadline.ruleId}-${deadline.date}`}
                className="grid grid-cols-[auto_1fr_auto] items-start gap-4 px-6 py-4"
              >
                <span
                  aria-hidden="true"
                  className={`mt-2 size-2 rounded-full ${style.dot}`}
                />

                <div className="min-w-0">
                  <h3 className="font-[family-name:var(--font-sans)] text-[length:var(--text-sm)] font-medium text-[var(--color-text)]">
                    {deadline.title}
                  </h3>
                  <p className="mt-0.5 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
                    {deadline.description}
                  </p>
                  <p className="basis-ref mt-1">{deadline.basis}</p>
                </div>

                <div className="text-right" data-numeric>
                  <time
                    dateTime={deadline.date}
                    className="block text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
                  >
                    {formatIsoDate(deadline.date)}
                  </time>
                  <span className={`text-[length:var(--text-xs)] font-medium ${style.text}`}>
                    {formatDaysRemaining(deadline.daysRemaining)}
                  </span>
                  <span className="sr-only">{style.label}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <footer className="border-t border-[var(--color-rule)] px-6 py-3">
        <p className="basis-ref">
          Son gün resmî tatile denk gelirse süre takip eden ilk iş gününe uzar (VUK Md. 18).
          Tatil kaydırması bu sürümde henüz uygulanmamaktadır.
        </p>
      </footer>
    </section>
  );
}
