import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sitePath } from '@/lib/site-path';
import { stories, readingMinutes, headingId } from '../data';
import { StoryBody } from '../story-body';
import { PortfolioNav, WindowBar } from '../../workspace-chrome';
import { PortfolioFooter } from '../../project-visuals';

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
        title: `${story.project} — Blog · Hrishi Bhardwaj`,
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
      <PortfolioNav active="blogs" />
      <main className="desk-shell story-workspace">
        <nav className="story-breadcrumb" aria-label="Breadcrumb">
          <a href={sitePath('/blogs/')}>Blogs</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{story.project}</span>
        </nav>
        <div className="desk-window article-window">
          <WindowBar label={`blogs / ${story.slug}.md`}>
            <span>{readingMinutes(story.markdown)} min read</span>
          </WindowBar>
          <div className="story-layout">
            <aside className="story-contents">
              <nav aria-label="On this page">
                <p className="v-kicker">CONTENTS</p>
                <ol>
                  {headings.map((title, index) => (
                    <li key={title}>
                      <a href={`#${headingId(title)}`}>
                        <span aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {title}
                      </a>
                    </li>
                  ))}
                </ol>
                <a className="story-back" href={sitePath('/blogs/')}>
                  ← All blogs
                </a>
              </nav>
            </aside>
            <div className="story-article" id="article">
              <header className="story-header">
                <p className="v-kicker">{story.context}</p>
                <h1>{story.title}</h1>
                <div className="story-byline">
                  <span>Hrishi Bhardwaj</span>
                  <span>{story.period}</span>
                </div>
                <ul className="story-stack" aria-label="Technologies">
                  {story.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="story-access">
                  Source private · Architecture and results shared here.
                </p>
                <details className="story-mobile-outline">
                  <summary>
                    In this blog <span>{headings.length} sections</span>
                  </summary>
                  <nav aria-label="Article sections">
                    <ol>
                      {headings.map((title) => (
                        <li key={title}>
                          <a href={`#${headingId(title)}`}>{title}</a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </details>
              </header>
              <article>
                <StoryBody markdown={story.markdown} />
              </article>
              <footer className="story-source">
                <p>{story.sourceNote}</p>
                <a href={sitePath('/blogs/')}>Back to blogs ↗</a>
              </footer>
            </div>
          </div>
          <div className="desk-status">
            <span>{story.project}</span>
            <span>Project notes / {story.period}</span>
          </div>
        </div>
      </main>
      <PortfolioFooter />
    </div>
  );
}
