import { getMarkdownData } from '@/lib/markdown';
import FAQAccordion from '@/components/FAQAccordion';
import Image from 'next/image';

interface CareersContent {
  title: string;
  subtitle: string;
  text: string;
  openPositions: Array<{
    title: string;
    description: string;
  }>;
  otherOpportunities: {
    title: string;
    description: string;
    contact: string;
    email: string;
  };
}

export default function Careers() {
  const { data: pageData } = getMarkdownData<CareersContent>('pages', 'careers.md');

  return (
    <div className="min-h-screen bg-white relative pb-16 md:pb-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-semibold text-gray-900 mb-6">
          {pageData.title}
        </h1>
        
        <h2 className="text-2xl text-gray-700 mb-8">
          {pageData.subtitle}
        </h2>

        <div className="prose prose-lg max-w-none mb-16">
          {pageData.text.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-600 mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Open Positions Section with gray background */}
        <div className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            Open Positions
          </h2>

          <FAQAccordion questions={pageData.openPositions.map(position => ({
            question: position.title,
            answer: position.description.replace(/\n/g, '<br />')
          }))} />
        </div>

        {/* Other Opportunities Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            {pageData.otherOpportunities.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {pageData.otherOpportunities.description}
          </p>
          <p className="text-xl">
            {pageData.otherOpportunities.contact}{' '}
            <a 
              href={`mailto:${pageData.otherOpportunities.email}`}
              className="text-[#38b1df] hover:text-[#2d8eb2] transition-colors"
            >
              <strong>{pageData.otherOpportunities.email}</strong>
            </a>
          </p>
        </div>

        {/* Office Images Section */}
        <div className="mt-24">
          <div className="relative w-full">
            <Image
              src="/images/office-collage-1.png"
              alt="QEDIT Office Life"
              width={1200}
              height={800}
              className="w-full rounded-lg"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority={false}
            />
          </div>
        </div>
      </div>

      {/* Decorative stripes */}
      <div className="relative md:absolute bottom-0 right-0 pointer-events-none -mb-16 md:mb-0 flex justify-end w-full md:w-auto">
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
  );
} 