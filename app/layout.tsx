import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://themorningcatch.com'),
  title: 'The Morning Catch — Fresh Seafood Market',
  description:
    'Step inside a premium fish market. Explore fresh catches, prawns, shellfish, and premium seafood — prepared your way and delivered to your door.',
  openGraph: {
    title: 'The Morning Catch — Fresh Seafood Market',
    description:
      'Step inside a premium fish market. Fresh from the sea, prepared for your table.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
