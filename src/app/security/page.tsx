import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';

interface SecurityContent {
  title: string;
  content: {
    intro: string;
    standardsLink1: string;
    standardsText1: string;
    iso: {
      description: string;
      standardsLink2: string;
      standardsText2: string;
    };
    details: string;
    certificateLink: string;
  };
}

export default function Security() {
  const { data: pageData } = getMarkdownData<SecurityContent>('pages', 'security.md');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "QEDIT is recognized as ISO/IEC 270001 compliant | QEDIT",
            "description": "QEDIT is proud to be recognized as ISO/IEC 270001 compliant by the ANSI National Accreditation Board, IQNet and the Standards Institution of Israel.",
            "url": "https://qed-it.com/security/",
            "dateModified": "2021-04-18T06:58:53+00:00"
          })
        }}
      />
      <div className="min-h-screen bg-white relative pb-0 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold text-gray-900 mb-12">
              {pageData.title}
            </h1>

            {/* ISO Certificate Image */}
            <div className="mb-12 flex justify-start">
              <div className="relative w-48 h-48">
                <Image
                  src="/images/logos/iso-certified.png"
                  alt="ISO 27001 Certification"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 192px, 192px"
                  priority
                />
              </div>
            </div>

            {/* Introduction Text */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-600">
                {pageData.content.intro}{' '}
                <Link 
                  href="https://www.iso.org/standard/27001"
                  className="text-[#38b1df] hover:text-[#2d8eb2]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pageData.content.standardsLink1}
                </Link>{' '}
                {pageData.content.standardsText1}
              </p>
            </div>

            {/* ISO Description */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-600">
                {pageData.content.iso.description}{' '}
                <Link 
                  href="https://www.iso.org/standard/27001"
                  className="text-[#38b1df] hover:text-[#2d8eb2]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pageData.content.iso.standardsLink2}
                </Link>{' '}
                {pageData.content.iso.standardsText2}
              </p>
            </div>

            {/* Details */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-600">
                {pageData.content.details}
              </p>
            </div>

            {/* Certificate Link */}
            <div className="mt-12">
              <Link
                href="/certificate.pdf"
                className="inline-block border-2 border-[#38b1df] text-[#38b1df] px-8 py-3 rounded-full text-lg font-normal hover:bg-[#38b1df] hover:text-white transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {pageData.content.certificateLink}
              </Link>
            </div>
          </div>
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
  title: 'QEDIT is recognized as ISO/IEC 270001 compliant | QEDIT',
  description: 'QEDIT is proud to be recognized as ISO/IEC 270001 compliant by the ANSI National Accreditation Board, IQNet and the Standards Institution of Israel.',
  alternates: {
    canonical: 'https://qed-it.com/security/',
  },
  openGraph: {
    title: 'QEDIT is recognized as ISO/IEC 270001 compliant | QEDIT',
    description: 'QEDIT is proud to be recognized as ISO/IEC 270001 compliant by the ANSI National Accreditation Board, IQNet and the Standards Institution of Israel.',
    url: 'https://qed-it.com/security/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2021-04-18T06:58:53+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2021-04-18T06:58:53+00:00',
  }
}; 