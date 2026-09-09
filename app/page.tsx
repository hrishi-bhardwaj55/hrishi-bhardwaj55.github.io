const github = 'https://github.com/hrishi-bhardwaj55';
import Counterexample from './counterexample';
import Motion from './motion';

function SkepticVisual() {
  return (
    <div className="skeptic-visual">
      <div className="visual-top">
        <span>skeptic / verification pipeline</span>
        <span>●</span>
      </div>
      <div className="query">
        <span className="code-label">PROPOSED REWRITE</span>
        <code>
          NOT IN <span>→</span> NOT EXISTS
        </code>
      </div>
      <div className="pipeline">
        <div>
          <i>✓</i>
          <span>Main dataset</span>
          <b>Matching rows</b>
        </div>
        <div className="refuted">
          <i>×</i>
          <span>Adversarial fixture</span>
          <b>NULL changes the result</b>
        </div>
      </div>
      <div className="verdict">
        <span>REFUTED</span>
        <p>
          Counterexample found.
          <br />
          Benchmark withheld.
        </p>
        <b>↳</b>
      </div>
      <p className="visual-note">
        Illustrated from the repository’s NULL fixture.
      </p>
    </div>
  );
}
export default function Home() {
  return (
    <>
      <Motion />
      <a className="skip" href="#work">
        Skip to work
      </a>
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Hrishi Bhardwaj home">
          hb<span>.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Selected work</a>
          <a href="/versions">Five versions</a>
          <a href={github}>GitHub ↗</a>
        </nav>
        <a className="availability" href="#contact">
          <i />
          Open to opportunities
        </a>
      </header>
      <main>
        <section className="hero">
          <p className="eyebrow">HRISHI BHARDWAJ / SOFTWARE ENGINEERING</p>
          <h1>
            Good software.
            <br />
            <span>Under the surface, too.</span>
          </h1>
          <div className="hero-bottom">
            <p>
              I build systems that make their reasoning inspectable.
              <br />
              From SQL verification to evidence-driven applications.
            </p>
            <a className="round-link" href="#work" aria-label="Explore my work">
              <span>Explore my work</span>
              <b aria-hidden="true">↓</b>
            </a>
          </div>
        </section>
        <section id="work" aria-labelledby="work-title">
          <div className="section-title">
            <h2 id="work-title">Selected work</h2>
            <span>01 — 03</span>
          </div>
          <article data-reveal className="project featured">
            <div className="project-copy">
              <p className="eyebrow">01 / DATABASE SYSTEMS</p>
              <h3>Skeptic</h3>
              <p className="project-subtitle">
                A faster query means nothing
                <br />
                if the answer is wrong.
              </p>
              <p>
                A Postgres performance advisor that challenges SQL rewrites with
                real data and adversarial fixtures before it benchmarks them.
              </p>
              <div className="tags">
                <span>Python</span>
                <span>PostgreSQL</span>
                <span>SQL verification</span>
              </div>
              <div className="project-links">
                <a className="text-link" href="#lab">
                  Try the counterexample ↓
                </a>
                <a className="text-link" href={`${github}/skeptic`}>
                  Source ↗
                </a>
              </div>
            </div>
            <SkepticVisual />
            <details className="case-study">
              <summary>
                The engineering behind it <span aria-hidden="true">+</span>
              </summary>
              <div className="case-content">
                <div>
                  <h4>The problem</h4>
                  <p>
                    A SQL rewrite can preserve results on ordinary data while
                    breaking on NULLs or duplicate rows. Timing alone cannot
                    reveal that failure.
                  </p>
                </div>
                <div>
                  <h4>The decision</h4>
                  <p>
                    Gate benchmarking on verification. The pipeline checks
                    safety, compares row multisets, and exercises adversarial
                    fixtures. Uncertain or refuted candidates never receive a
                    speedup claim.
                  </p>
                </div>
                <div>
                  <h4>What the evidence says</h4>
                  <p>
                    The committed eight-proposal evaluation caught two rewrites
                    that passed the main data but failed fixtures. These are
                    authored local examples, not a live-model accuracy benchmark
                    or formal proof of equivalence.
                  </p>
                  <a
                    href={`${github}/skeptic/blob/main/eval/full-baseline.json`}
                  >
                    Inspect evaluation evidence ↗
                  </a>
                </div>
                <div>
                  <h4>A useful boundary</h4>
                  <p>
                    Conservative PostgreSQL SELECT support, rolled-back analysis
                    transactions, and empirical verification. Queries outside
                    supported coverage remain unverified.
                  </p>
                  <a href={`${github}/skeptic/blob/main/planproof/pipeline.py`}>
                    Read the verification gate ↗
                  </a>
                </div>
              </div>
            </details>
          </article>
          <div className="project-pair">
            <article data-reveal className="project small">
              <div
                className="service-visual"
                aria-label="Architecture: source documents, typed evidence, deterministic Java engine, traceable findings"
              >
                <div className="mini-top">
                  ServicerSwitch <span>ARCHITECTURE</span>
                </div>
                <div className="evidence-flow">
                  <div>
                    <span>01</span>Source documents
                    <small>Document · page · field</small>
                  </div>
                  <b aria-hidden="true">↓</b>
                  <div>
                    <span>02</span>Java reconciliation
                    <small>Deterministic calculations</small>
                  </div>
                  <b aria-hidden="true">↓</b>
                  <div className="evidence-last">
                    <span>03</span>Traceable findings
                    <small>Evidence stays attached</small>
                  </div>
                </div>
              </div>
              <div className="small-copy">
                <p className="eyebrow">02 / APPLIED AI + JAVA</p>
                <h3>ServicerSwitch</h3>
                <p>Making a payment change explainable.</p>
                <p>
                  A mortgage-transfer audit that connects document extraction,
                  deterministic calculations, and page-level evidence.
                </p>
                <div className="tags">
                  <span>Java / Spring Boot</span>
                  <span>Python</span>
                  <span>Next.js</span>
                </div>
                <a className="text-link" href={`${github}/ServiceSwitcher`}>
                  Explore the source ↗
                </a>
              </div>
              <details className="case-study">
                <summary>
                  The engineering behind it <span aria-hidden="true">+</span>
                </summary>
                <div className="case-content">
                  <div>
                    <h4>Separation of responsibilities</h4>
                    <p>
                      Java owns arithmetic and reconciliation. Python owns
                      extraction and orchestration. Eight audit-scoped tools let
                      an investigator examine ambiguous findings while
                      preserving deterministic evidence.
                    </p>
                  </div>
                  <div>
                    <h4>Evaluation with context</h4>
                    <p>
                      The repository documents 300 synthetic accounts and 1,500
                      PDFs. Historical results use a different model from the
                      current default; they should not be treated as
                      current-runtime or real-customer performance.
                    </p>
                    <a
                      href={`${github}/ServiceSwitcher/blob/master/docs/evals.md`}
                    >
                      Read methodology and limitations ↗
                    </a>
                  </div>
                  <div>
                    <h4>Product detail</h4>
                    <p>
                      Findings retain source-page provenance. Uncertainty routes
                      to review. The demo uses synthetic records and an editable
                      action draft.
                    </p>
                    <a
                      href={`${github}/ServiceSwitcher/blob/master/docs/demo-script.md`}
                    >
                      Read the guided demo ↗
                    </a>
                  </div>
                </div>
              </details>
            </article>
            <article data-reveal className="project small">
              <div className="cortex-visual">
                <div className="mini-top">
                  cortex<span>9 GAMES / 5 LEVELS</span>
                </div>
                <div className="cortex-grid" aria-hidden="true">
                  {['◉', '⌁', '▧', '⊞', '◇', '≋', '⊕', '▥', '⌘'].map(
                    (symbol, i) => (
                      <div key={i}>
                        <span>{symbol}</span>
                        <small>0{i + 1}</small>
                      </div>
                    ),
                  )}
                </div>
                <p className="visual-note">
                  Deterministic engines. Reproducible sessions.
                </p>
              </div>
              <div className="small-copy">
                <p className="eyebrow">03 / INTERACTIVE SYSTEMS</p>
                <h3>Cortex</h3>
                <p>Practice that can be replayed exactly.</p>
                <p>
                  Nine cognitive practice games with seeded challenges,
                  progressive difficulty, and game-specific feedback.
                </p>
                <div className="tags">
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>Vitest / Playwright</span>
                </div>
                <a className="text-link" href={`${github}/ZapN`}>
                  Explore the source ↗
                </a>
              </div>
              <details className="case-study">
                <summary>
                  The engineering behind it <span aria-hidden="true">+</span>
                </summary>
                <div className="case-content">
                  <div>
                    <h4>Reproducibility by design</h4>
                    <p>
                      Pure game engines are separate from React input and
                      presentation. Session seeds and configuration versions
                      make replay inspectable. Reaction time is measured from
                      stimuli and responses, rather than render duration.
                    </p>
                  </div>
                  <div>
                    <h4>Interaction details</h4>
                    <p>
                      Explicit session states, guarded submissions, and
                      pause-aware timing support focused practice. Local history
                      works without an account; an optional API provides a
                      persistence path.
                    </p>
                    <a href={`${github}/ZapN/blob/master/docs/architecture.md`}>
                      Read the architecture ↗
                    </a>
                  </div>
                  <div>
                    <h4>Honest product scope</h4>
                    <p>
                      Independent practice software based on public task
                      descriptions. Scores are training heuristics, not employer
                      percentiles or hiring predictions.
                    </p>
                  </div>
                </div>
              </details>
            </article>
          </div>
          <div data-reveal className="other-work">
            <p className="eyebrow">ALSO BUILT</p>
            <a href={`${github}/GetMeAJob`}>
              <span>
                <b>GetMeAJob</b>
                <small>
                  Concurrent Python job discovery, filtering, and SQLite
                  deduplication.
                </small>
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
        <Counterexample />
        <section data-reveal id="about" className="about">
          <p className="eyebrow">ABOUT MY WORK</p>
          <h2>
            Curiosity in the idea.
            <br />
            Rigor in the implementation.
          </h2>
          <div>
            <p>
              My projects span Python, Java, TypeScript, and PostgreSQL. A
              recurring interest is making complex systems easier to inspect:
              tracing a finding to its source, reproducing a game session, or
              showing exactly where a query rewrite breaks.
            </p>
            <p>
              I’m interested in software engineering opportunities where that
              attention to correctness and usability matters.
            </p>
            <a className="text-link" href={github}>
              More of my work on GitHub ↗
            </a>
          </div>
        </section>
        <footer data-reveal id="contact">
          <p className="eyebrow">LET’S BUILD SOMETHING USEFUL</p>
          <h2>Have a problem worth solving?</h2>
          <a className="text-link" href={github}>
            Find me on GitHub ↗
          </a>
          <div className="footer-bottom">
            <span>Hrishi Bhardwaj / Selected work</span>
            <a href="#">Back to top ↑</a>
          </div>
        </footer>
      </main>
    </>
  );
}
