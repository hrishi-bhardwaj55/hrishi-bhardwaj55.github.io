import type { Metadata } from 'next';
import { sitePath, siteUrl } from './site-path';

// Shared across every page so social cards stay consistent. Declared once
// here rather than in the root layout: a canonical URL set on the layout
// propagates to every route, which would mark each page a duplicate of the
// homepage.
export const socialImage = {
  url: sitePath('/og.png'),
  width: 1200,
  height: 630,
  alt: 'Hrishikesh Bhardwaj — Software Engineer',
};

export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
}): Metadata {
  const url = siteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      siteName: 'Hrishikesh Bhardwaj',
      url,
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
}
