import { Red_Hat_Text } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const redHatText = Red_Hat_Text({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  fallback: ['sans-serif']
});

export const metadata = {
  title: 'QEDIT - Enterprise Privacy Solutions',
  description: 'QEDIT provides privacy-enhancing technology solutions for enterprises',
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
      </body>
    </html>
  );
}
