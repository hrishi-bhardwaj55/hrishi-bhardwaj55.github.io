'use client';
import { useState } from 'react';
import { TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Tabs as TabsPrimitive } from '@base-ui/react/tabs';
import { projects, github } from '../data';
import { VersionNav, VersionFooter, ProjectGlyph } from '../shared';
const stageInfo = [
  [
    { name: 'Inspect', text: 'Parse the SQL and capture the PostgreSQL plan.' },
    {
      name: 'Verify',
      text: 'Compare result multisets and run adversarial fixtures.',
    },
    {
      name: 'Measure',
      text: 'Benchmark only candidates whose verification passed.',
    },
  ],
  [
    {
      name: 'Extract',
      text: 'Python extracts typed fields and retains page provenance.',
    },
    {
      name: 'Reconcile',
      text: 'A stateless Java engine owns the calculations.',
    },
    {
      name: 'Investigate',
      text: 'Eight audit-scoped tools investigate ambiguous findings.',
    },
  ],
  [
    {
      name: 'Seed',
      text: 'The seed and configuration version identify the challenge.',
    },
    {
      name: 'Play',
      text: 'React handles input; pure engines handle game logic.',
    },
    {
      name: 'Review',
      text: 'Local results report game-specific feedback and timing.',
    },
  ],
];
function StageExplorer({ index }: { index: number }) {
  const [stage, setStage] = useState(0);
  return (
    <div className="desk-stages">
      <p className="v-kicker">FOLLOW THE FLOW</p>
      <div role="group" aria-label="Architecture stages">
        {stageInfo[index].map((s, i) => (
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
      <p role="status">{stageInfo[index][stage].text}</p>
    </div>
  );
}
export default function WorkbenchClient() {
  return (
    <div className="variant workbench">
      <VersionNav active="workbench" />
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
            Follow its decisions back to the source.
          </p>
        </header>
        <div className="desk-window">
          <div className="desk-titlebar">
            <div aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <span>hrishi / selected-work</span>
            <a href={github}>GitHub ↗</a>
          </div>
          <TabsPrimitive.Root
            defaultValue="skeptic"
            orientation="vertical"
            className="desk-tabs"
          >
            <aside className="desk-sidebar">
              <p>PROJECT EXPLORER</p>
              <TabsList className="desk-tablist" aria-label="Project files">
                {projects.map((p, i) => (
                  <TabsTrigger key={p.id} value={p.id} className="desk-tab">
                    <span>{['PY', 'JV', 'TS'][i]}</span>
                    {p.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="desk-sidebar-note">
                Public repositories
                <br />
                Inspectable evidence
                <br />
                Independent projects
              </div>
              <a href={`${github}/GetMeAJob`}>↗ GetMeAJob</a>
            </aside>
            {projects.map((p, i) => (
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
                <StageExplorer index={i} />
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
                  <a href={p.source}>Open repository ↗</a>
                  <a href={p.documentation}>{p.detailLabel} ↗</a>
                </div>
              </TabsContent>
            ))}
          </TabsPrimitive.Root>
          <div className="desk-status">
            <span>● 3 project files</span>
            <span>Python · Java · TypeScript</span>
          </div>
        </div>
      </main>
      <VersionFooter />
    </div>
  );
}
