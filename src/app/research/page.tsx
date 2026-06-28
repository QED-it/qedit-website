import { getMarkdownData } from '@/lib/markdown';
import Link from 'next/link';
import type { ResearchPageContent } from '@/types/blocks';

export default function Research() {
  const { data } = getMarkdownData<ResearchPageContent>('pages', 'research.md');
  const { hero, expertise, zkproof, ecosystems, darpa, closing } = data;

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 pb-16 md:pb-20">
          <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-4">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-6">
            {hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl">
            {hero.intro}
          </p>
        </div>
      </section>

      {/* Expertise */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-12">
            {expertise.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expertise.items.map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-xl border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZKProof */}
      <section className="bg-[#1e2125] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-3">
              {zkproof.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              {zkproof.title}
            </h2>
            <p className="text-lg text-gray-300 mb-8">{zkproof.description}</p>
            <a
              href={zkproof.linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#38b1df] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#2c97c2] transition-colors"
            >
              {zkproof.linkText} →
            </a>
          </div>
        </div>
      </section>

      {/* Ecosystems */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            {ecosystems.title}
          </h2>
          {ecosystems.subtitle && (
            <p className="text-xl text-gray-600 max-w-2xl mb-12">
              {ecosystems.subtitle}
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ecosystems.items.map((item) => (
              <div
                key={item.name}
                className="bg-white p-6 rounded-xl border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DARPA */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-3">
              {darpa.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              {darpa.title}
            </h2>
            <p className="text-lg text-gray-600 mb-8">{darpa.description}</p>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-gray-50 border-t border-gray-100">
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
  title: 'Research | QEDIT',
  description:
    "QEDIT's cryptography research: co-founders of the ZKProof standardization effort, with R&D across Zcash, Solana, Ethereum, permissioned networks, and DARPA-funded zero-knowledge work. We bring academic cryptography to production in Rust.",
  alternates: {
    canonical: 'https://qed-it.com/research/',
  },
  openGraph: {
    title: 'Research | QEDIT',
    description:
      'Co-founders of ZKProof. R&D across public and permissioned chains. Bringing academic cryptography to production.',
    url: 'https://qed-it.com/research/',
    locale: 'en_US',
    type: 'website',
    siteName: 'QEDIT',
  },
  twitter: {
    card: 'summary_large_image',
  },
};