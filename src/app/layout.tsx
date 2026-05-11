import type { Metadata } from 'next';
import { Bebas_Neue, Syne, Plus_Jakarta_Sans, Noto_Serif_KR, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'HALLYU.WORLD — Your Universe of Korean Culture',
    template: '%s | HALLYU.WORLD',
  },
  description: 'Your universe of Korean culture — dramas, music, everything. Discover K-Dramas, K-Pop, BTS, and connect with millions of fans worldwide.',
  keywords: ['K-Drama', 'K-Pop', 'BTS', 'Korean Drama', 'Hallyu', 'Korean Wave', 'ARMY', 'K-culture'],
  openGraph: {
    type: 'website',
    siteName: 'HALLYU.WORLD',
    title: 'HALLYU.WORLD — Your Universe of Korean Culture',
    description: 'Discover K-Dramas, K-Pop, BTS, and connect with millions of fans worldwide.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HALLYU.WORLD',
    description: 'Your universe of Korean culture — dramas, music, everything.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = `${bebasNeue.variable} ${syne.variable} ${plusJakarta.variable} ${notoSerifKR.variable} ${jetbrainsMono.variable}`;

  return (
    <html lang="en" className={fontVars}>
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
