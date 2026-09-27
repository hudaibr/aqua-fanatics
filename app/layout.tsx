import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://themorningcatch.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'The Morning Catch — Fresh Seafood Market',
  description:
    'Step inside a premium fish market. Explore fresh catches, prawns, shellfish, and premium seafood — prepared your way and delivered to your door.',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'The Morning Catch — Fresh Seafood Market',
    description:
      'Step inside a premium fish market. Fresh from the sea, prepared for your table.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Morning Catch — Fresh Seafood Market',
    description:
      'Step inside a premium fish market. Fresh from the sea, prepared for your table.',
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
