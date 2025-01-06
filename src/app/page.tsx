import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between py-20 gap-12">
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Privacy-Preserving Enterprise Solutions
          </h1>
          <p className="text-xl text-gray-600">
            Empowering businesses with zero-knowledge proof technology for secure and private blockchain transactions.
          </p>
        </div>
        <div className="flex-1 w-full">
          <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px]">
            <Image
              src="/hero.png"
              alt="QEDIT Technology Illustration"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
