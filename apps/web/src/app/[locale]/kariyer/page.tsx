import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { StatusPanel } from '@/components/ui/StatusPanel';
import { site } from '@futuristax/config';
import type { Metadata } from 'next';

// TODO(firma): Açık pozisyonlar bir veri dosyasından beslenecek. Şu an
// yayınlanmış pozisyon yok; uydurma ilan EKLENMEDİ.
const OPEN_POSITIONS: { slug: string; title: string; location: string }[] = [];

export const metadata: Metadata = {
  title: 'Kariyer',
  description:
    'FuturistaX Advisory ekibine katılmak isteyenler için. Açık pozisyonlar ve genel başvuru.',
  alternates: { canonical: '/kariyer' },
  robots: OPEN_POSITIONS.length === 0 ? { index: false, follow: true } : { index: true },
};

export default function CareersPage() {
  const subject = encodeURIComponent('Genel başvuru — Kariyer');

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Breadcrumbs trail={[{ name: 'Kariyer', path: '/kariyer' }]} />

      <header className="ledger-rule mt-6 pb-4">
        <p className="basis-ref uppercase">Kariyer</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">Ekibe katılın</h1>
      </header>

      <p className="mt-6 text-[length:var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
        Vergi ve mali danışmanlıkta işini titizlikle yapan, bir sonucun nasıl çıktığını
        açıklayabilen kişilerle çalışmak isteriz.
      </p>

      <section aria-label="Açık pozisyonlar" className="mt-12">
        <div className="ledger-rule pb-3">
          <p className="basis-ref uppercase">Açık pozisyonlar</p>
        </div>

        {OPEN_POSITIONS.length === 0 ? (
          <div className="mt-5">
            <StatusPanel
              tone="empty"
              label="Açık pozisyon yok"
              title="Şu anda yayınlanmış bir açık pozisyon yok"
              action={
                <a
                  href={`mailto:${site.contact.email}?subject=${subject}`}
                  className="inline-block bg-[var(--color-ink)] px-6 py-3 text-[length:var(--text-sm)] font-medium text-white hover:bg-[var(--color-ink-strong)]"
                >
                  Genel başvuru gönder
                </a>
              }
            >
              Yine de kendinizi bu alanda görüyorsanız, özgeçmişinizi ve birkaç satır motivasyon
              yazınızı bize iletin; uygun bir pozisyon açıldığında değerlendirmeye alırız.
            </StatusPanel>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
            {OPEN_POSITIONS.map((position) => (
              <li key={position.slug} className="py-4">
                <p className="text-[length:var(--text-base)] text-[var(--color-text)]">
                  {position.title}
                </p>
                <p className="basis-ref mt-1">{position.location}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
