import { getMarkdownData } from '@/lib/markdown';
import Link from 'next/link';
import type { ZsaHubPageContent } from '@/types/blocks';

export default function ZsaHub() {
  const { data } = getMarkdownData<ZsaHubPageContent>('pages', 'zsa-hub.md');
  const { hero, sections, closing } = data;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1e2125] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 pb-16 md:pb-24">
          <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-4">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl">
            {hero.intro}
          </p>
        </div>
      </section>

      {/* Resource sections */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* In-page nav */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 mb-16 pb-6 border-b border-gray-100">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm font-medium text-gray-500 hover:text-[#38b1df] transition-colors"
              >
                {s.title}
              </a>
            ))}
          </nav>

          <div className="space-y-16">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-28 md:scroll-mt-36"
              >
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                  {section.title}
                </h2>
                {section.intro && (
                  <p className="text-lg text-gray-600 max-w-3xl mb-6">
                    {section.intro}
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-6 rounded-xl border border-gray-200 hover:border-[#38b1df] transition-colors"
                    >
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#38b1df] transition-colors mb-1">
                        {link.label} →
                      </h3>
                      {link.description && (
                        <p className="text-sm text-gray-600">
                          {link.description}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
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
  title: 'ZSA Hub — Zcash Shielded Assets | QEDIT',
  description:
    'The canonical reference for Zcash Shielded Assets (ZSAs): the OrchardZSA specs (ZIP 226 and ZIP 227), asset swaps, the Least Authority audit, tooling, and talks. Designed by QEDIT.',
  alternates: {
    canonical: 'https://qed-it.com/zsa-hub/',
  },
  openGraph: {
    title: 'ZSA Hub — Zcash Shielded Assets | QEDIT',
    description:
      'The canonical reference for Zcash Shielded Assets: specs, audits, tooling, and talks. Designed by QEDIT.',
    url: 'https://qed-it.com/zsa-hub/',
    locale: 'en_US',
    type: 'website',
    siteName: 'QEDIT',
  },
  twitter: {
    card: 'summary_large_image',
  },
};