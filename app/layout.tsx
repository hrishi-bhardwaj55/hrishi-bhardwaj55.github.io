import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { siteUrl } from '@/lib/site-path';
import { socialImage } from '@/lib/page-metadata';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const title = 'Hrishikesh Bhardwaj — Software Engineer';
const description =
  'Backend and distributed systems engineer. 4.5 years at ION Group, now a Master of Software Engineering student at Carnegie Mellon. Available January 2027.';

// Defaults for any route without its own metadata. Each page sets its own
// title, description and canonical URL through `pageMetadata`.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl('/')),
  title,
  description,
  openGraph: {
    type: 'website',
    siteName: 'Hrishikesh Bhardwaj',
    title,
    description,
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b1017',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: '#0b1017', colorScheme: 'dark' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
