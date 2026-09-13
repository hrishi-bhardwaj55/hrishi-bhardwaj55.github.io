'use client';
import { useState } from 'react';
import { TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { projects, github, type Project } from './projects';
import { sitePath } from '@/lib/site-path';
import { PortfolioFooter, ProjectGlyph } from './project-visuals';
import { PortfolioNav, WindowBar } from './workspace-chrome';
import { blogCatalog } from './blog-catalog';
function StageExplorer({ stages }: { stages: Project['stages'] }) {
  const [stage, setStage] = useState(0);
  return (
    <div className="desk-stages">
      <p className="v-kicker">FOLLOW THE FLOW</p>
      <div role="group" aria-label="Architecture stages">
        {stages.map((s, i) => (
          <button
            type="button"
            key={s.name}
            aria-pressed={i === stage}
            onClick={() => setStage(i)}
          >
            {String(i + 1).padStart(2, '0')} {s.name}
          </button>
        ))}
      </div>
      <p role="status">{stages[stage].text}</p>
    </div>
  );
}
export default function WorkbenchClient() {
  return (
    <div className="portfolio workbench">
      <PortfolioNav active="workbench" />
      <main className="desk-shell">
        <header className="desk-intro">
          <div>
            <p className="v-kicker">HRISHI BHARDWAJ / SOFTWARE ENGINEER</p>
            <h1>
              A look inside
              <br />
              the work.
            </h1>
          </div>
          <p>
            Choose a project.
            <br />
            Explore the code, or read the story.
          </p>
        </header>
        <div className="desk-window">
          <WindowBar label="hrishi / selected-work">
            <span>Project explorer</span>
          </WindowBar>
          <TabsPrimitive.Root
            defaultValue="skeptic"
            orientation="vertical"
            className="desk-tabs"
          >
            <aside className="desk-sidebar">
              <p>PROJECT EXPLORER</p>
              <TabsList className="desk-tablist" aria-label="Project files">
                {projects.map((p) => (
                  <TabsTrigger key={p.id} value={p.id} className="desk-tab">
                    <span>{p.label}</span>
                    {p.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="desk-sidebar-note">
                Public code & project stories
                <br />
                Inspectable evidence
                <br />
                Independent projects
              </div>
              <a href={`${github}/GetMeAJob`}>↗ GetMeAJob</a>
            </aside>
            {projects.map((p) => (
              <TabsContent key={p.id} value={p.id} className="desk-panel">
                <div className="desk-breadcrumb">
                  projects / {p.id} / overview
                </div>
                <div className="desk-summary">
                  <div>
                    <p className="v-kicker">{p.category}</p>
                    <h2>{p.name}</h2>
                    <p>{p.description}</p>
                    <div className="desk-stack">
                      {p.stack.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <ProjectGlyph id={p.id} />
                </div>
                <StageExplorer stages={p.stages} />
                <div className="desk-evidence">
                  <div>
                    <span>01 / DECISION</span>
                    <p>{p.decision}</p>
                  </div>
                  <div>
                    <span>02 / EVIDENCE</span>
                    <p>{p.evidence}</p>
                    <p className="v-caveat">{p.limitation}</p>
                  </div>
                </div>
                <div className="desk-links">
                  {p.source && <a href={p.source}>Open repository ↗</a>}
                  {p.story && (
                    <a className="desk-story-link" href={sitePath(p.story)}>
                      Read the blog ↗
                    </a>
                  )}
                  {p.documentation && (
                    <a href={p.documentation}>{p.detailLabel} ↗</a>
                  )}
                </div>
              </TabsContent>
            ))}
          </TabsPrimitive.Root>
          <div className="desk-status">
            <span>{projects.length} project files</span>
            <span>Public code + private-source stories</span>
          </div>
        </div>
        <section
          className="story-shelf"
          id="project-stories"
          aria-labelledby="stories-title"
        >
          <div className="story-shelf-heading">
            <div>
              <p className="v-kicker">NOTES FROM BUILDING</p>
              <h2 id="stories-title">From the blog</h2>
            </div>
            <a className="story-read" href={sitePath('/blogs/')}>
              All blogs ↗
            </a>
          </div>
          {['twitter-analytics', 'uber-ride-matching', 'wecloud-chat']
            .map((slug) => blogCatalog.find((entry) => entry.slug === slug)!)
            .map((p) => (
              <a
                className="story-preview"
                href={sitePath(`/stories/${p.slug}/`)}
                key={p.slug}
              >
                <span className="story-file" aria-hidden="true">
                  MD
                </span>
                <div>
                  <span className="v-kicker">{p.project} / SOURCE PRIVATE</span>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                </div>
                <span className="story-read">Read the blog ↗</span>
              </a>
            ))}
        </section>
      </main>
      <PortfolioFooter />
    </div>
  );
}
