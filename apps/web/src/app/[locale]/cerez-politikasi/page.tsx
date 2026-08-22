import type { Metadata } from 'next';
import { LegalDraftNotice } from '@/components/ui/LegalDraftNotice';
import { LEGAL_TEXTS_APPROVED, LEGAL_VERSIONS } from '@/lib/legal/versions';

export const metadata: Metadata = {
  title: 'Çerez politikası',
  description: 'Sitede kullanılan çerezler ve tercih yönetimi.',
  robots: LEGAL_TEXTS_APPROVED ? { index: true } : { index: false, follow: false },
};

const COOKIES = [
  {
    name: 'ftx-consent',
    purpose: 'Çerez tercihinizi hatırlar.',
    category: 'Zorunlu',
    retention: '180 gün',
  },
  {
    name: 'NEXT_LOCALE',
    purpose: 'Seçtiğiniz dili hatırlar.',
    category: 'Zorunlu',
    retention: '1 yıl',
  },
  {
    name: 'cf_clearance',
    purpose: 'Bot doğrulaması (Cloudflare Turnstile).',
    category: 'Zorunlu',
    retention: 'Oturum',
  },
  {
    name: '_ga / _ga_*',
    purpose: 'Ziyaret istatistikleri (Google Analytics).',
    category: 'Analitik — onaya bağlı',
    retention: '2 yıl',
  },
];

export default function CookiePolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <div className="ledger-rule pb-4">
        <p className="basis-ref uppercase">Yasal</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">Çerez politikası</h1>
      </div>

      <div className="mt-8">
        <LegalDraftNotice version={LEGAL_VERSIONS.cookiePolicy} />
      </div>

      <p className="text-[length:var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
        Zorunlu çerezler sitenin çalışması için gereklidir ve devre dışı bırakılamaz.
        Analitik çerezler yalnızca onay verdiğinizde yüklenir; onay vermezseniz hiçbir
        ölçüm kodu çalışmaz.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse border border-[var(--color-rule)]">
          <caption className="sr-only">Sitede kullanılan çerezler</caption>
          <thead>
            <tr className="bg-[var(--color-surface)]">
              {['Çerez', 'Amaç', 'Kategori', 'Süre'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="border-b border-[var(--color-rule)] px-4 py-3 text-left text-[length:var(--text-xs)] uppercase text-[var(--color-text-muted)]"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COOKIES.map((cookie) => (
              <tr key={cookie.name} className="ledger-rule last:border-b-0">
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-[family-name:var(--font-mono)] text-[length:var(--text-xs)] font-normal text-[var(--color-text)]"
                >
                  {cookie.name}
                </th>
                <td className="px-4 py-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                  {cookie.purpose}
                </td>
                <td className="px-4 py-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                  {cookie.category}
                </td>
                <td
                  data-numeric
                  className="px-4 py-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]"
                >
                  {cookie.retention}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-[length:var(--text-xl)] text-[var(--color-text)]">
          Tercihinizi değiştirme
        </h2>
        <p className="text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
          Tarayıcınızın ayarlarından bu site için çerezleri silerek onay bandını yeniden
          görüntüleyebilir ve tercihinizi değiştirebilirsiniz.
        </p>
        {/* TODO(aşama-12): "Tercihimi değiştir" düğmesi eklenecek — bant yeniden açılsın. */}
      </section>
    </article>
  );
}
