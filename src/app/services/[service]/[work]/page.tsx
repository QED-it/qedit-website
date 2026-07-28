import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllWorkParams, getWork, getServiceMeta } from '@/lib/services';
import { markdownToHtml } from '@/lib/markdown';

type Params = Promise<{ service: string; work: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllWorkParams();
}

export async function generateMetadata({ params }: { params: Params }) {
  const { service, work } = await params;
  const w = getWork(service, work);
  if (!w) return {};

  // SEO title: explicit metaTitle if set, otherwise the on-page H1.
  const title = w.metaTitle
    ? `${w.metaTitle} | QEDIT`
    : `${w.title} | QEDIT`;
  
  // SEO description: explicit metaDescription, else summary (truncated by Google).
  const description = w.metaDescription ?? w.summary;

    return {
    title: title,
    description: description,
    alternates: {
      canonical: `https://qed-it.com/services/${service}/${work}/`,
    },
  };
}

export default async function WorkPage({ params }: { params: Params }) {
  const { service, work } = await params;
  const w = getWork(service, work);
  if (!w) notFound();

  const svc = getServiceMeta(service);
  const bodyHtml = w.content ? await markdownToHtml(w.content) : '';

  return (
    <article className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 pb-24">
        <Link
          href={`/services/${service}`}
          className="text-sm text-[#38b1df] font-medium hover:underline"
        >
          ← {svc?.title ?? 'Back'}
        </Link>

        {w.context && (
          <p className="text-xs uppercase tracking-widest text-[#38b1df] font-medium mt-8 mb-2">
            {w.context}
          </p>
        )}
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
          {w.title}
        </h1>

        {w.types && w.types.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
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
          <p className="text-xl text-gray-700 mb-8">{w.summary}</p>
        )}

        {w.report && (
          <a
            href={w.report}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#38b1df] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2c97c2] transition-colors mb-12"
          >
            Read the report →
          </a>
        )}

        {bodyHtml && (
          <div className="min-w-0 max-w-full overflow-hidden">
            <div
              className="prose prose-lg max-w-none min-w-0 prose-headings:font-semibold prose-a:text-[#38b1df] [&_pre]:max-w-full [&_pre]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </div>
        )}
      </div>
    </article>
  );
}