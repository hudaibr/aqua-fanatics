import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aquafanatics.com';

const TITLE = 'Aqua Fanatics — Fresh Seafood Market';
const DESCRIPTION =
  'Step inside a premium fish market. Explore fresh catches, prawns, shellfish, and premium seafood — prepared your way and delivered to your door.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Aqua Fanatics',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${montserrat.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
