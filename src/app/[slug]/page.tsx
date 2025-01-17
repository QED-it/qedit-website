import { getMarkdownFiles } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { marked } from 'marked';

interface BlogPost {
  title: string;
  date: string;
  authors: string[];
  excerpt: string;
  content: string;
  image: string;
  priority: boolean;
}

export async function generateStaticParams() {
  const posts = getMarkdownFiles<BlogPost>('blog');
  return posts.map((post) => ({
    slug: post.fileName.replace(/\.md$/, '')
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // Properly resolve the slug parameter at the start
  const { slug } = await params;

  // Get current blog post
  const posts = getMarkdownFiles<BlogPost>('blog');
  const currentPost = posts.find(
    post => post.fileName.replace(/\.md$/, '') === slug  // Use resolved slug
  );

  if (!currentPost) {
    notFound();
  }

  // Process the content using marked
  const renderer = new marked.Renderer();
  renderer.link = ({ href, title, text }: { href: string; title?: string | null | undefined; text: string }) => {
    return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  };

  const processedContent = marked(currentPost.content, {
    breaks: true,
    gfm: true,
    renderer: renderer
  });

  // Get latest 5 posts for sidebar
  const latestPosts = posts
    .filter(post => post.fileName.replace(/\.md$/, '') !== slug)  // Use resolved slug
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .slice(0, 5);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const fullUrl = `${siteUrl}/${slug}`;  // Use resolved slug

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-12 gap-8 relative">
        {/* Social Share Column */}
        <div className="hidden md:block col-span-1">
          <div className="sticky top-32 flex flex-col space-y-4">
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(currentPost.data.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38b1df] hover:text-black transition-colors mt-5"
            >
              <span className="sr-only">X (Twitter)</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.67068L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0185L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
              </svg>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38b1df] hover:text-[#4267B2] transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(currentPost.data.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38b1df] hover:text-[#0077B5] transition-colors"
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <article className="col-span-12 md:col-span-8">
          <div className="prose prose-lg max-w-none">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-gray-900 hover:text-[#38b1df] transition-colors mb-6"
            >
              <span className="mr-1">←</span> Back to Blog
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentPost.data.title}</h1>
            <div className="flex items-center text-gray-600 mb-8">
              <span>{formatDate(currentPost.data.date)}</span>
              <span className="mx-2">•</span>
              <span>
                {currentPost.data.authors.length > 1
                  ? currentPost.data.authors.slice(0, -1).join(', ') + ' and ' + currentPost.data.authors.slice(-1)
                  : currentPost.data.authors[0]}
              </span>
            </div>
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: processedContent }} 
            />
          </div>
        </article>

        {/* Mobile Divider */}
        <div className="col-span-12 md:hidden">
          <hr />
        </div>

        {/* Desktop Vertical Divider */}
        <div className="hidden md:block absolute right-[25%] top-0 bottom-0 w-px bg-gray-200" />

        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <div className='md:pl-5'>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Latest Posts</h2>
            <div className="space-y-6 divide-y divide-gray-200">
              {latestPosts.map((post, index) => (
                <Link
                  key={index}
                  href={`/${post.fileName.replace(/\.md$/, '')}`}
                  className="block group pt-6 first:pt-0"
                >
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-[#38b1df] transition-colors">
                    {post.data.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDate(post.data.date)}
                  </p>
                  <p className="mt-2 flex items-center text-gray-900 group-hover:text-[#38b1df] transition-colors">
                    Read More <span className="ml-1">→</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
} 