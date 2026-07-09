import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getServiceSlugs,
  getServiceMeta,
  getServiceWorks,
  getAllServices,
} from '@/lib/services';
import type { WorkType } from '@/types/blocks';

// Next 15 passes params as a Promise. On Next 14, change the type to
// `{ service: string }` and drop the `await`.
type Params = Promise<{ service: string }>;

const CONTAINER = 'max-w-[1200px] mx-auto px-6 min-[860px]:px-10';

const EYEBROW =
  'inline-block font-accent font-semibold text-[13px] uppercase tracking-[0.14em] text-[#38B1DF]';

const MOTION = 'transition-all duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

const BTN_PRIMARY =
  `inline-flex items-center justify-center gap-2 rounded-full border-2 px-[38px] py-[15px] text-[17px] font-bold leading-none active:scale-[0.97] bg-[#38B1DF] border-[#38B1DF] text-white hover:bg-[#1E97C8] hover:border-[#1E97C8] hover:shadow-[0_8px_24px_rgba(56,177,223,0.28)] ${MOTION}`;

const CARD =
  `bg-white border border-[#DCE3E7] rounded-2xl hover:border-[#38B1DF] hover:-translate-y-[3px] hover:shadow-[0_4px_12px_rgba(9,5,58,0.08),0_2px_4px_rgba(9,5,58,0.05)] ${MOTION}`;

const BADGE =
  'inline-flex items-center rounded-full px-[14px] py-[6px] text-[13px] font-semibold';

const BADGE_TONES: Partial<Record<WorkType, string>> = {
  Audit: 'bg-[#EAF9FF] text-[#1E97C8]',
  Design: 'bg-[rgba(9,5,58,0.08)] text-[#09053A]',
  Protocol: 'bg-[rgba(9,5,58,0.08)] text-[#09053A]',
  Research: 'bg-[rgba(255,192,46,0.25)] text-[#1E252B]',
};

const BADGE_TONE_NEUTRAL = 'bg-[#EEF1F3] text-[#39434A]';

const SERVICE_EYEBROWS: Record<string, string> = {
  audits: 'Audits',
  'protocol-design': 'Engineering',
  'formal-verification': 'Assurance',
};

const SERVICE_ILLUSTRATIONS: Record<string, string> = {
  audits: '/images/illustrations/certified-secure.png',
  'protocol-design': '/images/illustrations/standard-crypto.png',
  'formal-verification': '/images/illustrations/secure.png',
};

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
  };
}

export default async function ServicePage({ params }: { params: Params }) {
  const { service } = await params;
  const meta = getServiceMeta(service);
  if (!meta) notFound();

  const works = getServiceWorks(service);
  const siblings = getAllServices();
  const illustration =
    meta.illustration ?? SERVICE_ILLUSTRATIONS[service];

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
        <div className={`${CONTAINER} relative z-10 pt-[104px] pb-[88px]`}>
          <div className="max-w-[660px]">
            <span className={`${EYEBROW} mb-4`}>Services</span>
            <h1 className="font-display font-black text-[40px] min-[860px]:text-[56px] leading-[1.08] tracking-[-0.02em] text-[#1E252B] mb-[22px]">
              {meta.title}
            </h1>
            {meta.tagline && (
              <p className="text-[22px] leading-[1.6] text-[#39434A] max-w-[580px]">
                {meta.tagline}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Service sub-nav */}
      <nav
        aria-label="Services"
        className="sticky top-20 md:top-32 z-40 bg-white/[0.86] backdrop-blur-[10px] border-b border-[#DCE3E7]"
      >
        <div className={`${CONTAINER} flex flex-wrap gap-2 py-3.5`}>
          {siblings.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              aria-current={s.slug === service ? 'page' : undefined}
              className={`rounded-full px-[22px] py-2.5 font-bold text-base leading-normal ${MOTION} ${
                s.slug === service
                  ? 'bg-[#38B1DF] text-white'
                  : 'text-[#1E252B] hover:bg-[#EAF9FF]'
              }`}
            >
              {s.title}
            </Link>
          ))}
        </div>
      </nav>

      <section className="bg-white">
        <div className={`${CONTAINER} py-[104px]`}>
          {/* Intro */}
          <div className="grid grid-cols-1 min-[960px]:grid-cols-[1.15fr_1fr] gap-8 min-[960px]:gap-14 items-center mb-16">
            <div>
              {SERVICE_EYEBROWS[service] && (
                <span className={`${EYEBROW} mb-4`}>
                  {SERVICE_EYEBROWS[service]}
                </span>
              )}
              {meta.intro && (
                <p className="text-[20px] leading-[1.6] text-[#39434A] mb-[30px]">
                  {meta.intro}
                </p>
              )}
              <Link href="/contact-us" className={BTN_PRIMARY}>
                Discuss an engagement
              </Link>
            </div>
            {illustration && (
              <div className="order-first min-[960px]:order-none bg-[linear-gradient(160deg,#EAF9FF,#F7FBFE)] border border-[#DCE3E7] rounded-2xl p-10 flex items-center justify-center aspect-[4/3]">
                <Image
                  src={illustration}
                  alt=""
                  width={340}
                  height={340}
                  className="w-full max-w-[340px] h-auto object-contain"
                />
              </div>
            )}
          </div>

          {/* Work grid */}
          <div className="mb-7">
            <span className={EYEBROW}>Our work</span>
          </div>
          {works.length === 0 ? (
            <div className="border border-dashed border-[#DCE3E7] rounded-2xl p-10 bg-white text-center text-[18px] leading-[1.6] text-[#7C8A92]">
              Our first formal-verification engagements are underway — write-ups
              coming soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[860px]:grid-cols-3 gap-6">
              {works.map((w) => (
                <Link
                  key={w.slug}
                  href={`/services/${service}/${w.slug}`}
                  className={`${CARD} flex flex-col gap-3 p-7`}
                >
                  {w.context && (
                    <span className="font-accent font-semibold text-xs uppercase tracking-[0.1em] text-[#1E97C8]">
                      {w.context}
                    </span>
                  )}
                  <h3 className="font-display font-bold text-[22px] leading-[1.25] tracking-[-0.02em] text-[#1E252B]">
                    {w.title}
                  </h3>
                  {w.types && w.types.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {w.types.map((t) => (
                        <span
                          key={t}
                          className={`${BADGE} ${BADGE_TONES[t] ?? BADGE_TONE_NEUTRAL}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {w.summary && (
                    <p className="text-sm leading-[1.6] text-[#39434A]">
                      {w.summary}
                    </p>
                  )}
                  <span className="mt-auto font-bold text-sm text-[#1E97C8]">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-[#F7F9FA]">
        <div className={`${CONTAINER} py-[120px] text-center`}>
          <div className="max-w-[680px] mx-auto">
            <span className={`${EYEBROW} mb-4`}>Work with us</span>
            <h2 className="font-display font-black text-[40px] min-[860px]:text-[56px] leading-[1.08] tracking-[-0.02em] text-[#1E252B] mb-5">
              Have an engagement in mind?
            </h2>
            <p className="text-[18px] leading-[1.6] text-[#39434A] max-w-[520px] mx-auto mb-10">
              Talk to the team about a security audit, a protocol design, or a
              formal-verification engagement.
            </p>
            <Link href="/contact-us" className={BTN_PRIMARY}>
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
