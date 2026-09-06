import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { RequestCta } from '@/components/content/RequestCta';
import { publishableTestimonials } from '@/lib/data';
import type { Metadata } from 'next';

const testimonials = publishableTestimonials();

export const metadata: Metadata = {
  title: 'Referanslar',
  description:
    'Müşteri görüşlerini yalnızca yazılı izinle yayınlıyoruz. Çalışmalarımıza dair örnekler ' +
    'için bizimle görüşün.',
  alternates: { canonical: '/referanslar' },
  // İzinli referans yokken sayfa indekslenmez — boş bir sayfa aramalarda görünmemeli.
  robots: testimonials.length === 0 ? { index: false, follow: true } : { index: true },
};

export default function ReferencesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <Breadcrumbs trail={[{ name: 'Referanslar', path: '/referanslar' }]} />

      <header className="ledger-rule mt-6 pb-4">
        <p className="basis-ref uppercase">Referanslar</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">Müşteri görüşleri</h1>
      </header>

      {testimonials.length === 0 ? (
        <div className="mt-8 border border-[var(--color-rule)] bg-[var(--color-surface)] p-8">
          <p className="text-[length:var(--text-base)] leading-relaxed text-[var(--color-text-secondary)]">
            Müşteri görüşlerini yalnızca ilgili müşteriden yazılı izin aldığımızda yayınlıyoruz.
            İzin süreci tamamlanana kadar bu sayfada görüş göstermiyoruz — gerçek olmayan ya da
            onaysız bir referans yayınlamaktansa hiç yayınlamamayı tercih ederiz.
          </p>
          <p className="mt-4 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
            Sektörünüze yakın bir çalışmadan örnek görmek isterseniz, görüşmede paylaşabiliriz.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-6">
          {testimonials.map((item) => (
            <li
              key={item.slug}
              className="border border-[var(--color-rule)] bg-[var(--color-surface)] p-6"
            >
              <blockquote className="text-[length:var(--text-base)] leading-relaxed text-[var(--color-text)]">
                “{item.quote}”
              </blockquote>
              <p className="basis-ref mt-3">
                {item.authorName} · {item.authorTitle}
                {item.company ? ` · ${item.company}` : ''}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-14">
        <RequestCta />
      </div>
    </div>
  );
}
