import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { PageHero } from '@/components/content/PageHero';
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
      <PageHero
        eyebrow="Kariyer"
        title="Ekibe katılın"
        backdrop="concrete"
        breadcrumbs={<Breadcrumbs trail={[{ name: 'Kariyer', path: '/kariyer' }]} />}
        lead="Vergi ve mali danışmanlıkta işini titizlikle yapan, bir sonucun nasıl çıktığını açıklayabilen kişilerle çalışmak isteriz."
      />

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
                  className="btn btn-primary px-6 py-3 text-[length:var(--text-sm)]"
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
