import { getMarkdownFiles } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface PressRelease {
  title: string;
  date: string;
  author: string;
  excerpt: string;
  image: string;
  externalUrl: string;
  priority: boolean;
}

interface NewsPageProps {
  searchParams: { page?: string };
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  // Use Promise.resolve to properly await the searchParams
  const params = await Promise.resolve(searchParams);
  const currentPage = Number(params?.page) || 1;
  const itemsPerPage = 12;
  
  // Get and sort the press releases
  const pressReleases = getMarkdownFiles<PressRelease>('press-releases')
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const totalPages = Math.ceil(pressReleases.length / itemsPerPage);
  const currentItems = pressReleases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-semibold text-gray-900 mb-12 text-center md:text-left">News</h1>
        
        {/* Top Pagination */}
        {totalPages > 1 && (
          <div className="mb-8 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={`/news?page=${page}`}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-[#38b1df] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
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
      </div>
    </div>
  );
} 