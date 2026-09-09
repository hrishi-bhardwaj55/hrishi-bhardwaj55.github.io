'use client';
import { useEffect, useRef, useState } from 'react';
import { projects, github } from '../data';
import { VersionNav, VersionFooter, ProjectGlyph } from '../shared';
import Motion from '../../motion';

function OrbitalField({ paused }: { paused: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const phase = useRef(0);
  useEffect(() => {
    const el = host.current,
      surface = canvas.current;
    if (!el || !surface) return;
    const ctx = surface.getContext('2d');
    if (!ctx) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0,
      width = 1,
      height = 1,
      inView = true,
      last = 0;
    let pointerX = 0,
      pointerY = 0,
      easedX = 0,
      easedY = 0;
    const points = Array.from({ length: 96 }, (_, i) => {
      const y = 1 - (i / 95) * 2;
      const radius = Math.sqrt(1 - y * y);
      const a = i * Math.PI * (3 - Math.sqrt(5));
      return { x: Math.cos(a) * radius, y, z: Math.sin(a) * radius };
    });
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const radius = Math.min(width * 0.39, height * 0.39);
      const angle = phase.current + easedX * 0.4,
        tilt = 0.35 + easedY * 0.3;
      const projected = points.map((p) => {
        const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
        const z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
        const y = p.y * Math.cos(tilt) - z * Math.sin(tilt);
        const depth = p.y * Math.sin(tilt) + z * Math.cos(tilt);
        return {
          x: width / 2 + x * radius,
          y: height / 2 + y * radius,
          z: depth,
        };
      });
      projected.forEach((p, i) => {
        for (let j = i + 1; j < Math.min(i + 7, projected.length); j++) {
          const q = projected[j];
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance < radius * 0.55) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(156,217,185,${(0.04 + (p.z + 1) * 0.035) * (1 - distance / (radius * 0.7))})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.05 + (p.z + 1) * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(176,239,202,${0.18 + (p.z + 1) * 0.34})`;
        ctx.fill();
      });
    };
    const tick = (time: number) => {
      if (last) phase.current += Math.min(time - last, 40) * 0.00013;
      last = time;
      easedX += (pointerX - easedX) * 0.04;
      easedY += (pointerY - easedY) * 0.04;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      const animate =
        !paused && !preference.matches && inView && !document.hidden;
      el.dataset.inView = String(inView);
      if (animate) frame = requestAnimationFrame(tick);
      else draw();
    };
    const resize = () => {
      width = el.clientWidth;
      height = el.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = width * dpr;
      surface.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    const observer = new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      sync();
    });
    observer.observe(el);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(el);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    resize();
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [paused]);
  return (
    <div className="kinetic-field" ref={host} aria-hidden="true">
      <canvas ref={canvas} />
      <div className="orbital-ring ring-one" />
      <div className="orbital-ring ring-two" />
      <div className="field-label label-one">01 / CORRECTNESS</div>
      <div className="field-label label-two">02 / EVIDENCE</div>
      <div className="field-label label-three">03 / REPLAY</div>
      <div className="orbit-center">
        hb<span>.</span>
      </div>
    </div>
  );
}
export default function Kinetic() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  return (
    <div className="variant kinetic" data-paused={paused}>
      <VersionNav active="kinetic" />
      <Motion disabled={paused} />
      <main>
        <section className="kinetic-hero">
          <div className="kinetic-topline">
            <span>HRISHI BHARDWAJ / SOFTWARE ENGINEER</span>
            <button
              type="button"
              aria-pressed={paused}
              disabled={reduced}
              onClick={() => setPaused(!paused)}
            >
              {reduced
                ? 'Reduced motion'
                : paused
                  ? '▶ Resume motion'
                  : 'Ⅱ Pause motion'}
            </button>
          </div>
          <OrbitalField paused={paused} />
          <div className="kinetic-title">
            <p className="v-kicker">IDEAS INTO SYSTEMS.</p>
            <h1>
              Make it work.
              <br />
              <em>Make it hold up.</em>
            </h1>
            <p>
              Correctness. Evidence. Reproducibility.
              <br />
              Three principles, made tangible through code.
            </p>
            <a href="#kinetic-work">
              Enter the work <span>↓</span>
            </a>
          </div>
          <span className="kinetic-coordinate">
            INDEPENDENT PROJECTS / 01—03
          </span>
        </section>
        <section id="kinetic-work" className="kinetic-projects">
          {projects.map((p, i) => (
            <article data-reveal className="kinetic-chapter" key={p.id}>
              <div className="chapter-number">
                0{i + 1}
                <span>{p.category}</span>
              </div>
              <div className="chapter-story">
                <p className="v-kicker">{p.stack.join(' / ')}</p>
                <h2>{p.name}</h2>
                <p className="chapter-title">{p.title}</p>
                <p>{p.description}</p>
                <details>
                  <summary>
                    Inside the engineering <span>+</span>
                  </summary>
                  <p>{p.decision}</p>
                  <p>{p.evidence}</p>
                  <p className="v-caveat">{p.limitation}</p>
                  <a href={p.documentation}>{p.detailLabel} ↗</a>
                </details>
                <a className="chapter-link" href={p.source}>
                  Explore the source ↗
                </a>
              </div>
              <div className="chapter-visual">
                <ProjectGlyph id={p.id} />
                <span>
                  {
                    [
                      'VERIFY → CHALLENGE → MEASURE',
                      'EXTRACT → RECONCILE → EXPLAIN',
                      'SEED → PLAY → REPLAY',
                    ][i]
                  }
                </span>
              </div>
            </article>
          ))}
        </section>
        <div className="kinetic-end">
          <p>Built to be explored.</p>
          <a href={`${github}/GetMeAJob`}>Also built: GetMeAJob ↗</a>
        </div>
      </main>
      <VersionFooter />
    </div>
  );
}
