import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sitePath } from '@/lib/site-path';
import { blogPath } from '../../blog-catalog';
import { stories, storyMetadata } from '../data';

// Posts moved from /stories/<slug>/ to /blogs/<slug>/. GitHub Pages cannot
// send a 301, so each old address is a page that forwards at once and names
// the new URL as canonical, which search engines treat as a permanent move.
// Its metadata matches the article so shared old links still get the card.
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return stories.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  return story ? storyMetadata(story) : {};
}
export default async function MovedStory({ params }: Props) {
  const { slug } = await params;
  if (!stories.some((item) => item.slug === slug)) notFound();
  const target = sitePath(blogPath(slug));
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(target)} + location.hash)`,
        }}
      />
      <p>
        <a href={target}>This post has moved. Continue reading ↗</a>
      </p>
    </>
  );
}
