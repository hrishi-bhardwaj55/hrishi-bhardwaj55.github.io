import type { Metadata } from 'next';
import { projects, github } from '../data';
import { VersionNav, VersionFooter, ProjectGlyph } from '../shared';
export const metadata: Metadata = { title: 'Fieldnotes — Hrishi Bhardwaj' };
export default function Editorial() {
  return (
    <div className="variant editorial">
      <VersionNav active="editorial" />
      <main className="editorial-shell">
        <header className="ed-masthead">
          <span>HRISHI BHARDWAJ</span>
          <a href={github}>SOFTWARE ENGINEER ↗</a>
        </header>
        <section className="ed-intro">
          <p className="v-kicker">FIELDNOTES / SELECTED WORK</p>
          <h1>
            The details
            <br />
            make the <em>difference.</em>
          </h1>
          <div>
            <span className="ed-star" aria-hidden="true">
              ✳
            </span>
            <p>
              Notes on correctness, evidence, and the decisions that turn an
              idea into working software.
            </p>
          </div>
        </section>
        {projects.map((p, i) => (
          <article className={`ed-story ed-story-${i}`} key={p.id}>
            <div className="ed-story-meta">
              <span>0{i + 1}</span>
              <p>{p.category}</p>
              <span>{p.stack.join(' · ')}</span>
            </div>
            <div className="ed-story-main">
              <div>
                <p className="v-kicker">{p.name}</p>
                <h2>{p.title}</h2>
                <p>{p.description}</p>
                <a href={p.source}>Explore {p.name} ↗</a>
              </div>
              <figure>
                <ProjectGlyph id={p.id} />
                <figcaption>
                  {i === 0
                    ? '01 / CHALLENGE THE ASSUMPTION'
                    : i === 1
                      ? '02 / KEEP THE SOURCE ATTACHED'
                      : '03 / MAKE IT REPRODUCIBLE'}
                </figcaption>
              </figure>
            </div>
            <div className="ed-notes">
              <div>
                <h3>The decision</h3>
                <p>{p.decision}</p>
              </div>
              <div>
                <h3>The evidence</h3>
                <p>{p.evidence}</p>
                <p className="v-caveat">{p.limitation}</p>
                <a href={p.documentation}>Read the technical notes ↗</a>
              </div>
            </div>
          </article>
        ))}
        <section className="ed-postscript">
          <span className="v-kicker">POSTSCRIPT</span>
          <p>
            My work returns to the same question:
            <br />
            <em>can someone else inspect how this works?</em>
          </p>
          <a href={`${github}/GetMeAJob`}>Also built: GetMeAJob ↗</a>
        </section>
      </main>
      <VersionFooter />
    </div>
  );
}
