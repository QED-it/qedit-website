import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';

interface PartnersContent {
  hero: {
    title: string;
    description: string;
    image: string;
  };
  collaboration: {
    title: string;
    description: string;
  };
  features: Array<{
    title: string;
    description: string;
    image: string;
    openSide: 'left' | 'right';
  }>;
}

export default function Partners() {
  const { data: pageData } = getMarkdownData<PartnersContent>('pages', 'partners.md');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Join our global partner network and grow your business",
            "description": "Join our global partner network. Businesses that thrive are pooling data resources to accelerate growth and increase productivity while remaining compliant",
            "url": "https://qed-it.com/partners/",
            "dateModified": "2021-05-13T10:58:54+00:00"
          })
        }}
      />
      <div className="min-h-screen bg-white relative pb-0 md:pb-32">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-semibold text-gray-900 mb-6">
            {pageData.hero.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl">
            {pageData.hero.description}
          </p>
        </div>

        {/* Collaboration Section */}
        <div className="bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl text-[#38b1df] mb-8">
              {pageData.collaboration.title}
            </h2>
            <p className="text-lg text-gray-600">
              {pageData.collaboration.description}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white">
          <div className="max-w-full mx-auto">
            {pageData.features.map((feature, index) => (
              <div 
                key={index}
                className={`py-24 px-4 sm:px-6 lg:px-8 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className={`
                  max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 p-12
                  ${feature.openSide === 'right' ? 
                    'border-t border-l border-b' : 
                    'border-t border-r border-b'
                  }
                  border-gray-200
                `}>
                  {feature.openSide === 'right' ? (
                    <>
                      {/* Title takes 1/3 */}
                      <div>
                        <h2 className="text-5xl font-bold text-gray-900">
                          {feature.title}
                        </h2>
                      </div>
                      {/* Description takes 2/3 */}
                      <div className="col-span-2">
                        <p className="text-lg text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Description takes 2/3 */}
                      <div className="col-span-2">
                        <p className="text-lg text-gray-600">
                          {feature.description}
                        </p>
                      </div>
                      {/* Title takes 1/3 */}
                      <div>
                        <h2 className="text-5xl font-bold text-gray-900">
                          {feature.title}
                        </h2>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact wave decoration */}
        <div className="relative md:absolute bottom-0 right-0 pointer-events-none mt-0 md:mt-0 flex justify-end w-full md:w-auto">
          <Image
            src="/images/layout/stripes-08.png"
            alt="Decorative wave"
            width={200}
            height={374}
            // style={{ width: 'auto', height: 'auto', maxWidth: '200px' }}
            className="object-contain w-[100px] md:w-[200px]"
            sizes="(max-width: 768px) 100px, 200px"
            priority={false}
          />
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Join our global partner network and grow your business',
  description: 'Join our global partner network. Businesses that thrive are pooling data resources to accelerate growth and increase productivity while remaining compliant',
  alternates: {
    canonical: 'https://qed-it.com/partners/',
  },
  openGraph: {
    title: 'Join our global partner network and grow your business',
    description: 'Join our global partner network. Businesses that thrive are pooling data resources to accelerate growth and increase productivity while remaining compliant',
    url: 'https://qed-it.com/partners/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2021-05-13T10:58:54+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2021-05-13T10:58:54+00:00',
  }
};