import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

interface DevelopersPageContent {
  hero: {
    title: string;
    subtitle: string;
  };
  overview: {
    title: string;
    description: string;
  };
  techniques: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  howItWorks: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  testimonials: {
    title: string;
    items: Array<{
      quote: string;
      author: string;
      image: string;
      link: string;
    }>;
  };
}

export default function Developers() {
  const { data: pageData } = getMarkdownData<DevelopersPageContent>('pages', 'developers.md');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy enhancing technology 4 secure data collaboration | Qedit",
            "description": "Qedit uses privacy-enhancing technology to empower safe cross-company data collaboration. Gain critical data insights with GDPR compliance.",
            "url": "https://qed-it.com/developers/",
            "dateModified": "2021-06-21T12:45:23+00:00"
          })
        }}
      />
      <div className="space-y-24">
        {/* Hero Section */}
        <div className="bg-[#1e2125] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-start justify-center py-20">
              <h1 className="text-4xl md:text-5xl font-normal text-white mb-8 max-w-4xl">
                {pageData.hero.title}
              </h1>
              <Link
                href="/contact-us"
                className="border-2 border-[#38b1df] text-white px-8 py-3 rounded-full text-lg font-normal hover:bg-[#38b1df] transition-all"
              >
                SEE THE DOCS
              </Link>
            </div>
          </div>
          <div className="relative md:absolute bottom-0 right-0 pointer-events-none mt-0 md:mt-0 flex justify-end w-full md:w-auto">
            <Image
              src="/images/layout/stripes-01.png"
              alt="Decorative stripes"
              width={600}
              height={600}
              style={{ width: '100%', height: 'auto' }}
              className="object-contain w-full md:w-auto"
              sizes="(max-width: 768px) 100vw, 600px"
              priority
            />
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-normal text-[#38b1df] mb-6">
                {pageData.overview.title}
              </h2>
              <p className="text-xl text-gray-600">
                {pageData.overview.description}
              </p>
            </div>
          </div>
        </div>

        {/* Techniques Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-normal text-center mb-12">
              {pageData.techniques.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {pageData.techniques.items.map((technique, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-6">
                    <Image
                      src={technique.icon}
                      alt={technique.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 128px, 128px"
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{technique.title}</h3>
                  <p className="text-gray-600">{technique.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-semibold text-center mb-16">
              {pageData.howItWorks.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {pageData.howItWorks.steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-6">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 128px, 128px"
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <TestimonialsCarousel 
          title={pageData.testimonials.title}
          items={pageData.testimonials.items}
        />
      </div>
    </>
  );
}

export const metadata = {
  title: 'Privacy enhancing technology 4 secure data collaboration | Qedit',
  description: 'Qedit uses privacy-enhancing technology to empower safe cross-company data collaboration. Gain critical data insights with GDPR compliance.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://qed-it.com/developers/',
  },
  openGraph: {
    title: 'Privacy enhancing technology 4 secure data collaboration | Qedit',
    description: 'Qedit uses privacy-enhancing technology to empower safe cross-company data collaboration. Gain critical data insights with GDPR compliance.',
    url: 'https://qed-it.com/developers/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2021-06-21T12:45:23+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2021-06-21T12:45:23+00:00',
  }
}; 