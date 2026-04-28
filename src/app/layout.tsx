import type { Metadata } from 'next';
import Header from '@/components/layout/Header/Header';
import './globals.css';
import Footer from '@/components/layout/Footer/Footer';

export const metadata: Metadata = {
  title: {
    default: 'ShopForge',
    template: '%s — ShopForge',
  },
  description: 'Quality products, delivered fast.',
  openGraph: {
    siteName: 'ShopForge',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}