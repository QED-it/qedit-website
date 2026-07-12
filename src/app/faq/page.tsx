import { getMarkdownData } from '@/lib/markdown';
import FAQAccordion from '@/components/FAQAccordion';
import Image from 'next/image';

interface FAQContent {
  title: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

/** Strip the HTML in the markdown answers — schema.org wants plain text. */
function toPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function FAQ() {
  const { data: pageData } = getMarkdownData<FAQContent>('pages', 'faq.md');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: pageData.questions.map((q) => ({
              '@type': 'Question',
              name: q.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: toPlainText(q.answer),
              },
            })),
          }),
        }}
      />
      <div className="min-h-screen bg-white relative pb-48 md:pb-60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-semibold text-gray-900 mb-12">
            {pageData.title}
          </h1>
          <FAQAccordion questions={pageData.questions} />
        </div>

        {/* Decorative stripes */}
        <div className="absolute bottom-0 right-0 pointer-events-none flex justify-end w-full">
          <Image
            src="/images/layout/stripes-02.png"
            alt="Decorative stripes"
            width={600}
            height={300}
            className="w-full h-auto md:w-[600px]"
            sizes="(max-width: 768px) 100vw, 600px"
            priority={false}
          />
        </div>
      </div>
    </>
  );
}

import { OG_DEFAULTS, TWITTER_DEFAULTS } from '@/lib/seo';

export const metadata = {
  title: 'FAQ - Applied Cryptography, Audits & Formal Verification | QEDIT',
  description:
    'Common questions about QEDIT: what we do, how a cryptography audit differs from a standard code review, when formal verification is worth it, and how engagements start.',
  alternates: {
    canonical: 'https://qed-it.com/faq/',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: 'FAQ - Applied Cryptography, Audits & Formal Verification | QEDIT',
    description:
      'Common questions about QEDIT: what we do, how cryptography audits work, and when formal verification is worth it.',
    url: 'https://qed-it.com/faq/',
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: 'FAQ - Applied Cryptography, Audits & Formal Verification | QEDIT',
  },
};