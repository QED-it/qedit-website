import { Red_Hat_Text, Red_Hat_Display, Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsentBanner from '@/components/CookieConsent';
import { OG_DEFAULTS, TWITTER_DEFAULTS } from '@/lib/seo';
import './globals.css';
import 'katex/dist/katex.min.css';

const redHatText = Red_Hat_Text({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  fallback: ['sans-serif'],
});

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  display: 'swap',
  fallback: ['sans-serif'],
  variable: '--font-display',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
  fallback: ['sans-serif'],
  variable: '--font-accent',
});

// Site-wide Organization schema. This is what feeds Google's knowledge panel,
// so it belongs in the layout (every page) rather than on the homepage only.
const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://qed-it.com/#organization',
  name: 'QEDIT',
  alternateName: 'QED-it',
  url: 'https://qed-it.com/',
  logo: {
    '@type': 'ImageObject',
    url: 'https://qed-it.com/images/logos/qedit-logo.svg',
  },
  description:
    'QEDIT is an applied cryptography firm. We design cryptographic protocols, audit the systems that implement them, and prove them correct with machine-checked proofs. Our work spans zero-knowledge proofs, formal verification, and privacy-preserving protocol design.',
  foundingDate: '2016',
  knowsAbout: [
    'Zero-Knowledge Proofs',
    'Applied Cryptography',
    'Formal Verification',
    'Cryptographic Protocol Design',
    'Security Audits',
    'Zcash Shielded Assets',
  ],
  sameAs: [
    'https://x.com/qeditzkp',
    'https://www.linkedin.com/company/qedit',
    'https://github.com/QED-it',
    'https://medium.com/qed-it',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    url: 'https://qed-it.com/contact-us/',
  },
};

export const metadata = {
  title: 'QEDIT - Applied Cryptography, ZK Proofs & Formal Verification',
  description:
    'QEDIT designs cryptographic protocols, audits the systems that implement them, and proves them correct with machine-checked proofs. The team behind Zcash Shielded Assets and a co-founder of the ZKProof standardization effort.',
  metadataBase: new URL('https://qed-it.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    ...OG_DEFAULTS,
    title: 'QEDIT - Applied Cryptography, ZK Proofs & Formal Verification',
    description:
      'Security audits, protocol design, and formal verification for zero-knowledge proofs and cryptographic systems.',
    url: 'https://qed-it.com/',
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    title: 'QEDIT - Applied Cryptography, ZK Proofs & Formal Verification',
    description:
      'Security audits, protocol design, and formal verification for zero-knowledge proofs and cryptographic systems.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_SCHEMA),
          }}
        />
      </head>
      <body className={`${redHatText.className} ${redHatDisplay.variable} ${poppins.variable}`}>
        <Header />
        <main className="min-h-screen pt-20 md:pt-32">
          {children}
        </main>
        <Footer />
        <CookieConsentBanner />
      </body>
    </html>
  );
}