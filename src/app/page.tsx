import { getMarkdownData } from '@/lib/markdown';
import Image from 'next/image';
import Link from 'next/link';
import type { HomePageContent } from '@/types/blocks';

const CONTAINER = 'max-w-[1200px] mx-auto px-6 min-[860px]:px-10';

const EYEBROW =
  'inline-block font-accent font-semibold text-[13px] uppercase tracking-[0.14em] text-[#38B1DF]';

const MOTION = 'transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

const BTN =
  `inline-flex items-center justify-center gap-2 rounded-full border-2 px-[38px] py-[15px] text-[17px] font-bold leading-none active:scale-[0.97] ${MOTION}`;

const BTN_PRIMARY =
  `${BTN} bg-[#38B1DF] border-[#38B1DF] text-white hover:bg-[#1E97C8] hover:border-[#1E97C8] hover:shadow-[0_8px_24px_rgba(56,177,223,0.28)]`;

const BTN_SECONDARY =
  `${BTN} bg-transparent border-[#38B1DF] text-[#1E97C8] hover:bg-[#EAF9FF]`;

const CARD =
  `bg-white border border-[#DCE3E7] rounded-2xl hover:border-[#38B1DF] hover:-translate-y-[3px] hover:shadow-[0_4px_12px_rgba(9,5,58,0.08),0_2px_4px_rgba(9,5,58,0.05)] ${MOTION}`;

const BADGE =
  'inline-flex items-center rounded-full px-[14px] py-[6px] text-[13px] font-semibold';

const CAPABILITY_META: Record<string, { illustration: string; eyebrow: string }> = {
  'Security Audits': {
    illustration: '/images/illustrations/certified-secure.png',
    eyebrow: 'Audits',
  },
  'Protocol Design': {
    illustration: '/images/illustrations/standard-crypto.png',
    eyebrow: 'Engineering',
  },
  'Formal Verification': {
    illustration: '/images/illustrations/checkmark.png',
    eyebrow: 'Assurance',
  },
  'Research & Standardization': {
    illustration: '/images/illustrations/benchmarking-stats.png',
    eyebrow: 'Field work',
  },
};

const BADGE_TONES: Record<string, string> = {
  Audit: 'bg-[#EAF9FF] text-[#1E97C8]',
  Protocol: 'bg-[rgba(9,5,58,0.08)] text-[#09053A]',
  Research: 'bg-[rgba(255,192,46,0.25)] text-[#1E252B]',
};

const BADGE_TONE_NEUTRAL = 'bg-[#EEF1F3] text-[#39434A]';

export default function Home() {
  const { data } = getMarkdownData<HomePageContent>('pages', 'home.md');
  const { hero, trustedBy, capabilities, work, zsaHub, closing } = data;

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
        <div className={`${CONTAINER} relative z-10 pt-[112px] pb-[120px]`}>
          <div className="max-w-[640px]">
            <span className={`${EYEBROW} mb-4`}>Applied Cryptography</span>
            <h1 className="font-display font-black text-[40px] min-[860px]:text-[56px] leading-[1.08] tracking-[-0.02em] text-[#1E252B] mb-6">
              {hero.title}
            </h1>
            <div className="flex flex-wrap gap-2.5 mb-7">
              {hero.disciplines.map((discipline) => (
                <span key={discipline} className={`${BADGE} bg-[#EAF9FF] text-[#1E97C8]`}>
                  {discipline}
                </span>
              ))}
            </div>
            <p className="text-[22px] leading-[1.6] text-[#39434A] max-w-[560px] mb-9">
              {hero.claim}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={hero.primaryCta.href} className={BTN_PRIMARY}>
                {hero.primaryCta.text}
              </Link>
              <Link href={hero.secondaryCta.href} className={BTN_SECONDARY}>
                {hero.secondaryCta.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="bg-[#1E252B]">
        <div className={`${CONTAINER} py-[52px]`}>
          <p className="text-center mb-[34px]">
            <span className="font-accent font-semibold text-[13px] uppercase tracking-[0.14em] text-[#56CDEE] whitespace-nowrap">
              {trustedBy.title}
            </span>
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-14 gap-y-7">
            {trustedBy.clients.map((client) => (
              <Image
                key={client.name}
                src={client.logo}
                alt={client.name}
                width={150}
                height={30}
                className={`h-[30px] w-auto max-w-[150px] object-contain opacity-[0.82] hover:opacity-100 ${MOTION}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section id="what-we-do" className="scroll-mt-28 md:scroll-mt-36 bg-white">
        <div className={`${CONTAINER} py-[104px]`}>
          <div className="max-w-[640px] mb-14">
            <span className={`${EYEBROW} mb-4`}>{capabilities.title}</span>
            <h2 className="font-display font-bold text-[32px] min-[860px]:text-[44px] leading-[1.15] tracking-[-0.02em] text-[#1E252B] mb-4">
              The cryptography behind systems that move real value
            </h2>
            {capabilities.subtitle && (
              <p className="text-[18px] leading-[1.6] text-[#39434A]">
                {capabilities.subtitle}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-6">
            {capabilities.items.map((item) => {
              const meta = CAPABILITY_META[item.title];
              return (
                <Link
                  key={item.title}
                  href={item.link}
                  className={`${CARD} flex flex-col items-start p-9`}
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
                  <p className="text-base leading-[1.6] text-[#39434A] mb-3">
                    {item.description}
                  </p>
                  <span className="font-bold text-[#1E97C8] mt-auto">
                    {item.linkText} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="bg-[#F7F9FA]">
        <div className={`${CONTAINER} py-[104px]`}>
          <div className="flex flex-col min-[860px]:flex-row min-[860px]:items-end min-[860px]:justify-between gap-6 mb-12">
            <div className="max-w-[640px]">
              <span className={`${EYEBROW} mb-4`}>{work.title}</span>
              <h2 className="font-display font-bold text-[32px] min-[860px]:text-[44px] leading-[1.15] tracking-[-0.02em] text-[#1E252B]">
                Protocols we&apos;ve designed, audited, and verified
              </h2>
            </div>
            <Link
              href={work.ctaHref}
              className={`font-bold text-[#1E97C8] whitespace-nowrap hover:opacity-[0.72] ${MOTION}`}
            >
              {work.ctaText} →
            </Link>
          </div>
          <div className="grid grid-cols-1 min-[860px]:grid-cols-3 gap-6">
            {work.items.map((item) => (
              <Link
                key={item.title}
                href={item.link}
                className={`${CARD} flex flex-col gap-3 p-7`}
              >
                <span className="font-accent font-semibold text-xs uppercase tracking-[0.1em] text-[#1E97C8]">
                  {item.context}
                </span>
                <h3 className="font-display font-bold text-[22px] leading-[1.25] tracking-[-0.02em] text-[#1E252B]">
                  {item.title}
                </h3>
                {item.types?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.types.map((type) => (
                      <span
                        key={type}
                        className={`${BADGE} ${BADGE_TONES[type] ?? BADGE_TONE_NEUTRAL}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm leading-[1.6] text-[#39434A]">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ZSA Hub spotlight */}
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
          <div className="max-w-[640px]">
            <span className="inline-block font-accent font-semibold text-[13px] uppercase tracking-[0.14em] text-[#56CDEE] mb-4">
              ZSA Hub
            </span>
            <h2 className="font-display font-bold text-[32px] min-[860px]:text-[44px] leading-[1.15] tracking-[-0.02em] text-white mb-5">
              {zsaHub.title}
            </h2>
            <p className="text-[18px] leading-[1.6] text-white/[0.78] mb-9">
              {zsaHub.description}
            </p>
            <Link href={zsaHub.ctaHref} className={BTN_PRIMARY}>
              {zsaHub.ctaText} →
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-white">
        <div className={`${CONTAINER} py-[136px] text-center`}>
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
  title: 'Applied Cryptography, ZK Proofs & Security Audits | QEDIT',
  description:
    "Security audits, protocol design, and formal verification for zero-knowledge proofs and cryptographic systems. The team behind Zcash Shielded Assets and the ZKProof standards effort.",
  alternates: {
    canonical: 'https://qed-it.com/',
  },
  openGraph: {
    title: 'Applied Cryptography, ZK Proofs & Security Audits | QEDIT',
    description:
      'Security audits, protocol design, and formal verification for zero-knowledge proofs and cryptographic systems.',
    url: 'https://qed-it.com/',
    locale: 'en_US',
    type: 'website',
    siteName: 'QEDIT',
    images: ['/images/qedit-og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/qedit-og.png'],
  },
};
