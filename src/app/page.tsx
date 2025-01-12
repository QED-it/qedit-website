import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import type { HomePageContent } from '@/types/blocks';

export default function Home() {
  const { data: pageData } = getMarkdownData<HomePageContent>('pages', 'home.md');

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-white min-h-[calc(100vh-5rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex">
          <div className="flex flex-col-reverse md:flex-row items-center md:items-start justify-between w-full">
            <div className="flex-1 max-w-xl z-10 md:mt-[20vh]">
              <h1 className="text-4xl md:text-5xl font-normal text-gray-900 mb-6">{pageData.hero.title}</h1>
              <h2 className="text-xl font-normal text-gray-800 mb-4">{pageData.hero.subtitle}</h2>
              <Link
                href="/contact-us"
                className="inline-block border-2 border-[#38b1df] text-[#38b1df] px-8 py-3 mt-6 rounded-full text-lg font-normal hover:bg-[#38b1df] hover:text-white transition-all"
              >
                I'm interested, tell me more
              </Link>
              {pageData.hero.description && (
                <p className="text-xl text-gray-600 mt-6">{pageData.hero.description}</p>
              )}
            </div>
            <div className="w-full h-[400px] md:h-[500px] lg:h-[800px] relative md:absolute md:right-0 md:top-32 md:w-2/3">
              <Image
                src={pageData.hero.image || "/images/hero.svg"}
                alt="QEDIT Technology Illustration"
                fill
                priority={true}
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-contain object-right-top"
                quality={90}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{pageData.features.header.title}</h2>
            <p className="text-2xl text-gray-800">{pageData.features.header.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageData.features.items.map((feature, index) => (
              <div key={index} className="flex flex-col p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-64 mb-4">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-contain"
                    priority
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link 
                  href={feature.link} 
                  className="text-blue-600 hover:text-blue-800"
                  {...(feature.link.startsWith('http') ? {
                    target: "_blank",
                    rel: "noopener noreferrer"
                  } : {})}
                >
                  {feature.linkText} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">{pageData.benefits.title}</h2>
          <p className="text-xl text-gray-800 mb-12">{pageData.benefits.subtitle}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pageData.benefits.items.map((benefit, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative w-36 h-36 mb-6">
                  <Image
                    src={benefit.icon}
                    alt={benefit.title}
                    fill
                    sizes="(max-width: 768px) 144px, 144px"
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>      

      {/* Partners Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-normal text-center mb-12">{pageData.partners.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {pageData.partners.partners.map((partner, index) => (
              <div key={index} className="relative h-12">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* Media Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mb-24">
          <h2 className="text-3xl font-normal text-center mb-12">{pageData.media.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {pageData.media.items.map((media, index) => (
              <a 
                key={index} 
                href={media.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative h-12"
              >
                <Image
                  src={media.logo}
                  alt={media.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
