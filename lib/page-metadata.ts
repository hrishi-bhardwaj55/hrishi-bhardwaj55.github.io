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

type PageDetails = {
  title: string;
  description: string;
  path: string;
};

export function pageMetadata(
  page: PageDetails &
    ({ type?: 'website' } | { type: 'article'; publishedTime: string }),
): Metadata {
  const { title, description, path } = page;
  const url = siteUrl(path);
  const shared = {
    siteName: 'Hrishikesh Bhardwaj',
    url,
    title,
    description,
    images: [socialImage],
  };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph:
      page.type === 'article'
        ? {
            ...shared,
            type: 'article',
            publishedTime: page.publishedTime,
            authors: ['Hrishikesh Bhardwaj'],
          }
        : { ...shared, type: 'website' },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}
