import type { Metadata } from 'next';
import Header from '@/components/layout/Header/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopForge',
  description: 'A modern e-commerce store',
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
      </body>
    </html>
  );
}