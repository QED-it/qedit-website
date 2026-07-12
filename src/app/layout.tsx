import { Red_Hat_Text, Red_Hat_Display, Poppins } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import CookieConsentBanner from '@/components/CookieConsent';
import 'katex/dist/katex.min.css';

const redHatText = Red_Hat_Text({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  fallback: ['sans-serif']
});

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  display: 'swap',
  fallback: ['sans-serif'],
  variable: '--font-display'
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
  fallback: ['sans-serif'],
  variable: '--font-accent'
});

export const metadata = {
  title: 'QEDIT - Applied Cryptography, ZK Proofs & Formal Verification',
  description:
    'QEDIT designs cryptographic protocols, audits the systems that implement them, and proves them correct with machine-checked proofs. The team behind Zcash Shielded Assets and a co-founder of the ZKProof standardization effort.',
  metadataBase: new URL('https://qed-it.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QEDIT - Applied Cryptography, ZK Proofs & Formal Verification',
    description:
      'Security audits, protocol design, and formal verification for zero-knowledge proofs and cryptographic systems.',
    url: 'https://qed-it.com',
    siteName: 'QEDIT',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/qedit-og.png',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QEDIT - Applied Cryptography, ZK Proofs & Formal Verification',
    description:
      'Security audits, protocol design, and formal verification for zero-knowledge proofs and cryptographic systems.',
    images: ['/images/qedit-og.png'],
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
