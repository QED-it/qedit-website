import ContactForm from '@/components/ContactForm';
import Image from 'next/image';

export default function ContactUs() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Contact us & Leverage your company's data | QEDIT",
            "description": "Want to know more about how QEDIT's Privacy Enhancing Technology can help leverage your company's data? Interested in becoming a partner? Contact us.",
            "url": "https://qed-it.com/contact-us/",
            "dateModified": "2021-04-18T06:53:25+00:00"
          })
        }}
      />
      <div className="min-h-screen bg-white relative pb-0 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-semibold text-gray-900 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Have a question or want to learn more about our solutions? We'd love to hear from you.
            </p>

            <ContactForm key={Date.now()} /> {/* Add key to prevent re-rendering */}
          </div>
        </div>

        {/* Decorative stripes */}
        <div className="relative md:absolute bottom-0 right-0 pointer-events-none mt-0 md:mt-0 flex justify-end w-full md:w-auto">
          <Image
            src="/images/layout/stripes-02.png"
            alt="Decorative stripes"
            width={600}
            height={600}
            style={{ width: '100%', height: 'auto' }}
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
  title: "Contact us & Leverage your company's data | QEDIT",
  description: "Want to know more about how QEDIT's Privacy Enhancing Technology can help leverage your company's data? Interested in becoming a partner? Contact us.",
  alternates: {
    canonical: 'https://qed-it.com/contact-us/',
  },
  openGraph: {
    title: "Contact us & Leverage your company's data | QEDIT",
    description: "Want to know more about how QEDIT's Privacy Enhancing Technology can help leverage your company's data? Interested in becoming a partner? Contact us.",
    url: 'https://qed-it.com/contact-us/',
    locale: 'en_US',
    type: 'article',
    siteName: 'QEDIT',
    modifiedTime: '2021-04-18T06:53:25+00:00',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'article:modified_time': '2021-04-18T06:53:25+00:00',
  }
}; 