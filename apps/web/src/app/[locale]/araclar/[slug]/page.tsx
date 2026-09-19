import { ToolWorkspace } from '@/components/calculators/ToolWorkspace';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { RequestCta } from '@/components/content/RequestCta';
import { FaqJsonLd, HowToJsonLd } from '@/components/seo/JsonLd';
import { getTool } from '@/lib/tools';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/*
 * Dinamik render (next-intl Server Component API'leri statik üretime izin
 * vermiyor). Bilinmeyen slug notFound().
 *
 * Sayfa gövdesi = araç çalışma alanı (ToolWorkspace). Araç seçici URL'i
 * `history.pushState` ile değiştirir; bu sunucu sayfası her `/araclar/[slug]`
 * için doğru metadata + HowTo/FAQ JSON-LD'yi taşımayı sürdürür (SEO).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const canonical = `/araclar/${tool.slug}`;
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: canonical,
      type: 'article',
    },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const canonical = `/araclar/${tool.slug}`;

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <HowToJsonLd name={tool.howTo.name} description={tool.description} steps={tool.howTo.steps} />
      <FaqJsonLd items={tool.faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
      <Breadcrumbs
        trail={[
          { name: 'Araçlar', path: '/araclar' },
          { name: tool.short, path: canonical },
        ]}
      />

      <div className="mt-6">
        <ToolWorkspace initialSlug={tool.slug} />
      </div>

      <div className="mt-14">
        <RequestCta
          title="Kesin hesap için görüşelim"
          body="Bu araç genel bir yön verir. Şirketinizin durumuna özel kesin hesap için bizimle görüşün."
        />
      </div>
    </div>
  );
}
