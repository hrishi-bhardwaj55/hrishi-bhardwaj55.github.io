import type { Metadata } from 'next';
import { sitePath } from '@/lib/site-path';
import { pageMetadata } from '@/lib/page-metadata';
import { PortfolioNav, WindowBar } from '../workspace-chrome';
import { PortfolioFooter } from '../project-visuals';
import { stories, readingMinutes } from '../stories/data';

export const metadata: Metadata = pageMetadata({
  title: 'Blogs — Hrishikesh Bhardwaj',
  description:
    'Project write-ups on architecture, performance, and the decisions behind the work.',
  path: '/blogs/',
});

export default function Blogs() {
  return (
    <div className="portfolio workbench">
      <PortfolioNav active="blogs" />
      <main className="desk-shell blogs-shell">
        <header className="desk-intro blogs-intro">
          <div>
            <p className="v-kicker">HRISHIKESH BHARDWAJ / ENGINEERING NOTES</p>
            <h1>Behind the build.</h1>
          </div>
          <p>
            Architecture, experiments,
            <br />
            and what I learned along the way.
          </p>
        </header>
        <section
          className="desk-window blog-library"
          aria-labelledby="blog-library-title"
        >
          <WindowBar label="hrishi / blogs">
            <span>
              {stories.length} {stories.length === 1 ? 'entry' : 'entries'}
            </span>
          </WindowBar>
          <div className="blog-library-heading">
            <h2 id="blog-library-title">Project write-ups</h2>
            <span>NOTES / DECISIONS / RESULTS</span>
          </div>
          {stories.map((story) => (
            <a
              className="blog-entry"
              href={sitePath(`/stories/${story.slug}/`)}
              key={story.slug}
            >
              <div className="blog-entry-meta">
                <span>{story.period}</span>
                <span>{readingMinutes(story.markdown)} min read</span>
              </div>
              <div className="blog-entry-content">
                <p className="v-kicker">{story.project} · Source private</p>
                <h2>{story.title}</h2>
                <p>{story.excerpt}</p>
                <ul className="story-stack" aria-label="Technologies">
                  {story.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span className="blog-entry-action">
                  Read the blog <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>
          ))}
          <div className="desk-status">
            <span>First-hand project notes</span>
            <span>Written by Hrishikesh Bhardwaj</span>
          </div>
        </section>
      </main>
      <PortfolioFooter />
    </div>
  );
}
