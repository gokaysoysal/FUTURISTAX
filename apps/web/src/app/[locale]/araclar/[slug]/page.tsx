import { ToolCalculator } from '@/components/calculators/ToolCalculator';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { FaqSection } from '@/components/content/FaqSection';
import { RequestCta } from '@/components/content/RequestCta';
import { HowToJsonLd } from '@/components/seo/JsonLd';
import { getTool } from '@/lib/tools';
import { site } from '@futuristax/config';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

/*
 * Dinamik render (next-intl Server Component API'leri statik üretime izin
 * vermiyor). Bilinmeyen slug notFound().
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
      <Breadcrumbs
        trail={[
          { name: 'Araçlar', path: '/araclar' },
          { name: tool.short, path: canonical },
        ]}
      />

      <header className="ledger-rule mt-6 pb-4">
        <p className="basis-ref uppercase">Araç · {tool.basis}</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">{tool.title}</h1>
      </header>

      <p className="mt-6 max-w-prose text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
        {tool.intro}
      </p>

      <div className="mt-10">
        <ToolCalculator slug={tool.slug} />
      </div>

      <section aria-label="Nasıl kullanılır" className="mt-14">
        <h2 className="text-[length:var(--text-xl)] text-[var(--color-text)]">Nasıl kullanılır</h2>
        <ol className="mt-5 space-y-3">
          {tool.howTo.steps.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]"
            >
              <span
                aria-hidden="true"
                className="basis-ref shrink-0 pt-0.5 tabular-nums text-[var(--color-text-muted)]"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-14">
        <FaqSection items={tool.faqs} />
      </div>

      <p className="mt-10 text-[length:var(--text-xs)] text-[var(--color-text-muted)]">
        {site.disclaimers.calculator.tr}
      </p>

      <div className="mt-10">
        <RequestCta
          title="Kesin hesap için görüşelim"
          body="Bu araç genel bir yön verir. Şirketinizin durumuna özel kesin hesap için bizimle görüşün."
        />
      </div>
    </div>
  );
}
