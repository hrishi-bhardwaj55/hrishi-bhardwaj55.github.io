import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sitePath } from '@/lib/site-path';
import { stories, readingMinutes, headingId } from '../data';
import { StoryBody } from '../story-body';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return stories.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  return story
    ? {
        title: `${story.project} — Project story · Hrishi Bhardwaj`,
        description: story.excerpt,
      }
    : {};
}
export default async function ProjectStory({ params }: Props) {
  const { slug } = await params;
  const story = stories.find((item) => item.slug === slug);
  if (!story) notFound();
  const headings = [...story.markdown.matchAll(/^## (.+)$/gm)].map((match) =>
    match[1].trim(),
  );
  return (
    <div className="portfolio workbench story-page">
      <div className="story-shell">
        <nav className="story-nav" aria-label="Project story navigation">
          <a href={sitePath('/#project-stories')}>← Back to Workbench</a>
          <span>HRISHI BHARDWAJ / PROJECT STORIES</span>
        </nav>
        <header className="story-header">
          <p className="v-kicker">{story.context} · Source private</p>
          <h1>{story.title}</h1>
          <div className="story-byline">
            <span>Hrishi Bhardwaj</span>
            <span>{story.period}</span>
            <span>{readingMinutes(story.markdown)} min read</span>
          </div>
          <ul className="story-stack" aria-label="Technologies">
            {story.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </header>
        <div className="story-layout">
          <aside className="story-contents">
            <nav aria-label="On this page">
              <p className="v-kicker">IN THIS STORY</p>
              <ol>
                {headings.map((title) => (
                  <li key={title}>
                    <a href={`#${headingId(title)}`}>{title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
          <main className="story-article" id="article">
            <article>
              <StoryBody markdown={story.markdown} />
            </article>
            <footer className="story-source">
              <p>{story.sourceNote}</p>
              <a href={sitePath('/#project-stories')}>
                Back to selected work ↗
              </a>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
