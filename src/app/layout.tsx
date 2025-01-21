import { Red_Hat_Text } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import CookieConsentBanner from '@/components/CookieConsent';

const redHatText = Red_Hat_Text({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  fallback: ['sans-serif']
});

export const metadata = {
  title: 'QEDIT - Enterprise Privacy Solutions',
  description: 'QEDIT provides privacy-enhancing technology solutions for enterprises',
  metadataBase: new URL('https://qed-it.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QEDIT - Enterprise Privacy Solutions',
    description: 'QEDIT provides privacy-enhancing technology solutions for enterprises',
    url: 'https://qed-it.com',
    siteName: 'QEDIT',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/qedit-og.png', // Make sure to add this image
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QEDIT - Enterprise Privacy Solutions',
    description: 'QEDIT provides privacy-enhancing technology solutions for enterprises',
    images: ['/images/qedit-og.png'], // Same image as OG
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
      <body className={redHatText.className}>
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
