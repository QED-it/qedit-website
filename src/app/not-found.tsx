import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-44 pb-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-sm uppercase tracking-widest text-[#38b1df] font-medium mb-4">
          404
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6">
          We couldn&apos;t find this page
        </h1>
        <Link
          href="/"
          className="inline-block bg-[#38b1df] text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-[#2c97c2] transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}