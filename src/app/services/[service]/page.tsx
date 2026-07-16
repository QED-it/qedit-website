import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getServiceSlugs,
  getServiceMeta,
  getServiceWorks,
} from '@/lib/services';
import { markdownToHtml } from '@/lib/markdown';

type Params = Promise<{ service: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getServiceSlugs().map((service) => ({ service }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { service } = await params;
  const meta = getServiceMeta(service);
  if (!meta) return {};
  return {
    title: `${meta.title} | QEDIT`,
    description: meta.tagline,
    alternates: {
      canonical: `https://qed-it.com/services/${service}/`,
    },
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const { service } = await params;
  const meta = getServiceMeta(service);
  if (!meta) notFound();

  const works = getServiceWorks(service);
  const bodyHtml = meta.content ? await markdownToHtml(meta.content) : '';

  return (
    <>
      {/* Intro */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 pb-16 md:pb-20">
          <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-4">
            Services
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6">
            {meta.title}
          </h1>
          {meta.tagline && (
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl">
              {meta.tagline}
            </p>
          )}
          {meta.intro && (
            <p className="text-lg text-gray-600 max-w-3xl mt-6">{meta.intro}</p>
          )}
        </div>
      </section>

      {/* Long-form body (from the markdown below the frontmatter) */}
      {bodyHtml && (
        <section className="bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div
              className="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-[#38b1df] [&_pre]:max-w-full [&_pre]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        </section>
      )}

      {/* Work list */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-10">
            Our work
          </h2>
          {works.length === 0 ? (
            <p className="text-gray-500">
              More information about our work in this area coming soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {works.map((w) => (
                <Link
                  key={w.slug}
                  href={`/services/${service}/${w.slug}`}
                  className="group block bg-white p-6 rounded-xl border border-gray-200 hover:border-[#38b1df] transition-colors"
                >
                  {w.context && (
                    <span className="text-xs uppercase tracking-widest text-[#38b1df] font-medium">
                      {w.context}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2">
                    {w.title}
                  </h3>
                  {w.types && w.types.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {w.types.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {w.summary && (
                    <p className="text-sm text-gray-600">{w.summary}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
            Have a {meta.title.toLowerCase()} engagement in mind?
          </h2>
          <Link
            href="/contact-us"
            className="inline-block bg-[#38b1df] text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-[#2c97c2] transition-colors"
          >
            Work with us
          </Link>
        </div>
      </section>
    </>
  );
}