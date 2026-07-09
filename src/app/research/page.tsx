import { getMarkdownData } from '@/lib/markdown';
import Link from 'next/link';
import Image from 'next/image';
import type { ResearchPageContent } from '@/types/blocks';

const CONTAINER = 'max-w-[1200px] mx-auto px-6 min-[860px]:px-10';

const EYEBROW =
  'inline-block font-accent font-semibold text-[13px] uppercase tracking-[0.14em] text-[#38B1DF]';

const MOTION = 'transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

const BTN_PRIMARY =
  `inline-flex items-center justify-center gap-2 rounded-full border-2 px-[38px] py-[15px] text-[17px] font-bold leading-none active:scale-[0.97] bg-[#38B1DF] border-[#38B1DF] text-white hover:bg-[#1E97C8] hover:border-[#1E97C8] hover:shadow-[0_8px_24px_rgba(56,177,223,0.28)] ${MOTION}`;

const H2 =
  'font-display font-bold text-[32px] min-[860px]:text-[44px] leading-[1.15] tracking-[-0.02em]';

const FOCUS_META: Record<string, { illustration: string; eyebrow: string }> = {
  'Privacy-preserving technologies': {
    illustration: '/images/illustrations/privacy-enhancing-tech.png',
    eyebrow: 'Privacy',
  },
  'Safe, efficient cryptography in Rust': {
    illustration: '/images/illustrations/secure.png',
    eyebrow: 'Engineering',
  },
  'From paper to production': {
    illustration: '/images/illustrations/standard-crypto.png',
    eyebrow: 'Delivery',
  },
};

export default function Research() {
  const { data } = getMarkdownData<ResearchPageContent>('pages', 'research.md');
  const { hero, expertise, zkproof, ecosystems, darpa, closing } = data;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white overflow-hidden">
        <div
          className="absolute inset-y-0 right-0 w-[56%] hidden min-[860px]:block pointer-events-none"
          aria-hidden="true"
        >
          <Image
            src="/images/backgrounds/wave-flow.png"
            alt=""
            fill
            sizes="56vw"
            priority
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.75)_22%,rgba(255,255,255,0)_55%)]" />
        </div>
        <div className={`${CONTAINER} relative z-10 pt-[104px] pb-[96px]`}>
          <div className="max-w-[660px]">
            <span className={`${EYEBROW} mb-4`}>{hero.eyebrow}</span>
            <h1 className="font-display font-black text-[40px] min-[860px]:text-[56px] leading-[1.08] tracking-[-0.02em] text-[#1E252B] mb-[22px]">
              {hero.title}
            </h1>
            <p className="text-[22px] leading-[1.6] text-[#39434A] max-w-[580px]">
              {hero.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section className="bg-white">
        <div className={`${CONTAINER} py-[104px]`}>
          <div className="max-w-[640px] mb-14">
            <span className={`${EYEBROW} mb-4`}>Focus areas</span>
            <h2 className={`${H2} text-[#1E252B]`}>{expertise.title}</h2>
          </div>
          <div className="grid grid-cols-1 min-[860px]:grid-cols-3 gap-6">
            {expertise.items.map((item) => {
              const meta = FOCUS_META[item.title];
              return (
                <div
                  key={item.title}
                  className="flex flex-col items-start bg-white border border-[#DCE3E7] rounded-2xl p-9"
                >
                  {meta && (
                    <Image
                      src={meta.illustration}
                      alt=""
                      width={92}
                      height={92}
                      className="w-[92px] h-[92px] object-contain mb-5"
                    />
                  )}
                  {meta && <span className={`${EYEBROW} mb-2`}>{meta.eyebrow}</span>}
                  <h3 className="font-display font-bold text-[22px] leading-[1.25] tracking-[-0.02em] text-[#1E252B] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-base leading-[1.6] text-[#39434A]">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ZKProof spotlight */}
      <section className="relative bg-[#09053A] text-white overflow-hidden">
        <div
          className="absolute inset-y-0 right-0 w-[52%] hidden min-[860px]:block opacity-60 pointer-events-none"
          aria-hidden="true"
        >
          <Image
            src="/images/backgrounds/wave-corner.png"
            alt=""
            fill
            sizes="52vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#09053A_0%,rgba(9,5,58,0.55)_26%,rgba(9,5,58,0)_60%)]" />
        </div>
        <div className={`${CONTAINER} relative z-10 py-[104px]`}>
          <div className="flex flex-col min-[860px]:flex-row min-[860px]:items-center gap-12">
            <div className="max-w-[640px]">
              <span className="inline-block font-accent font-semibold text-[13px] uppercase tracking-[0.14em] text-[#56CDEE] mb-4">
                {zkproof.eyebrow}
              </span>
              <h2 className={`${H2} text-white mb-5`}>{zkproof.title}</h2>
              <p className="text-[18px] leading-[1.6] text-white/[0.78] mb-9">
                {zkproof.description}
              </p>
              <a
                href={zkproof.linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className={BTN_PRIMARY}
              >
                {zkproof.linkText} →
              </a>
            </div>
            {zkproof.image && (
              <div className="min-[860px]:flex-1 flex justify-center min-[860px]:justify-end">
                <div className="relative w-full max-w-[260px] h-28 min-[860px]:h-36">
                  <Image
                    src={zkproof.image}
                    alt="ZKProof"
                    fill
                    sizes="260px"
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ecosystems */}
      <section className="bg-[#F7F9FA]">
        <div className={`${CONTAINER} py-[104px]`}>
          <div className="max-w-[640px] mb-14">
            <span className={`${EYEBROW} mb-4`}>Ecosystems</span>
            <h2 className={`${H2} text-[#1E252B] mb-4`}>{ecosystems.title}</h2>
            {ecosystems.subtitle && (
              <p className="text-[18px] leading-[1.6] text-[#39434A]">
                {ecosystems.subtitle}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-6">
            {ecosystems.items.map((item) => (
              <div
                key={item.name}
                className="bg-white border border-[#DCE3E7] rounded-2xl p-[30px]"
              >
                <h3 className="font-display font-bold text-[22px] leading-[1.25] tracking-[-0.02em] text-[#1E252B] mb-2.5">
                  {item.name}
                </h3>
                <p className="text-base leading-[1.6] text-[#39434A]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DARPA */}
      <section className="bg-white">
        <div className={`${CONTAINER} py-[104px]`}>
          <div className="grid grid-cols-1 min-[960px]:grid-cols-[1.1fr_1fr] gap-8 min-[960px]:gap-16 items-center">
            <div>
              <span className={`${EYEBROW} mb-4`}>{darpa.eyebrow}</span>
              <h2 className={`${H2} text-[#1E252B] mb-[18px]`}>{darpa.title}</h2>
              <p className="text-[18px] leading-[1.6] text-[#39434A]">
                {darpa.description}
              </p>
            </div>
            <div className="order-first min-[960px]:order-none bg-[linear-gradient(160deg,#EAF9FF,#F7FBFE)] border border-[#DCE3E7] rounded-2xl p-10 flex items-center justify-center aspect-[4/3]">
              <Image
                src="/images/illustrations/benchmarking-stats.png"
                alt=""
                width={360}
                height={360}
                className="w-full max-w-[360px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#F7F9FA]">
        <div className={`${CONTAINER} py-[120px] text-center`}>
          <div className="max-w-[680px] mx-auto">
            <span className={`${EYEBROW} mb-4`}>Work with us</span>
            <h2 className="font-display font-black text-[40px] min-[860px]:text-[56px] leading-[1.08] tracking-[-0.02em] text-[#1E252B] mb-5">
              {closing.title}
            </h2>
            {closing.subtitle && (
              <p className="text-[18px] leading-[1.6] text-[#39434A] max-w-[520px] mx-auto mb-10">
                {closing.subtitle}
              </p>
            )}
            <Link href={closing.ctaHref} className={BTN_PRIMARY}>
              {closing.ctaText}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export const metadata = {
  title: 'Research | QEDIT',
  description:
    "QEDIT's cryptography research: co-founders of the ZKProof standardization effort, with R&D across Zcash, Solana, Ethereum, permissioned networks, and DARPA-funded zero-knowledge work. We bring academic cryptography to production in Rust.",
  alternates: {
    canonical: 'https://qed-it.com/research/',
  },
  openGraph: {
    title: 'Research | QEDIT',
    description:
      'Co-founders of ZKProof. R&D across public and permissioned chains. Bringing academic cryptography to production.',
    url: 'https://qed-it.com/research/',
    locale: 'en_US',
    type: 'website',
    siteName: 'QEDIT',
  },
  twitter: {
    card: 'summary_large_image',
  },
};
