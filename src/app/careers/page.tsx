import { getMarkdownData } from '@/lib/markdown';
import FAQAccordion from '@/components/FAQAccordion';
import Image from 'next/image';
import { OG_DEFAULTS, TWITTER_DEFAULTS } from '@/lib/seo';

interface CareersContent {
  title: string;
  subtitle: string;
  text: string;
  openPositions: Array<{
    title: string;
    description: string;
  }>;
  otherOpportunities: {
    title: string;
    description: string;
    contact: string;
    email: string;
  };
}

export default function Careers() {
  const { data: pageData } = getMarkdownData<CareersContent>('pages', 'careers.md');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Careers at QEDIT- Join a leading privacy tech startup",
            "description": "Learn about career opportunities at QEDIT and join a world-class team of accomplished tech entrepreneurs, researchers, and developers.",
            "url": "https://qed-it.com/careers/",
            "dateModified": "2022-12-01T11:59:52+00:00"
          })
        }}
      />
      <div className="min-h-screen bg-white relative pb-32 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-semibold text-gray-900 mb-6">
            {pageData.title}
          </h1>
          
          <h2 className="text-2xl text-gray-700 mb-8">
            {pageData.subtitle}
          </h2>

          <div className="prose prose-lg max-w-none mb-16">
            {pageData.text.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-600 mb-6">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Open Positions Section with gray background */}
          <div className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-8">
              Open Positions
            </h2>

            {pageData.openPositions.length > 0 ? (
              <FAQAccordion questions={pageData.openPositions.map(position => ({
                question: position.title,
                answer: position.description.replace(/\n/g, '<br />')
              }))} />
            ) : (
              <p className="text-xl text-gray-600">
                We don&apos;t have any open positions right now.
              </p>
            )}
          </div>

          {/* Other Opportunities Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {pageData.otherOpportunities.title}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {pageData.otherOpportunities.description}
            </p>
            <p className="text-xl">
              {pageData.otherOpportunities.contact}{' '}
              <a 
                href={`mailto:${pageData.otherOpportunities.email}`}
                className="text-[#38b1df] hover:text-[#2d8eb2] transition-colors"
              >
                <strong>{pageData.otherOpportunities.email}</strong>
              </a>
            </p>
          </div>

          {/* Office Images Section */}
          <div className="mt-24">
            <div className="relative w-full">
              <Image
                src="/images/office-collage-1.png"
                alt="QEDIT Office Life"
                width={1200}
                height={800}
                className="w-full rounded-lg"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority={false}
              />
            </div>
          </div>
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

export const metadata = {
  title: 'Careers at QEDIT - Applied Cryptography Roles',
  description:
    'Career opportunities at QEDIT, an applied cryptography firm working on zero-knowledge proofs, protocol design, and formal verification.',
  alternates: {
    canonical: 'https://qed-it.com/careers/',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: 'Careers at QEDIT - Applied Cryptography Roles',
    description:
      'Career opportunities at QEDIT, an applied cryptography firm working on zero-knowledge proofs, protocol design, and formal verification.',
    url: 'https://qed-it.com/careers/',
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: 'Careers at QEDIT - Applied Cryptography Roles',
  },
};