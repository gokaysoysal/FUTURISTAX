import { site } from '@futuristax/config';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDraftNotice } from '@/components/ui/LegalDraftNotice';
import { LEGAL_TEXTS_APPROVED, LEGAL_VERSIONS } from '@/lib/legal/versions';

export const metadata: Metadata = {
  title: 'Gizlilik politikası',
  description: 'Verilerin nasıl toplandığı, saklandığı ve korunduğu.',
  robots: LEGAL_TEXTS_APPROVED ? { index: true } : { index: false, follow: false },
};

const SECTIONS = [
  {
    heading: 'Hangi verileri topluyoruz',
    body:
      'Yalnızca iletişim formunda kendi ilettiğiniz bilgileri ve güvenlik amacıyla ' +
      'teknik günlük kayıtlarını topluyoruz. Siteyi gezerken profilleme yapmıyoruz.',
  },
  {
    heading: 'Ne kadar süre saklıyoruz',
    body:
      'Danışmanlık talepleri, ilişki sona erdikten sonra mevzuatın öngördüğü zamanaşımı ' +
      'süreleri boyunca saklanır; sonrasında silinir. Onay verilmemiş analitik verisi ' +
      'hiç toplanmaz.',
  },
  {
    heading: 'Nasıl koruyoruz',
    body:
      'Veriler şifreli bağlantı üzerinden iletilir ve erişim yetkisi yalnızca talebi ' +
      'değerlendiren ekip üyeleriyle sınırlıdır. Kişisel veriye her erişim kayıt altına alınır.',
  },
  {
    heading: 'Üçüncü taraf içerikler',
    body:
      'Sitede reklam ağı ve takip pikseli bulunmaz. Dış kaynaklı gömülü içerik ' +
      'kullanıldığında bu bölümde ayrıca belirtilir.',
  },
];

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <div className="ledger-rule pb-4">
        <p className="basis-ref uppercase">Yasal</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">Gizlilik politikası</h1>
      </div>

      <div className="mt-8">
        <LegalDraftNotice version={LEGAL_VERSIONS.privacyPolicy} />
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-3 text-[length:var(--text-xl)] text-[var(--color-text)]">
              {section.heading}
            </h2>
            <p className="text-[length:var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
              {section.body}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-10 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
        Kişisel verilerinize ilişkin haklarınız ve başvuru yolu için{' '}
        <Link href="/kvkk" className="text-[var(--color-ink)] underline underline-offset-2">
          KVKK aydınlatma metni
        </Link>
        'ne bakabilir ya da{' '}
        <a href={`mailto:${site.contact.email}`} className="text-[var(--color-ink)] underline underline-offset-2">
          {site.contact.email}
        </a>{' '}
        adresine yazabilirsiniz.
      </p>
    </article>
  );
}
