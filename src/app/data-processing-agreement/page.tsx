import { getMarkdownData } from '@/lib/markdown';
import { marked } from 'marked';
import type { Tokens } from 'marked';

interface DPAContent {
  title: string;
  date: string;
  content: string;
}

export default function DataProcessingAgreement() {
  const { content } = getMarkdownData<DPAContent>('pages', 'data-processing-agreement.md');
  
  // Add null check for content
  if (!content) {
    console.error('No content found in data-processing-agreement.md');
    return <div>Content not found</div>;
  }

  // Process the content using marked
  const renderer = new marked.Renderer();
  
  // Custom renderer for text to handle underlines
  renderer.text = function(text: Tokens.Text | Tokens.Escape) {
    const textContent = text.raw || text.text || text.toString();
    return textContent.replace(/_(.*?)_/g, '<span style="text-decoration: underline;">$1</span>');
  };

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
            "name": "Data Processing Agreement - QEDIT",
            "url": "https://qed-it.com/data-processing-agreement/",
            "dateModified": "2021-04-13T12:39:36+00:00"
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
  title: 'Data Processing Agreement - QEDIT',
  alternates: {
    canonical: 'https://qed-it.com/data-processing-agreement/',
  },
  openGraph: {
    title: 'Data Processing Agreement - QEDIT',
    url: 'https://qed-it.com/data-processing-agreement/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2021-04-13T12:39:36+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2021-04-13T12:39:36+00:00',
  }
}; 