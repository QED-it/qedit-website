import Link from 'next/link';
import { getAllServices } from '@/lib/services';

export default function ServicesPage() {
  const services = getAllServices();

  return (
    <>
      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 pb-16 md:pb-20">
          <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-4">
            Services
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-6">
            What we do
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl">
            We design, audit, and prove the cryptography behind critical systems that
            move real value.
          </p>
        </div>
      </section>

      {/* Service cards */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => {
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group flex flex-col bg-white p-8 rounded-xl border border-gray-200 hover:border-[#38b1df] transition-colors"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h2>
                  {service.tagline && (
                    <p className="text-gray-600 mb-6">{service.tagline}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-[#38b1df] font-medium group-hover:underline">
                      Learn more →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Secure what you&apos;re building
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Talk to the team about an audit, a protocol design, or a
            formal-verification engagement.
          </p>
          <Link
            href="/contact-us"
            className="inline-block bg-[#38b1df] text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-[#2c97c2] transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}

export const metadata = {
  title: 'Services — Security Audits, Protocol Design & Formal Verification | QEDIT',
  description:
    'QEDIT designs cryptographic protocols, audits the systems that implement them, and proves them correct with machine-checked proofs in Lean.',
  alternates: {
    canonical: 'https://qed-it.com/services/',
  },
  openGraph: {
    title: 'Services — Security Audits, Protocol Design & Formal Verification | QEDIT',
    description:
      'Security audits, protocol design, and formal verification for zero-knowledge proofs and cryptographic systems.',
    url: 'https://qed-it.com/services',
    locale: 'en_US',
    type: 'website',
    siteName: 'QEDIT',
  },
  twitter: {
    card: 'summary_large_image',
  },
};