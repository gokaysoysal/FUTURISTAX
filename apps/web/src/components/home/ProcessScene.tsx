import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

/**
 * Süreç — "nasıl çalışıyoruz", scroll'a bağlı kademeli ilerleyen.
 *
 * Pin YOK (klavye tuzağı riski). Adımlar dikey liste; scroll ile stagger
 * reveal + solda dolan ilerleme çizgisi. reduced-motion: düz liste, çizgi dolu.
 */
const STEPS = [
  {
    k: 'Tanışma',
    d: 'İlk görüşme ücretsizdir. Mevcut yapınızı, önceliklerinizi ve varsa acil konuları dinleriz.',
  },
  {
    k: 'Kapsam',
    d: 'Çalışma biçimini ve kapsamı yazılı olarak paylaşırız; beklentiler net olur.',
  },
  {
    k: 'Kurulum',
    d: 'Süreçleri, yükümlülük takvimini ve raporlama düzenini kurarız.',
  },
  {
    k: 'Sürdürme',
    d: 'Düzenli danışmanlık, mevzuat takibi ve karar desteğiyle yapıyı ayakta tutarız.',
  },
] as const;

export function ProcessScene() {
  return (
    <RevealGroup className="relative">
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[7px] top-2 w-px bg-[var(--color-rule)] sm:left-[calc(2rem+7px)]"
      />
      <ol className="space-y-10">
        {STEPS.map((step, i) => (
          <RevealItem key={step.k}>
            <li className="relative grid grid-cols-[auto_1fr] items-start gap-x-5 sm:gap-x-8">
              <span className="relative z-10 mt-1 flex size-4 items-center justify-center rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-canvas)] sm:ml-8" />
              <div>
                <p className="basis-ref">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 text-[length:var(--text-lg)] text-[var(--color-text)]">
                  {step.k}
                </h3>
                <p className="mt-2 max-w-prose text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                  {step.d}
                </p>
              </div>
            </li>
          </RevealItem>
        ))}
      </ol>
    </RevealGroup>
  );
}

/** Güven bandı — doğrulanmamış istatistik YOK; konumlandırma cümlesi + sabitler. */
export function TrustBand({ foundedYear }: { foundedYear: number | string }) {
  return (
    <Reveal className="card surface-glow px-6 py-8 sm:px-10 sm:py-10">
      <p className="text-[length:var(--text-xl)] text-[var(--color-text)] sm:text-[length:var(--text-2xl)]">
        Bağımsız vergi ve mali danışmanlık. Defter tutmuyoruz; yapı kuruyor, riski erken görüyoruz.
      </p>
      <dl className="mt-8 grid gap-6 border-t border-[var(--color-rule)] pt-6 sm:grid-cols-3">
        {[
          ['Merkez', 'Ankara'],
          ['Kuruluş', `${foundedYear}`],
          ['Model', 'Danışmanlık — mali müşavirliğin yerine değil, yanında'],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="basis-ref uppercase">{label}</dt>
            <dd
              data-numeric
              className="mt-1 text-[length:var(--text-base)] text-[var(--color-text)]"
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
