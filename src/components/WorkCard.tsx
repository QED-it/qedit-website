import Link from 'next/link';

type WorkCardData = {
  slug: string;
  title: string;
  context?: string;
  types?: string[];
  summary?: string;
};

export default function WorkCard({
  service,
  work,
}: {
  service: string;
  work: WorkCardData;
}) {
  return (
    <Link
      href={`/services/${service}/${work.slug}`}
      className="group block bg-white p-6 rounded-xl border border-gray-200 hover:border-[#38b1df] transition-colors"
    >
      {work.context && (
        <span className="text-xs uppercase tracking-widest text-[#38b1df] font-medium">
          {work.context}
        </span>
      )}
      <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2">
        {work.title}
      </h3>
      {work.types && work.types.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {work.types.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {work.summary && <p className="text-sm text-gray-600">{work.summary}</p>}
    </Link>
  );
}