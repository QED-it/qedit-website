import { getMarkdownData } from '@/lib/markdown';
import { marked } from 'marked';

interface PrivacyContent {
  title: string;
  date: string;
  content: string;
}

export default function PrivacyPolicy() {
  const { data: pageData, content } = getMarkdownData<PrivacyContent>('pages', 'privacy-policy.md');

  // Process the content using marked
  const renderer = new marked.Renderer();
  renderer.link = ({ href, title, text }: { href: string; title?: string | null | undefined; text: string }) => {
    return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
  };

  const processedContent = marked(content, {
    breaks: true,
    gfm: true,
    renderer: renderer
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy - Read our policy & terms of use - QEDIT",
            "description": "QEDIT Privacy Policy and terms of use. Learn about how we handle and protect your data.",
            "url": "https://qed-it.com/privacy-policy/",
            "dateModified": "2021-04-22T05:31:10+00:00"
          })
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose prose-lg max-w-none">
          <div 
            className="markdown-content text-lg"
            dangerouslySetInnerHTML={{ __html: processedContent }} 
          />
        </article>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Privacy Policy - Read our policy & terms of use - QEDIT',
  description: 'QEDIT Privacy Policy and terms of use. Learn about how we handle and protect your data.',
  alternates: {
    canonical: 'https://qed-it.com/privacy-policy/',
  },
  openGraph: {
    title: 'Privacy Policy - Read our policy & terms of use - QEDIT',
    description: 'QEDIT Privacy Policy and terms of use. Learn about how we handle and protect your data.',
    url: 'https://qed-it.com/privacy-policy/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2021-04-22T05:31:10+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2021-04-22T05:31:10+00:00',
  }
};