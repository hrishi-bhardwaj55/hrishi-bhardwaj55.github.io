import type { Metadata } from 'next';
import { versions } from './data';
export const metadata: Metadata = {
  title: 'Five directions — Hrishi Bhardwaj',
};
export default function Versions() {
  return (
    <main className="version-gallery">
      <header className="gallery-top">
        <a href="/">hb.</a>
        <span>PORTFOLIO / DESIGN COLLECTION</span>
        <a href="/">Original version ↗</a>
      </header>
      <section className="gallery-intro">
        <p className="v-kicker">SAME ENGINEER. FIVE PERSPECTIVES.</p>
        <h1>
          Find your
          <br />
          <em>point of view.</em>
        </h1>
        <p>
          Five complete ways to explore the work.
          <br />
          Each with its own pace, personality, and interaction.
        </p>
      </section>
      <div className="version-grid">
        {versions.map((v, i) => (
          <a
            className={`version-card preview-${v.id}`}
            href={`/versions/${v.id}`}
            key={v.id}
            style={{ '--v-accent': v.accent } as React.CSSProperties}
          >
            <div className="version-mini" aria-hidden="true">
              <span className="mini-index">0{i + 1}</span>
              {v.id === 'kinetic' ? (
                <div className="mini-orbit">
                  <i />
                  <i />
                  <b>hb.</b>
                </div>
              ) : v.id === 'professional' ? (
                <div className="mini-prof">
                  <b>
                    Hrishi
                    <br />
                    Bhardwaj.
                  </b>
                  <span />
                  <span />
                  <span />
                </div>
              ) : v.id === 'arcade' ? (
                <div className="mini-quest">
                  <b>01</b>
                  <i />
                  <b>02</b>
                  <i />
                  <b>03</b>
                </div>
              ) : v.id === 'editorial' ? (
                <div className="mini-editorial">
                  Notes on
                  <br />
                  <em>making things.</em>
                  <hr />
                </div>
              ) : (
                <div className="mini-code">
                  <span>~/portfolio</span>
                  <b>→ skeptic.py</b>
                  <b>→ audit.java</b>
                  <b>→ cortex.ts</b>
                </div>
              )}
            </div>
            <div className="version-card-copy">
              <p>{v.kind}</p>
              <h2>
                {v.name}
                <span>↗</span>
              </h2>
              <div>{v.description}</div>
            </div>
          </a>
        ))}
      </div>
      <footer className="gallery-footer">
        <span>Hrishi Bhardwaj / Selected engineering work</span>
        <a href="/">Return to the original ↗</a>
      </footer>
    </main>
  );
}
