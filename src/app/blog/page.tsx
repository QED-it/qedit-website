import { getMarkdownFiles } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface BlogPost {
  title: string;
  date: string;
  authors: string[];
  excerpt: string;
  image: string;
  priority: boolean;
}

export default function BlogPage() {
  const currentPage = 1;
  const itemsPerPage = 9;
  
  // Get and sort the blog posts
  const blogPosts = getMarkdownFiles<BlogPost>('blog')
    .map(post => ({
      ...post,
      slug: post.fileName.replace(/\.md$/, '') // Remove .md extension to create slug
    }))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const totalPages = Math.ceil(blogPosts.length / itemsPerPage);
  const currentItems = blogPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "QEDIT's Blog: Learn more about Privacy Enhancing Technology",
            "description": "Want info about Privacy Enhancing Technology and how it can help your company leverage data? Enter our blog and Read our professional Blog Posts. Click >>>",
            "url": "https://qed-it.com/blog/",
            "dateModified": "2021-04-20T13:43:10+00:00"
          })
        }}
      />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-semibold text-gray-900 mb-8 text-center md:text-left">Blog</h1>
          
          {/* Top Pagination */}
          {totalPages > 1 && (
            <div className="mb-8 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blog?page=${page}`}
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
            {currentItems.map(({ data, slug }, index) => (
              <Link
                key={index}
                href={`/${slug}`}
                className="group h-full"
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="relative h-64 w-full bg-gray-50">
                    <Image
                      src={data.image}
                      alt={data.title}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={data.priority}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#38b1df] transition-colors">
                      {data.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      {formatDate(data.date)} by {
                        Array.isArray(data.authors) 
                          ? data.authors.length > 1
                            ? data.authors.slice(0, -1).join(', ') + ' and ' + data.authors.slice(-1)
                            : data.authors[0]
                          : data.authors
                      }
                    </p>
                    <p className="text-gray-600 flex-1">
                      {data.excerpt}
                    </p>
                    <p className="text-[#38b1df] mt-4 flex items-center font-medium">
                      Read More <span className="ml-2">→</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Pagination (existing) */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/blog?page=${page}`}
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
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: "QEDIT's Blog: Learn more about Privacy Enhancing Technology",
  description: 'Want info about Privacy Enhancing Technology and how it can help your company leverage data? Enter our blog and Read our professional Blog Posts.',
  alternates: {
    canonical: 'https://qed-it.com/blog/',
  },
  openGraph: {
    title: "QEDIT's Blog: Learn more about Privacy Enhancing Technology",
    description: 'Want info about Privacy Enhancing Technology and how it can help your company leverage data? Enter our blog and Read our professional Blog Posts.',
    url: 'https://qed-it.com/blog/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2021-04-20T13:43:10+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2021-04-20T13:43:10+00:00',
  }
}; 