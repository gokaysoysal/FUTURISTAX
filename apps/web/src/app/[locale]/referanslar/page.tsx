import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { PageHero } from '@/components/content/PageHero';
import { RequestCta } from '@/components/content/RequestCta';
import { StatusPanel } from '@/components/ui/StatusPanel';
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
      <PageHero
        eyebrow="Referanslar"
        title="Müşteri görüşleri"
        backdrop="light-field"
        breadcrumbs={<Breadcrumbs trail={[{ name: 'Referanslar', path: '/referanslar' }]} />}
        lead="Müşteri görüşlerini yalnızca ilgili müşteriden yazılı izin aldığımızda yayınlıyoruz."
      />

      {testimonials.length === 0 ? (
        <div className="mt-8">
          <StatusPanel tone="empty" label="Yayın izni bekliyor" title="Henüz yayınlanmış görüş yok">
            <p>
              Müşteri görüşlerini yalnızca ilgili müşteriden yazılı izin aldığımızda yayınlıyoruz.
              İzin süreci tamamlanana kadar bu sayfada görüş göstermiyoruz — gerçek olmayan ya da
              onaysız bir referans yayınlamaktansa hiç yayınlamamayı tercih ederiz.
            </p>
            <p className="mt-3">
              Sektörünüze yakın bir çalışmadan örnek görmek isterseniz, görüşmede paylaşabiliriz.
            </p>
          </StatusPanel>
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
