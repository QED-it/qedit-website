import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';

interface ProductPageContent {
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
  future: {
    title: string;
    quote: string;
    source: string;
    image: string;
  };
  certification: {
    title: string;
    description: string;
    image: string;
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

export default function ProductOverview() {
  const { data: pageData } = getMarkdownData<ProductPageContent>('pages', 'product-overview.md');

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <div className="bg-[#1e2125] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-start justify-center py-20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 max-w-4xl">
              {pageData.hero.title}
            </h1>
            <Link
              href="/contact-us"
              className="border-2 border-[#38b1df] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#38b1df]/10 transition-all"
            >
              Request a Demo
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 right-0">
          <Image
            src="/images/layout/stripes-01.png"
            alt="Decorative stripes"
            width={300}
            height={300}
            style={{ width: 'auto', height: 'auto' }}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-[#38b1df] mb-6">
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
          <h2 className="text-3xl font-semibold text-center mb-12">
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

      {/* Certification Section */}
      <div className="bg-[#1e2125] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center md:justify-start">
              <div className="relative w-64 h-64">
                <Image
                  src={pageData.certification.image}
                  alt="ISO 27001 Certification"
                  fill
                  loading="lazy"
                  className="object-contain"
                  sizes="(max-width: 768px) 256px, 256px"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">{pageData.certification.title}</h2>
              <p className="text-xl text-gray-300">{pageData.certification.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Future Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{pageData.future.title}</h2>
              <blockquote className="text-xl font-light text-gray-700 mb-4">
                "{pageData.future.quote}"
              </blockquote>
              <p className="text-gray-500 italic">-{pageData.future.source}</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative w-96 h-64">
                <Image
                  src={pageData.future.image}
                  alt="Gartner Logo"
                  fill
                  loading="lazy"
                  className="object-contain"
                  sizes="(max-width: 768px) 384px, 384px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center mb-16">
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
  );
} 