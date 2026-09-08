import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { FaqSection } from '@/components/content/FaqSection';
import { PageHero } from '@/components/content/PageHero';
import { RequestCta } from '@/components/content/RequestCta';
import { Reveal } from '@/components/motion/Reveal';
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
      <PageHero
        eyebrow="SSS"
        title="Sık sorulan sorular"
        backdrop="light-field"
        breadcrumbs={<Breadcrumbs trail={[{ name: 'SSS', path: '/sss' }]} />}
        lead="Çalışma biçimimiz, kapsam ve süre, gizlilik ve veri işleme hakkında en çok gelen sorular."
      />

      <Reveal className="mt-12">
        <div className="space-y-12">
          {FAQ_CATEGORIES.map((category) => (
            <FaqSection
              key={category.slug}
              heading={category.title}
              items={category.items}
              withSchema={false}
            />
          ))}
        </div>
      </Reveal>

      <div className="mt-14">
        <RequestCta
          title="Sorunuz burada yoksa"
          body="Aradığınız yanıtı bulamadıysanız, doğrudan yazın. En geç bir iş günü içinde dönüş yaparız."
        />
      </div>
    </div>
  );
}
