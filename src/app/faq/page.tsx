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

export default function FAQ() {
  const { data: pageData } = getMarkdownData<FAQContent>('pages', 'faq.md');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "FAQ - QEDIT",
            "url": "https://qed-it.com/faq/",
            "dateModified": "2021-05-06T07:16:52+00:00"
          })
        }}
      />
      <div className="min-h-screen bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-12">
          <h1 className="text-4xl font-semibold text-gray-900 mb-12">
            {pageData.title}
          </h1>
          <FAQAccordion questions={pageData.questions} />
        </div>

        {/* Decorative stripes */}
        <div className="relative right-0 pointer-events-none flex justify-end w-full md:w-auto">
          <Image
            src="/images/layout/stripes-02.png"
            alt="Decorative stripes"
            width={600}
            height={300}
            // style={{ width: '100%', height: 'auto', maxWidth: '600px' }}
            className="object-contain w-full md:w-auto"
            sizes="(max-width: 768px) 100vw, 600px"
            priority={false}
          />
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'FAQ - QEDIT',
  alternates: {
    canonical: 'https://qed-it.com/faq/',
  },
  openGraph: {
    title: 'FAQ - QEDIT',
    url: 'https://qed-it.com/faq/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2021-05-06T07:16:52+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2021-05-06T07:16:52+00:00',
  }
}; 