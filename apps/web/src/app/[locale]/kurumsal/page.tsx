import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { PageHero } from '@/components/content/PageHero';
import { RequestCta } from '@/components/content/RequestCta';
import { Reveal } from '@/components/motion/Reveal';
import { TEAM } from '@/lib/data';
import { site, unverifiedClaims } from '@futuristax/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kurumsal',
  description:
    'FuturistaX Advisory, Ankara merkezli bir vergi ve mali danışmanlık firmasıdır. Kurucu ve ' +
    'çalışma yaklaşımı hakkında.',
  alternates: { canonical: '/kurumsal' },
  openGraph: { title: 'Kurumsal', url: '/kurumsal', type: 'website' },
};

const UNVERIFIED_CLAIM_LABELS: Record<string, string> = {
  activeClients: 'Aktif müşteri',
  successRate: 'Başarı oranı',
  avgTaxOptimization: 'Ortalama vergi optimizasyonu',
  longTermRelationship: 'Uzun dönem ilişki (3+ yıl)',
};

// Kurumsal zaman çizelgesi — firmanın kendi yayınladığı gerçek içerik
// (www.futuristax.com, V10'da kaynak doğrulandı).
const TIMELINE = [
  {
    year: 2013,
    title: 'Kuruluş',
    text: "Ankara'da bağımsız vergi danışmanlığı ofisi olarak faaliyete başlandı. İlk müşteriler KOBİ segmentinden edindi.",
  },
  {
    year: 2016,
    title: 'Genişleme',
    text: 'Kurumsal müşteri portföyü oluşturuldu. Finansal danışmanlık ve uyum hizmetleri portföye eklendi.',
  },
  {
    year: 2020,
    title: 'Dijital Dönüşüm',
    text: 'Dijital vergi çözümleri ve uzaktan danışmanlık modeli hayata geçirildi. E-arşiv entegrasyon hizmetleri başlatıldı.',
  },
  {
    year: 2023,
    title: 'FuturistaX Markası',
    text: 'Yeniden markalama süreciyle FuturistaX Advisory kimliği oluşturuldu. Kurumsal kimlik ve dijital varlık güçlendirildi.',
  },
];

// TASLAK METİN — yayına almadan önce firma tarafından revize edilecek.
const APPROACH = [
  {
    heading: 'Önce yükümlülük, sonra yapı',
    body:
      'Her çalışmaya, mevcut yükümlülüklerin eksiksiz ve zamanında karşılandığından emin olarak ' +
      'başlarız. Zemin sağlamlaşınca, tekrar eden işi azaltan kalıcı bir mali yapı kurarız.',
  },
  {
    heading: 'Hesabın nasıl çıktığını gösteririz',
    body:
      'Bir sonucu değil, o sonuca nasıl ulaşıldığını paylaşırız. Alınan her pozisyonun ' +
      'dayanağı yazılıdır; bir inceleme gündeme geldiğinde geçmiş kararlar gerekçesiyle durur.',
  },
  {
    heading: 'Uydurmayız',
    body:
      'Bir oran, tarih veya mevzuat hükmü emin olunmadan paylaşılmaz. Bilinmeyen bir konu, ' +
      'tahmin edilmek yerine araştırılır ve kaynağıyla birlikte iletilir.',
  },
];

export default function CorporatePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <PageHero
        eyebrow="Kurumsal"
        title={site.brand.name}
        backdrop="light-field"
        breadcrumbs={<Breadcrumbs trail={[{ name: 'Kurumsal', path: '/kurumsal' }]} />}
        lead={`${site.brand.name}, ${site.contact.address.city} merkezli bir vergi ve mali danışmanlık firmasıdır. Şirketlere vergi, finans ve uyum süreçlerinde; yükümlülüklerin takibinden kalıcı bir mali yapının kurulmasına kadar danışmanlık verir.`}
      />

      {/*
        RAKAMLAR: firma kaynağıyla onaylandı (V10, bkz. packages/config/src/site.ts
        unverifiedClaims notu) — unverifiedClaims.publish === false olsaydı burada
        HİÇ render edilmezdi.
      */}
      {unverifiedClaims.publish ? (
        <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {unverifiedClaims.items.map((item) => (
            <div key={item.key}>
              <dt className="sr-only">{item.key}</dt>
              <dd className="font-[family-name:var(--font-display)] text-[length:var(--text-3xl)] text-[var(--color-accent)]">
                {item.value}
              </dd>
              <dd className="mt-1 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
                {UNVERIFIED_CLAIM_LABELS[item.key]}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <Reveal className="mt-12">
        <div className="space-y-8">
          {APPROACH.map((item) => (
            <section key={item.heading}>
              <h2 className="mb-2 text-[length:var(--text-xl)] text-[var(--color-text)]">
                {item.heading}
              </h2>
              <p className="text-[length:var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
                {item.body}
              </p>
            </section>
          ))}
        </div>
      </Reveal>

      <section aria-label="Zaman çizelgesi" className="mt-14">
        <div className="ledger-rule pb-3">
          <p className="basis-ref uppercase">Yolculuğumuz</p>
        </div>
        <ol className="mt-5 space-y-6 border-l border-[var(--color-rule)] pl-6">
          {TIMELINE.map((item) => (
            <li key={item.year} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-1.5 -left-[29px] size-2.5 rounded-full bg-[var(--color-accent)]"
              />
              <p className="font-[family-name:var(--font-display)] text-[length:var(--text-lg)] text-[var(--color-accent)] tabular-nums">
                {item.year}
              </p>
              <p className="mt-0.5 text-[length:var(--text-base)] text-[var(--color-text)]">
                {item.title}
              </p>
              <p className="mt-1 max-w-prose text-[length:var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Ekip" className="mt-14">
        <div className="ledger-rule pb-3">
          <p className="basis-ref uppercase">Ekip</p>
        </div>
        <ul className="mt-5 space-y-6">
          {TEAM.map((member) => (
            <li
              key={member.slug}
              className="border border-[var(--color-rule)] bg-[var(--color-surface)] p-6"
            >
              <p className="text-[length:var(--text-lg)] text-[var(--color-text)]">{member.name}</p>
              <p className="basis-ref mt-0.5">{member.title}</p>
              <p className="mt-3 text-[length:var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)]">
                {member.bio}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
          Ekip bilgileri güncellenmektedir.
        </p>
      </section>

      <div className="mt-14">
        <RequestCta />
      </div>
    </div>
  );
}
