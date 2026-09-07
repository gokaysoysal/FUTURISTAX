import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { FaqSection } from '@/components/content/FaqSection';
import { RequestCta } from '@/components/content/RequestCta';
import { FaqJsonLd } from '@/components/seo/JsonLd';
import { FAQ_CATEGORIES, GENERAL_FAQS } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sık sorulan sorular',
  description:
    'Çalışma biçimimiz, kapsam ve süre, gizlilik ve veri işleme hakkında sık sorulan sorular.',
  alternates: { canonical: '/sss' },
  openGraph: { title: 'Sık sorulan sorular', url: '/sss', type: 'website' },
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      {/* Tüm SSS'ler için TEK FAQPage şeması — kategori bölümleri şemayı tekrar üretmez. */}
      <FaqJsonLd
        items={GENERAL_FAQS.map((item) => ({ question: item.question, answer: item.answer }))}
      />
      <Breadcrumbs trail={[{ name: 'SSS', path: '/sss' }]} />

      <header className="ledger-rule mt-6 pb-4">
        <p className="basis-ref uppercase">SSS</p>
        <h1 className="mt-1 text-[length:var(--text-3xl)]">Sık sorulan sorular</h1>
      </header>

      <div className="mt-10 space-y-12">
        {FAQ_CATEGORIES.map((category) => (
          <FaqSection
            key={category.slug}
            heading={category.title}
            items={category.items}
            withSchema={false}
          />
        ))}
      </div>

      <div className="mt-14">
        <RequestCta
          title="Sorunuz burada yoksa"
          body="Aradığınız yanıtı bulamadıysanız, doğrudan yazın. En geç bir iş günü içinde dönüş yaparız."
        />
      </div>
    </div>
  );
}
