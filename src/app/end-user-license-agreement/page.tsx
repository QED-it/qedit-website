import { getMarkdownData } from '@/lib/markdown';
import { marked } from 'marked';

interface LicenseContent {
  title: string;
  date: string;
  content: string;
}

export default function EndUserLicenseAgreement() {
  const { content } = getMarkdownData<LicenseContent>('pages', 'end-user-license-agreement.md');

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
            "name": "End User License Agreement - QEDIT",
            "url": "https://qed-it.com/end-user-license-agreement/",
            "dateModified": "2020-06-15T10:35:18+00:00",
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
  title: 'End User License Agreement - QEDIT',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://qed-it.com/end-user-license-agreement/',
  },
  openGraph: {
    title: 'End User License Agreement - QEDIT',
    url: 'https://qed-it.com/end-user-license-agreement/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2020-06-15T10:35:18+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2020-06-15T10:35:18+00:00',
  }
}; 