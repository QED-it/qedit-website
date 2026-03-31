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

// Page specific content
export interface HomePageContent {
  hero: Hero;
  features: FeaturesSection;
  partners: PartnersSection;
  benefits: BenefitsSection;
  media: MediaSection;
} 