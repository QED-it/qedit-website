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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article className="prose prose-lg max-w-none">
        <div 
          className="markdown-content text-lg"
          dangerouslySetInnerHTML={{ __html: processedContent }} 
        />
      </article>
    </div>
  );
}