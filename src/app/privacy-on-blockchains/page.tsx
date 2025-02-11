import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';

interface PrivacyPageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  overview: {
    sections: Array<{
      title: string;
      description: string;
    }>;
  };
  challenge: {
    title: string;
    description: string;
  };
  solution: {
    title: string;
    description: string;
    features: string[];
  };
  cta: {
    title: string;
    buttonText: string;
    buttonLink: string;
  };
  useCase: {
    title: string;
    description: string;
    steps: string[];
  };
  insuranceCase: {
    title: string;
    description: string;
    steps: string[];
  };
  stockExchangeCase: {
    title: string;
    description: string;
    steps: string[];
  };
}

export default function PrivacyOnBlockchains() {
  const { data: pageData } = getMarkdownData<PrivacyPageContent>('pages', 'privacy-on-blockchains.md');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy-Enhanced Blockchains: privacy-compliant solution",
            "description": "How can companies use Distributed Ledger Technologies without leaking sensitive business information? Discover QEDIT's Privacy-Enhanced solution. Read >>>",
            "url": "https://qed-it.com/privacy-on-blockchains/",
            "dateModified": "2021-05-13T09:31:51+00:00"
          })
        }}
      />
      <div className="bg-white relative">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-12 pb-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold text-gray-900 mb-6">
              {pageData.hero.title}
            </h1>
            <h2 className="text-2xl text-gray-700 mb-8">
              {pageData.hero.subtitle}
            </h2>
            <p className="text-xl text-gray-600">
              {pageData.hero.description}
            </p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pageData.overview.sections.map((section, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  <p className="text-gray-600">
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              {pageData.challenge.title}
            </h2>
            <p className="text-xl text-gray-600">
              {pageData.challenge.description}
            </p>
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">
                {pageData.solution.title}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {pageData.solution.description}
              </p>
              <div className="space-y-6">
                {pageData.solution.features.map((feature, index) => (
                  <p key={index} className="text-gray-600">
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {/* <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 max-w-3xl mx-auto">
              {pageData.cta.title}
            </h2>
            <Link
              href={pageData.cta.buttonLink}
              className="inline-block bg-[#38b1df] text-white px-8 py-3 rounded-full text-lg font-normal hover:bg-[#2d8eb2] transition-colors"
            >
              {pageData.cta.buttonText}
            </Link>
          </div>
        </div> */}

        {/* Supply Chain Use Case Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                {pageData.useCase.title}
              </h2>
              <p className="text-lg text-gray-600 mb-12">
                {pageData.useCase.description}
              </p>
              <div className="space-y-8">
                {pageData.useCase.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <p className="text-gray-600">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Insurance Use Case Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                {pageData.insuranceCase.title}
              </h2>
              <p className="text-lg text-gray-600 mb-12">
                {pageData.insuranceCase.description}
              </p>
              <div className="space-y-8">
                {pageData.insuranceCase.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <p className="text-gray-600">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stock Exchange Use Case Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-semibold text-gray-900 mb-8">
                {pageData.stockExchangeCase.title}
              </h2>
              <p className="text-lg text-gray-600 mb-12">
                {pageData.stockExchangeCase.description}
              </p>
              <div className="space-y-8">
                {pageData.stockExchangeCase.steps.map((step, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <p className="text-gray-600">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add the decorative stripes at the end */}
        <div className="bg-white relative md:absolute bottom-0 right-0 pointer-events-none mt-0 md:mt-0 flex justify-end w-full md:w-auto">
          <Image
            src="/images/layout/stripes-01.png"
            alt="Decorative stripes"
            width={600}
            height={600}
            style={{ width: '100%', height: 'auto' }}
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
  title: 'Privacy-Enhanced Blockchains: privacy-compliant solution',
  description: 'How can companies use Distributed Ledger Technologies without leaking sensitive business information? Discover QEDIT\'s Privacy-Enhanced solution.',
  alternates: {
    canonical: 'https://qed-it.com/privacy-on-blockchains/',
  },
  openGraph: {
    title: 'Privacy-Enhanced Blockchains: privacy-compliant solution',
    description: 'How can companies use Distributed Ledger Technologies without leaking sensitive business information? Discover QEDIT\'s Privacy-Enhanced solution.',
    url: 'https://qed-it.com/privacy-on-blockchains/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2021-05-13T09:31:51+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2021-05-13T09:31:51+00:00',
  }
}; 