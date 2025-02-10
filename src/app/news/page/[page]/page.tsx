import { getMarkdownFiles } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

interface PressRelease {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  externalUrl: string;
  priority: boolean;
}

export async function generateStaticParams() {
  const releases = getMarkdownFiles<PressRelease>('press-releases');
  const totalPages = Math.ceil(releases.length / 12);
  
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2)
  }));
}

interface PageProps {
  params: Promise<{ page: string }>;
}

export default async function NewsPaginatedPage({ params }: PageProps) {
  const { page } = await params;
  const pageNumber = parseInt(page);
  const itemsPerPage = 12;

  const pressReleases = getMarkdownFiles<PressRelease>('press-releases')
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const totalPages = Math.ceil(pressReleases.length / itemsPerPage);

  if (pageNumber < 2 || pageNumber > totalPages) {
    notFound();
  }

  const currentItems = pressReleases.slice(
    (pageNumber - 1) * itemsPerPage,
    pageNumber * itemsPerPage
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Read the Latest news & updates on data privacy challenges",
            "description": "Qedit News. Get the latest news about Qedit Privacy Enhancing Technology. Data Collaboration Tools, and the New Data Economy",
            "url": `https://qed-it.com/news/page/${pageNumber}/`,
            "dateModified": "2021-05-09T10:19:38+00:00"
          })
        }}
      />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-semibold text-gray-900 mb-12 text-center md:text-left">News</h1>
          
          {/* Top Pagination */}
          <div className="mb-8 flex justify-center space-x-2">
            <Link
              href="/news"
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              1
            </Link>
            {Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((page) => (
              <Link
                key={page}
                href={`/news/page/${page}`}
                className={`px-4 py-2 rounded-md ${
                  pageNumber === page
                    ? 'bg-[#38b1df] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </Link>
            ))}
          </div>

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
          <div className="mt-8 flex justify-center space-x-2">
            <Link
              href="/news"
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              1
            </Link>
            {Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((page) => (
              <Link
                key={page}
                href={`/news/page/${page}`}
                className={`px-4 py-2 rounded-md ${
                  pageNumber === page
                    ? 'bg-[#38b1df] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
} 