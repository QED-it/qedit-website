// Common content blocks
export interface Hero {
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
}

export interface Feature {
  title: string;
  image: string;
  description: string;
  link: string;
  linkText: string;
}

export interface FeaturesSection {
  header: {
    title: string;
    description: string;
  };
  items: Feature[];
}

export interface Partner {
  name: string;
  logo: string;
  url?: string;
}

export interface PartnersSection {
  title: string;
  partners: Partner[];
}

export interface MediaFeature {
  name: string;
  logo: string;
  url: string;
}

export interface MediaSection {
  title: string;
  items: MediaFeature[];
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface BenefitsSection {
  title: string;
  items: Benefit[];
  subtitle: string;
}

// Home Page specific content

export interface CtaLink {
  text: string;
  href: string;
}

export interface HeroContent {
  title: string;
  disciplines: string[];
  claim: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
}

export interface TrustedByClient {
  name: string;
  logo: string;
}

export interface TrustedByContent {
  title: string;
  clients: TrustedByClient[];
}

export interface CapabilityItem {
  title: string;
  description: string;
  link: string;
  linkText: string;
}

export interface CapabilitiesContent {
  title: string;
  subtitle?: string;
  items: CapabilityItem[];
}

export type WorkType =
  | 'Audit'
  | 'Design'
  | 'Implementation'
  | 'Formal Verification'
  | 'Research';

export interface WorkItem {
  title: string;
  context: string;
  types: WorkType[];
  description: string;
  link: string;
}

export interface WorkContent {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaHref: string;
  items: WorkItem[];
}

export interface ZsaHubContent {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
}

export interface ClosingCtaContent {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaHref: string;
}

export interface HomePageContent {
  hero: HeroContent;
  trustedBy: TrustedByContent;
  capabilities: CapabilitiesContent;
  work: WorkContent;
  zsaHub: ZsaHubContent;
  closing: ClosingCtaContent;
}

// Research page specific blocks

export interface ResearchHero {
  eyebrow: string;
  title: string;
  intro: string;
}

export interface ResearchExpertiseItem {
  title: string;
  description: string;
}

export interface ResearchExpertise {
  title: string;
  items: ResearchExpertiseItem[];
}

export interface ResearchCallout {
  eyebrow: string;
  title: string;
  image?: string;
  description: string;
  linkText: string;
  linkHref: string;
}

export interface ResearchEcosystemItem {
  name: string;
  description: string;
}

export interface ResearchEcosystems {
  title: string;
  subtitle?: string;
  items: ResearchEcosystemItem[];
}

export interface ResearchClosing {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaHref: string;
}

export interface ResearchPageContent {
  hero: ResearchHero;
  expertise: ResearchExpertise;
  zkproof: ResearchCallout;
  ecosystems: ResearchEcosystems;
  darpa: ResearchCallout;
  closing: ResearchClosing;
}

// ZSA Hub Section

export interface ZsaHubMeta {
  label: string;
  value: string;
}

export interface ZsaHubHero {
  eyebrow: string;
  title: string;
  intro: string;
  meta: ZsaHubMeta[];
}

export interface ZsaHubProse {
  title: string;
  paragraphs: string[];
}

export interface ZsaHubUseCaseItem {
  title: string;
  icon?: string;
  description: string;
}

export interface ZsaHubUseCases {
  title: string;
  intro?: string;
  items: ZsaHubUseCaseItem[];
}

export interface ZsaHubMilestone {
  period: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}

export interface ZsaHubTimeline {
  title: string;
  intro?: string;
  milestones: ZsaHubMilestone[];
  note?: string;
}

export interface ZsaHubLink {
  label: string;
  description?: string;
  href: string;
}

export interface ZsaHubResearchItem {
  title: string;
  description: string;
  links: ZsaHubLink[];
}

export interface ZsaHubResearch {
  title: string;
  intro?: string;
  items: ZsaHubResearchItem[];
}

export interface ZsaHubSection {
  id: string;
  title: string;
  intro?: string;
  links: ZsaHubLink[];
}

export interface ZsaHubFaqItem {
  question: string;
  answer: string;
  linkLabel?: string;
  linkHref?: string;
}

export interface ZsaHubFaq {
  title: string;
  items: ZsaHubFaqItem[];
}

export interface ZsaHubClosing {
  title: string;
  subtitle?: string;
  ctaText: string;
  ctaHref: string;
}

export interface ZsaHubPageContent {
  hero: ZsaHubHero;
  overview: ZsaHubProse;
  useCases: ZsaHubUseCases;
  whyItMatters: ZsaHubProse;
  timeline: ZsaHubTimeline;
  research: ZsaHubResearch;
  sections: ZsaHubSection[];
  faq: ZsaHubFaq;
  closing: ZsaHubClosing;
}

// News page blocks

export interface NewsHero {
  eyebrow: string;
  title: string;
  intro: string;
}

export interface NewsOutlet {
  name: string;
  logo: string;
}

export interface NewsAsSeenIn {
  title: string;
  outlets: NewsOutlet[];
}

export interface PressKitLink {
  label: string;
  description?: string;
  href: string;
  external?: boolean;
}

export interface NewsPressKit {
  eyebrow: string;
  title: string;
  description: string;
  links: PressKitLink[];
}

export interface NewsCoverage {
  title: string;
  intro?: string;
}

export interface NewsPageContent {
  hero: NewsHero;
  asSeenIn: NewsAsSeenIn;
  pressKit: NewsPressKit;
  coverage: NewsCoverage;
}