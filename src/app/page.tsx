import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import type { HomePageContent } from '@/types/blocks';

const ACCENT = '#38b1df';

export default function Home() {
  const { data } = getMarkdownData<HomePageContent>('pages', 'home.md');
  const { hero, trustedBy, capabilities, work, zsaHub, closing } = data;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'QEDIT',
            description:
              'Applied cryptography firm specializing in zero-knowledge proofs, formal verification, protocol design, and security audits.',
            url: 'https://qed-it.com/',
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-6">
              {hero.title}
            </h1>
            <p className="text-base md:text-lg font-medium text-[#38b1df] mb-5">
              {hero.disciplines.join('  ·  ')}
            </p>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mb-10">
              {hero.claim}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={hero.primaryCta.href}
                className="inline-block text-center bg-[#38b1df] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#2c97c2] transition-colors"
              >
                {hero.primaryCta.text}
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="inline-block text-center border-2 border-gray-300 text-gray-800 px-8 py-3 rounded-full text-lg font-medium hover:border-[#38b1df] hover:text-[#38b1df] transition-colors"
              >
                {hero.secondaryCta.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="bg-[#1e2125]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-sm uppercase tracking-widest text-white font-medium text-center mb-10">
            {trustedBy.title}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 md:gap-x-16 gap-y-10">
            {trustedBy.clients.map((client) => (
              <div
                key={client.name}
                className="relative h-9 md:h-10 w-28 md:w-36"
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="what-we-do" className="scroll-mt-28 md:scroll-mt-36 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            {capabilities.title}
          </h2>
          {capabilities.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl">{capabilities.subtitle}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {capabilities.items.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group block p-8 rounded-xl border border-gray-200 hover:border-[#38b1df] transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <span className="text-[#38b1df] font-medium group-hover:underline">
                  {item.linkText} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                {work.title}
              </h2>
              {work.subtitle && (
                <p className="text-xl text-gray-600 max-w-2xl">{work.subtitle}</p>
              )}
            </div>
            <Link
              href={work.ctaHref}
              className="text-[#38b1df] font-medium hover:underline whitespace-nowrap"
            >
              {work.ctaText} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {work.items.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className="group block bg-white p-6 rounded-xl border border-gray-200 hover:border-[#38b1df] transition-colors"
              >
                <span className="text-xs uppercase tracking-widest text-[#38b1df] font-medium">
                  {item.context}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2">
                  {item.title}
                </h3>
                {item.types?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.types.map((type) => (
                      <span
                        key={type}
                        className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ZSA Hub spotlight */}
      <section className="bg-[#1e2125] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <span className="text-sm uppercase tracking-widest text-[#38b1df] font-medium">
              ZSA Hub
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mt-3 mb-4">
              {zsaHub.title}
            </h2>
            <p className="text-lg text-gray-300 mb-8">{zsaHub.description}</p>
            <Link
              href={zsaHub.ctaHref}
              className="inline-block bg-[#38b1df] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#2c97c2] transition-colors"
            >
              {zsaHub.ctaText} →
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            {closing.title}
          </h2>
          {closing.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              {closing.subtitle}
            </p>
          )}
          <Link
            href={closing.ctaHref}
            className="inline-block bg-[#38b1df] text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-[#2c97c2] transition-colors"
          >
            {closing.ctaText}
          </Link>
        </div>
      </section>
    </>
  );
}

export const metadata = {
  title: 'Applied Cryptography, ZK Proofs & Security Audits | QEDIT',
  description:
    "Security audits, protocol design, and formal verification for zero-knowledge proofs and cryptographic systems. The team behind Zcash Shielded Assets and the ZKProof standards effort.",
  alternates: {
    canonical: 'https://qed-it.com/',
  },
  openGraph: {
    title: 'Applied Cryptography, ZK Proofs & Security Audits | QEDIT',
    description:
      'Security audits, protocol design, and formal verification for zero-knowledge proofs and cryptographic systems.',
    url: 'https://qed-it.com/',
    locale: 'en_US',
    type: 'website',
    siteName: 'QEDIT',
  },
  twitter: {
    card: 'summary_large_image',
  },
};