import { getMarkdownData, getMarkdownFiles } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { NewsPageContent } from '@/types/blocks';
import { OG_DEFAULTS, TWITTER_DEFAULTS } from '@/lib/seo';

interface PressRelease {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  externalUrl: string;
  priority: boolean;
}

export default function NewsPage() {
  const itemsPerPage = 12;

  const { data } = getMarkdownData<NewsPageContent>('pages', 'news.md');
  const { hero, asSeenIn, pressKit, coverage } = data;

  const pressReleases = getMarkdownFiles<PressRelease>('press-releases')
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const totalPages = Math.ceil(pressReleases.length / itemsPerPage);
  const currentItems = pressReleases.slice(0, itemsPerPage);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Press — QEDIT in the press",
            "description": "Press coverage, media assets, and company background for QEDIT, an applied cryptography firm.",
            "url": "https://qed-it.com/news",
            "dateModified": new Date().toISOString()
          })
        }}
      />

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 pb-16">
          <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-4">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-6">
            {hero.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl">{hero.intro}</p>
        </div>
      </section>

      {/* As seen in */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-sm uppercase tracking-widest text-gray-500 text-center mb-10">
            {asSeenIn.title}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 md:gap-x-16 gap-y-10">
            {asSeenIn.outlets.map((outlet) => (
              <div key={outlet.name} className="relative h-8 md:h-9 w-28 md:w-36">
                <Image
                  src={outlet.logo}
                  alt={outlet.name}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press kit */}
      <section className="bg-[#1e2125] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-3">
            {pressKit.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">{pressKit.title}</h2>
          <p className="text-lg text-gray-300 max-w-2xl mb-10">{pressKit.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pressKit.links.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="group block p-6 rounded-xl border border-white/15 hover:border-[#38b1df] transition-colors"
                >
                  <h3 className="text-base font-semibold group-hover:text-[#38b1df] transition-colors mb-1">
                    {link.label} →
                  </h3>
                  {link.description && (
                    <p className="text-sm text-gray-400">{link.description}</p>
                  )}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group block p-6 rounded-xl border border-white/15 hover:border-[#38b1df] transition-colors"
                >
                  <h3 className="text-base font-semibold group-hover:text-[#38b1df] transition-colors mb-1">
                    {link.label} →
                  </h3>
                  {link.description && (
                    <p className="text-sm text-gray-400">{link.description}</p>
                  )}
                </Link>
              )
            )}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            {coverage.title}
          </h2>
          {coverage.intro && (
            <p className="text-xl text-gray-600 max-w-2xl mb-12">{coverage.intro}</p>
          )}

          {/* Top Pagination */}
          {totalPages > 1 && (
            <div className="mb-8 flex justify-center space-x-2">
              <Link
                href="/news"
                className="px-4 py-2 rounded-md bg-[#38b1df] text-white"
              >
                1
              </Link>
              {Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((page) => (
                <Link
                  key={page}
                  href={`/news/page/${page}`}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {page}
                </Link>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map(({ data }, index) => (
              <a
                key={index}
                href={data.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group h-full"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="relative h-48 w-full bg-transparent">
                    <Image
                      src={`/images/logos/${data.image}`}
                      alt={data.title}
                      fill
                      className="object-contain px-4 pt-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={data.priority}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#38b1df] transition-colors">
                      {data.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      {formatDate(data.date)} by {data.author}
                    </p>
                    <p className="text-gray-600 flex-1">
                      {data.excerpt}
                    </p>
                    <p className="text-[#38b1df] mt-4 flex items-center font-medium">
                      Read More <span className="ml-2">→</span>
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <Link
                href="/news"
                className="px-4 py-2 rounded-md bg-[#38b1df] text-white"
              >
                1
              </Link>
              {Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((page) => (
                <Link
                  key={page}
                  href={`/news/page/${page}`}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {page}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Press — QEDIT in the press | QEDIT',
  description:
    'Press coverage, media assets, and company background for QEDIT. Our work in zero-knowledge proofs, protocol design, and security audits, as covered by the press.',
  alternates: {
    canonical: 'https://qed-it.com/news/',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: 'Press — QEDIT in the press | QEDIT',
    description:
      'Press coverage, media assets, and company background for QEDIT.',
    url: 'https://qed-it.com/news/',
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: 'Press — QEDIT in the press | QEDIT',
  },
};