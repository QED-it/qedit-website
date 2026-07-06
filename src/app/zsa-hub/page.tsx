import { icons } from 'lucide-react';
import { getMarkdownData } from '@/lib/markdown';
import Link from 'next/link';
import type { ZsaHubPageContent } from '@/types/blocks';

export default function ZsaHub() {
  const { data } = getMarkdownData<ZsaHubPageContent>('pages', 'zsa-hub.md');
  const { hero, overview, useCases, whyItMatters, timeline, research, sections, closing, faq } =
  data;
  const nav = [
    { id: 'overview', label: overview.title },
    { id: 'use-cases', label: useCases.title },
    { id: 'why', label: whyItMatters.title },
    { id: 'history', label: timeline.title },
    { id: 'research', label: research.title },
    ...sections.map((s) => ({ id: s.id, label: s.title })),
    { id: 'faq', label: faq.title },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-[#1e2125] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 pb-16 md:pb-20">
          <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-4">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl">{hero.intro}</p>

          {hero.meta && hero.meta.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/10">
              {hero.meta.map((m) => (
                <div key={m.label}>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                    {m.label}
                  </p>
                  <p className="text-sm text-white">{m.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* In-page nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-20 md:top-32 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 py-4">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm font-medium text-gray-500 hover:text-[#38b1df] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Overview */}
      <section id="overview" className="scroll-mt-36 md:scroll-mt-48 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8">
            {overview.title}
          </h2>
          <div className="max-w-3xl space-y-5">
            {overview.paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-gray-600">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="scroll-mt-36 md:scroll-mt-48 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            {useCases.title}
          </h2>
          {useCases.intro && (
            <p className="text-xl text-gray-600 max-w-2xl mb-12">{useCases.intro}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.items.map((item) => {
              const Icon = item.icon ? icons[item.icon as keyof typeof icons] : null;
              return (
                <div
                  key={item.title}
                  className="bg-white p-6 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {Icon && (
                      <Icon className="w-5 h-5 text-[#38b1df] shrink-0" strokeWidth={2} />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section id="why" className="scroll-mt-36 md:scroll-mt-48 bg-[#1e2125] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold mb-8">
            {whyItMatters.title}
          </h2>
          <div className="max-w-3xl space-y-5">
            {whyItMatters.paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-gray-300">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* History / timeline */}
      <section id="history" className="scroll-mt-36 md:scroll-mt-48 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            {timeline.title}
          </h2>
          {timeline.intro && (
            <p className="text-xl text-gray-600 max-w-2xl mb-12">{timeline.intro}</p>
          )}
          <ol className="relative border-l border-gray-200 ml-1 max-w-3xl">
            {timeline.milestones.map((m, i) => (
              <li key={i} className="ml-6 pb-10 last:pb-0">
                <span className="absolute -left-[7px] mt-1.5 w-3.5 h-3.5 rounded-full bg-[#38b1df] ring-4 ring-white" />
                <p className="text-xs uppercase tracking-widest text-[#38b1df] font-medium mb-1">
                  {m.period}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {m.title}
                </h3>
                <p className="text-gray-600">{m.description}</p>
                {m.href && (
                  <a
                    href={m.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-[#38b1df] font-medium hover:underline"
                  >
                    {m.linkLabel ?? 'Read more'} →
                  </a>
                )}
              </li>
            ))}
          </ol>
          {timeline.note && (
            <p className="max-w-3xl mt-10 p-5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700">
              {timeline.note}
            </p>
          )}
        </div>
      </section>

      {/* Research threads */}
      <section id="research" className="scroll-mt-36 md:scroll-mt-48 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            {research.title}
          </h2>
          {research.intro && (
            <p className="text-xl text-gray-600 max-w-2xl mb-12">{research.intro}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {research.items.map((item) => (
              <div
                key={item.title}
                className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="mt-auto space-y-1">
                  {item.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-[#38b1df] font-medium hover:underline"
                    >
                      {link.label} →
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource sections */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="space-y-16">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="scroll-mt-36 md:scroll-mt-48"
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
                        <p className="text-sm text-gray-600">{link.description}</p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-36 md:scroll-mt-48 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8">
            {faq.title}
          </h2>
          <div className="border-t border-gray-200">
            {faq.items.map((item, i) => (
              <details key={i} className="group border-b border-gray-200 py-5">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-lg font-semibold text-gray-900">
                    {item.question}
                  </span>
                  <svg
                    className="w-5 h-5 shrink-0 text-[#38b1df] transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-3 text-gray-600 leading-relaxed">
                  <p>{item.answer}</p>
                  {item.linkHref && (
                    <a
                      href={item.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm text-[#38b1df] font-medium hover:underline"
                    >
                      {item.linkLabel ?? 'Learn more'} →
                    </a>
                  )}
                </div>
              </details>
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
    'The definitive reference for Zcash Shielded Assets (ZSAs): what they are, why they matter, the multi-year R&D, and every spec, audit, and resource. OrchardZSA, designed by QEDIT.',
  alternates: {
    canonical: 'https://qed-it.com/zsa-hub/',
  },
  openGraph: {
    title: 'ZSA Hub — Zcash Shielded Assets | QEDIT',
    description:
      'The definitive reference for Zcash Shielded Assets: scope, use cases, R&D history, specs, audits, and tooling. Designed by QEDIT.',
    url: 'https://qed-it.com/zsa-hub/',
    locale: 'en_US',
    type: 'website',
    siteName: 'QEDIT',
  },
  twitter: {
    card: 'summary_large_image',
  },
};