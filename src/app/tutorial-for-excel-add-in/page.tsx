import { getMarkdownData } from '@/lib/markdown';
import { marked } from 'marked';
import Image from 'next/image';

interface Section {
  type: 'intro' | 'text' | 'image-text' | 'image';
  title?: string;
  content: string;
  image?: string;
  imageAlt?: string;
  align?: 'left' | 'right';
}

interface TutorialContent {
  title: string;
  sections: Section[];
}

export default function TutorialForExcelAddIn() {
  const { data: pageData } = getMarkdownData<TutorialContent>('pages', 'tutorial-for-excel-add-in.md');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Tutorial QEDIT for Spreadsheets - QEDIT",
            "description": "Get Started with QEDIT for Spreadsheets using our step-by-step tutorial, and discover how your organization can benefit from privacy-enabled data collaboration.",
            "url": "https://qed-it.com/tutorial-for-excel-add-in/",
            "dateModified": "2020-06-15T11:13:18+00:00"
          })
        }}
      />
      <div className="min-h-screen bg-white relative pb-0 md:pb-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold mb-8">{pageData.title}</h1>
          
          {pageData.sections.map((section, index) => {
            switch (section.type) {
              case 'intro':
                return (
                  <div key={index} className="prose max-w-none mb-12">
                    <div 
                      className="text-xl"
                      dangerouslySetInnerHTML={{ __html: marked(section.content) }}
                    />
                  </div>
                );
                
              case 'text':
                return (
                  <div key={index} className="prose max-w-none mb-12">
                    {section.title && <h2 className="text-2xl font-bold mb-4">{section.title}</h2>}
                    <div dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                  </div>
                );
                
              case 'image-text':
                return (
                  <div key={index} className={`flex flex-col ${section.align === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 mb-12`}>
                    {section.image && (
                      <div className="md:w-2/3">
                        <Image
                          src={section.image}
                          alt={section.imageAlt || ''}
                          width={1000}
                          height={667}
                        />
                      </div>
                    )}
                    <div className="md:w-1/3 prose prose-lg max-w-none markdown-content">
                      {section.title && <h2 className="text-2xl font-bold mb-4">{section.title}</h2>}
                      <div dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                    </div>
                  </div>
                );
                
              case 'image':
                return (
                  <div key={index} className="mb-12">
                    {section.image && (
                      <Image
                        src={section.image}
                        alt={section.imageAlt || ''}
                        width={1000}
                        height={667}
                        className="w-full"
                      />
                    )}
                  </div>
                );
            }
          })}
        </div>

        {/* Decorative stripes */}
        <div className="relative md:absolute bottom-0 right-0 pointer-events-none mt-0 md:mt-0 flex justify-end w-full md:w-auto">
          <Image
            src="/images/layout/stripes-02.png"
            alt="Decorative stripes"
            width={600}
            height={300}
            // style={{ width: '100%', height: 'auto' }}
            className="object-contain w-full md:w-auto"
            sizes="(max-width: 768px) 100vw, 600px"
            priority={false}
          />
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Tutorial QEDIT for Spreadsheets - QEDIT',
  description: 'Get Started with QEDIT for Spreadsheets using our step-by-step tutorial, and discover how your organization can benefit from privacy-enabled data collaboration.',
  alternates: {
    canonical: 'https://qed-it.com/tutorial-for-excel-add-in/',
  },
  openGraph: {
    title: 'Tutorial QEDIT for Spreadsheets - QEDIT',
    description: 'Get Started with QEDIT for Spreadsheets using our step-by-step tutorial, and discover how your organization can benefit from privacy-enabled data collaboration.',
    url: 'https://qed-it.com/tutorial-for-excel-add-in/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2020-06-15T11:13:18+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2020-06-15T11:13:18+00:00',
  }
}; 