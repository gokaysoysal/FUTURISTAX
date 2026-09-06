import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { RequestCta } from '@/components/content/RequestCta';
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
      <Breadcrumbs trail={[{ name: 'Kurumsal', path: '/kurumsal' }]} />

      <header className="ledger-rule mt-6 pb-4">
        <p className="basis-ref uppercase">Kurumsal</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">{site.brand.name}</h1>
      </header>

      <p className="mt-6 text-[length:var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
        {site.brand.name}, {site.contact.address.city} merkezli bir vergi ve mali danışmanlık
        firmasıdır. Şirketlere vergi, finans ve uyum süreçlerinde; yükümlülüklerin takibinden kalıcı
        bir mali yapının kurulmasına kadar danışmanlık verir.
      </p>

      {/*
        DOĞRULANMAMIŞ İDDİALAR: "150+ aktif müşteri", "%98 başarı oranı" gibi ifadeler
        unverifiedClaims.publish === false olduğu sürece HİÇBİR SAYFADA render edilmez.
        Ölçüm yöntemi ve TÜRMOB tanıtım kısıtları açısından teyit bekliyor. İzin
        verilene kadar bu sayfada sayısal iddia gösterilmez.
      */}
      {unverifiedClaims.publish ? (
        <p className="mt-6 text-[length:var(--text-sm)] text-[var(--color-text-muted)]">
          {/* İçerik firma onayından sonra eklenecek. */}
        </p>
      ) : null}

      <section className="mt-12 space-y-8">
        {APPROACH.map((item) => (
          <div key={item.heading}>
            <h2 className="mb-2 text-[length:var(--text-xl)] text-[var(--color-text)]">
              {item.heading}
            </h2>
            <p className="text-[length:var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
              {item.body}
            </p>
          </div>
        ))}
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
