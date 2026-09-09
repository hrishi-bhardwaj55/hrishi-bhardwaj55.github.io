import type { Metadata } from 'next';
import { projects, github } from '../data';
import { VersionNav, VersionFooter } from '../shared';
export const metadata: Metadata = {
  title: 'Hrishi Bhardwaj — Professional portfolio',
};
export default function Professional() {
  return (
    <div className="variant professional">
      <VersionNav active="professional" />
      <main className="pro-shell">
        <aside className="pro-profile">
          <a className="pro-monogram" href="/versions">
            HB
          </a>
          <p className="v-kicker">SOFTWARE ENGINEER</p>
          <h1>
            Hrishi
            <br />
            Bhardwaj.
          </h1>
          <p>
            Building inspectable systems with Python, Java, TypeScript, and
            PostgreSQL.
          </p>
          <a className="pro-contact" href={github}>
            GitHub profile ↗
          </a>
          <div className="pro-focus">
            <span>FOCUS</span>
            <p>
              Backend systems
              <br />
              Applied AI
              <br />
              Product engineering
            </p>
          </div>
          <span className="pro-available">
            <i />
            Open to opportunities
          </span>
        </aside>
        <div className="pro-content">
          <header>
            <p className="v-kicker">SELECTED INDEPENDENT PROJECTS</p>
            <h2>
              Engineering decisions.
              <br />
              Evidence you can inspect.
            </h2>
            <p>
              Three projects spanning correctness, service boundaries, and
              reproducible interactions.
            </p>
          </header>
          {projects.map((p, i) => (
            <article className="pro-project" key={p.id}>
              <div className="pro-project-head">
                <span>0{i + 1}</span>
                <div>
                  <p className="v-kicker">{p.category}</p>
                  <h3>{p.name}</h3>
                </div>
                <a href={p.source} aria-label={`${p.name} source on GitHub`}>
                  ↗
                </a>
              </div>
              <p className="pro-description">{p.description}</p>
              <dl>
                <div>
                  <dt>Engineering decision</dt>
                  <dd>{p.decision}</dd>
                </div>
                <div>
                  <dt>Evidence</dt>
                  <dd>{p.evidence}</dd>
                </div>
              </dl>
              <p className="v-caveat">{p.limitation}</p>
              <div className="pro-bottom">
                <span>{p.stack.join(' / ')}</span>
                <a href={p.documentation}>{p.detailLabel} ↗</a>
              </div>
            </article>
          ))}
          <div className="pro-additional">
            <b>Additional work</b>
            <a href={`${github}/GetMeAJob`}>
              GetMeAJob — concurrent job discovery and deduplication ↗
            </a>
          </div>
        </div>
      </main>
      <VersionFooter />
    </div>
  );
}
