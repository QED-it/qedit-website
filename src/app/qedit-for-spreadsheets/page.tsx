import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';

interface SpreadsheetPageContent {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  description: {
    title: string;
    text: string;
  };
  capabilities: {
    title: string;
    image: string;
    items: string[];
  };
  features: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      image: string;
    }>;
  };
  contact: {
    text: string;
  };
}

export default function QeditForSpreadsheets() {
  const { data: pageData } = getMarkdownData<SpreadsheetPageContent>('pages', 'qedit-for-spreadsheets.md');

  return (
    <>
      <div className="space-y-24">
        {/* Hero Section */}
        <div className="bg-[#1e2125] relative overflow-hidden h-[600px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-start justify-center py-20">
              <h1 className="text-4xl md:text-5xl font-normal text-white mb-6">
                {pageData.hero.title}
              </h1>
              <h2 className="text-2xl md:text-3xl font-normal text-gray-300 mb-8 max-w-2xl">
                {pageData.hero.subtitle}
              </h2>
              <Link
                href="https://appsource.microsoft.com/en-us/product/office/WA200001685"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#38b1df] text-white px-8 py-3 rounded-full text-lg font-normal hover:bg-[#38b1df] transition-all"
              >
                {pageData.hero.cta}
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 h-full pointer-events-none">
            <Image
              src="/images/spreadsheets/hero-spreadsheet.png"
              alt="QEDIT Spreadsheet Interface"
              width={800}
              height={600}
              style={{ width: 'auto', height: '100%' }}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>
        </div>

        {/* Description & Video Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-7xl mx-auto mb-16">
              <h2 className="text-3xl font-normal text-gray-900 mb-6 text-start">
                {pageData.description.title}
              </h2>
              <p className="text-2xl text-gray-800 text-start">
                {pageData.description.text}
              </p>
            </div>
            <div className="max-w-6xl mx-auto relative" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/eXdWCpbhqZ4"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-lg absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="bg-[#1e2125] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-8">{pageData.capabilities.title}</h2>
                <ul className="space-y-4">
                  {pageData.capabilities.items.map((item, index) => (
                    <li key={index} className="flex items-center text-xl">
                      <svg className="w-6 h-6 mr-3 text-[#38b1df]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-96">
                <Image
                  src={pageData.capabilities.image}
                  alt="QEDIT for Spreadsheets Capabilities"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 text-start mb-6">{pageData.features.title}</h2>
              <p className="text-xl text-gray-600 max-w-7xl text-start mx-auto">
                {pageData.features.description}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {pageData.features.items.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative w-48 h-48 mb-6">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 192px, 192px"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="text-center mt-48">
              <h1 className="text-3xl text-gray-900">
                <Link href="/contact-us" className="text-[#38b1df] hover:underline">Contact us</Link> to discuss how QEDIT for Spreadsheets can work for you
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative stripes */}
      <div className="relative pointer-events-none flex justify-end w-full md:w-auto">
        <Image
          src="/images/layout/stripes-02.png"
          alt="Decorative stripes"
          width={600}
          height={600}
          style={{ width: 'auto', height: 'auto', maxWidth: '600px' }}
          className="object-contain w-full md:w-[600px]"
          sizes="(max-width: 768px) 100vw, 600px"
          priority={false}
        />
      </div>
    </>
  );
} 