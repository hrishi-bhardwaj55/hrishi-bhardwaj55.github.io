'use client';
import { useState, useRef, useEffect } from 'react';
import { projects, github } from '../data';
import { missions, completeMission } from './engine';
import { VersionNav, VersionFooter } from '../shared';
export default function Arcade() {
  const [active, setActive] = useState(0),
    [completed, setCompleted] = useState<string[]>([]),
    [answer, setAnswer] = useState<number | null>(null);
  const mission = missions[active],
    project = projects[active],
    done = completed.includes(mission.id),
    correct = answer === mission.correct;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focusNext = useRef(false);
  useEffect(() => {
    if (focusNext.current) {
      headingRef.current?.focus();
      focusNext.current = false;
    }
  }, [active]);
  const select = (index: number, moveFocus = false) => {
    focusNext.current = moveFocus;
    setActive(index);
    setAnswer(null);
  };
  const respond = (index: number) => {
    setAnswer(index);
    setCompleted((previous) => completeMission(previous, mission.id, index));
  };
  return (
    <div className="variant arcade">
      <VersionNav active="arcade" />
      <main className="arcade-shell">
        <header className="arcade-header">
          <a href={github} className="arcade-identity">
            <span className="pixel-avatar" aria-hidden="true">
              H
            </span>
            <span>
              <b>Hrishi Bhardwaj</b>
              <small>Software engineer · curious builder</small>
            </span>
          </a>
          <div className="arcade-score">
            <span>EXPLORER PROGRESS</span>
            <b>
              {completed.length} / 3 <small>missions</small>
            </b>
          </div>
        </header>
        <section className="arcade-intro">
          <p className="v-kicker">WELCOME TO THE PROJECT ARCADE</p>
          <h1>
            A little curiosity.
            <br />
            <span>A few good discoveries.</span>
          </h1>
          <p>
            Explore three projects. Solve a tiny engineering challenge.
            <br />
            No timers, no pressure. Just a different way to get to know my work.
          </p>
        </section>
        <div
          className="quest-map"
          role="group"
          aria-label="Choose a project mission"
        >
          {missions.map((m, i) => (
            <button
              type="button"
              className={`quest-node ${active === i ? 'is-selected' : ''} ${completed.includes(m.id) ? 'is-complete' : ''}`}
              aria-pressed={active === i}
              key={m.id}
              onClick={() => select(i)}
            >
              <span className="quest-number">
                {completed.includes(m.id) ? '✓' : `0${i + 1}`}
              </span>
              <span>
                <small>MISSION 0{i + 1}</small>
                <b>{projects[i].name}</b>
              </span>
              <span className="quest-status">
                {completed.includes(m.id)
                  ? 'COMPLETE'
                  : active === i
                    ? 'EXPLORING'
                    : 'EXPLORE →'}
              </span>
            </button>
          ))}
        </div>
        <section className="mission-panel" aria-labelledby="mission-title">
          <div className="mission-brief">
            <p className="v-kicker">
              MISSION 0{active + 1} / {project.category}
            </p>
            <h2 id="mission-title" ref={headingRef} tabIndex={-1}>
              {mission.label}
            </h2>
            <p>{project.description}</p>
            <div className="mission-clue">
              <span>FIELD NOTE</span>
              <p>{project.decision}</p>
            </div>
            <div className="mission-stack">{project.stack.join(' / ')}</div>
            <a href={project.source}>Visit {project.name} on GitHub ↗</a>
            <details>
              <summary>Evidence and scope</summary>
              <p>{project.evidence}</p>
              <p className="v-caveat">{project.limitation}</p>
              <a href={project.documentation}>{project.detailLabel} ↗</a>
            </details>
          </div>
          <div className="mission-challenge">
            <span className="challenge-label">
              {done ? 'MISSION COMPLETE ✓' : 'QUICK CHALLENGE'}
            </span>
            <h3>{mission.question}</h3>
            <div className="answer-options">
              {mission.options.map((option, i) => (
                <button
                  type="button"
                  disabled={done}
                  key={option}
                  className={
                    answer === i
                      ? correct
                        ? 'answer-correct'
                        : 'answer-wrong'
                      : ''
                  }
                  onClick={() => respond(i)}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {option}
                </button>
              ))}
            </div>
            <div className="answer-feedback" role="status" aria-live="polite">
              {answer !== null ? (
                <>
                  <b>
                    {correct
                      ? 'Nice. You found it.'
                      : 'Almost. Take another look.'}
                  </b>
                  <p>
                    {correct
                      ? mission.feedback
                      : 'The field note has a useful clue. Try another answer.'}
                  </p>
                </>
              ) : done ? (
                <>
                  <b>You’ve completed this mission.</b>
                  <p>{mission.feedback}</p>
                </>
              ) : (
                <p>A correct answer marks this project as explored.</p>
              )}
            </div>
            {done && completed.length < 3 && (
              <button
                type="button"
                className="arcade-next"
                onClick={() =>
                  select(
                    missions.findIndex((m) => !completed.includes(m.id)),
                    true,
                  )
                }
              >
                Next unexplored mission →
              </button>
            )}
          </div>
        </section>
        <section
          className={`arcade-completion ${completed.length === 3 ? 'unlocked' : ''}`}
          aria-live="polite"
        >
          {completed.length === 3 ? (
            <>
              <span className="completion-badge" aria-hidden="true">
                ✦
              </span>
              <div>
                <p className="v-kicker">ALL THREE MISSIONS COMPLETE</p>
                <h2>Good eye, explorer.</h2>
                <p>
                  You’ve seen how I approach correctness, evidence, and
                  reproducibility.
                </p>
              </div>
            </>
          ) : (
            <>
              <span className="completion-badge" aria-hidden="true">
                ◇
              </span>
              <div>
                <h2>Every project is open.</h2>
                <p>
                  The missions are optional. You can explore the code directly
                  below.
                </p>
              </div>
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setCompleted([]);
              setAnswer(null);
              setActive(0);
            }}
          >
            Reset progress ↺
          </button>
        </section>
        <section className="arcade-library" aria-labelledby="library-title">
          <h2 id="library-title">Project library</h2>
          <div>
            {projects.map((p) => (
              <a key={p.id} href={p.source}>
                <span>
                  {p.name}
                  <small>{p.category}</small>
                </span>
                <b>↗</b>
              </a>
            ))}
            <a href={`${github}/GetMeAJob`}>
              <span>
                GetMeAJob<small>Python automation</small>
              </span>
              <b>↗</b>
            </a>
          </div>
        </section>
      </main>
      <VersionFooter />
    </div>
  );
}

