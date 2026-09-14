import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { sitePath } from '@/lib/site-path';
import { pageMetadata } from '@/lib/page-metadata';
import { PortfolioNav, WindowBar } from '../workspace-chrome';
import { email, github, linkedin } from '../projects';

export const metadata: Metadata = pageMetadata({
  title: 'Resume — Hrishikesh Bhardwaj',
  description:
    'Backend and distributed systems engineer. 4.5 years at ION Group, CMU Master of Software Engineering, and projects in cloud systems, streaming, and applied AI. Available January 2027.',
  path: '/resume/',
});

const pdf = '/files/Hrishikesh_Bhardwaj_Resume.pdf';
const skills = [
  ['Languages', 'Java, Python, C++, Go, Scala, SQL'],
  [
    'Backend & streaming',
    'Spring Boot, Java EE, JDBC, Servlets, EJB, JBoss / WildFly, FastAPI, Kafka, Spark, Samza, REST, gRPC',
  ],
  [
    'Cloud & delivery',
    'AWS (EC2, EKS, ECS, S3, Fargate, Lambda), Azure (Functions, App Service), Docker, Kubernetes, Helm, Jenkins, Git, Linux',
  ],
  [
    'Data',
    'Oracle / PL/SQL, PostgreSQL, MySQL, MongoDB, Elasticsearch, Redis, ChromaDB',
  ],
  [
    'Distributed systems',
    'System design, event-driven architecture, stream processing, high availability, fault tolerance, concurrency, consensus',
  ],
  [
    'Engineering',
    'Production on-call, incident response, SLAs, Grafana, Datadog, object-oriented design, TDD, Agile / Scrum',
  ],
  [
    'AI & ML',
    'LLM pipelines, multi-agent systems, RAG, MCP, prompt versioning, AI-assisted development',
  ],
];

function DownloadResume() {
  return (
    <a
      className="resume-download"
      href={sitePath(pdf)}
      download="Hrishikesh_Bhardwaj_Resume.pdf"
    >
      <Download size={18} aria-hidden="true" /> Download PDF
    </a>
  );
}

export default function Resume() {
  return (
    <div className="portfolio workbench">
      <PortfolioNav active="resume" />
      <main className="desk-shell resume-shell" id="resume-top">
        <header className="resume-heading">
          <div>
            <p className="v-kicker">EXPERIENCE / EDUCATION / SELECTED WORK</p>
            <h1>
              Hrishikesh Bhardwaj<span>.</span>
            </h1>
            <p className="resume-role">
              Backend &amp; Distributed Systems Engineer
            </p>
          </div>
          <div className="resume-heading-actions">
            <DownloadResume />
            <span>1 page · PDF · 346 KB</span>
          </div>
        </header>

        <div className="desk-window resume-document">
          <WindowBar label="hrishi / resume">
            <span>Available January 2027</span>
          </WindowBar>
          <div className="resume-overview">
            <p>
              4.5 years building high-throughput distributed systems at ION
              Group, from FX execution to post-trade processing. Currently
              pursuing a Master of Software Engineering at Carnegie Mellon, with
              a focus on reliable backends, cloud infrastructure, and applied
              AI.
            </p>
            <address className="resume-contact">
              <a href={`mailto:${email}`}>{email}</a>
              <a href="tel:+14123605635">(412) 360-5635</a>
              <a href={linkedin}>LinkedIn ↗</a>
              <a href={github}>GitHub ↗</a>
            </address>
            <p className="resume-availability">
              Available for full-time roles from January 2027
            </p>
          </div>

          <div className="resume-layout">
            <nav className="resume-index" aria-label="Resume sections">
              <span className="resume-index-label">ON THIS PAGE</span>
              <a href="#experience">
                <span>01</span> Experience
              </a>
              <a href="#education">
                <span>02</span> Education
              </a>
              <a href="#projects">
                <span>03</span> Projects
              </a>
              <a href="#skills">
                <span>04</span> Skills
              </a>
            </nav>
            <div className="resume-content">
              <section
                id="experience"
                aria-labelledby="experience-title"
                className="resume-section"
              >
                <h2 id="experience-title">
                  <span>01</span> Experience
                </h2>
                <div className="resume-employer">
                  <h3>
                    <a href="https://iongroup.com/">
                      ION Group <span aria-hidden="true">↗</span>
                    </a>
                  </h3>
                  <p>Financial technology · FX &amp; post-trade systems</p>
                </div>
                <article className="resume-position">
                  <div className="resume-entry-heading">
                    <h4>Software Engineer 2</h4>
                    <p>Aug 2023 — Jul 2025</p>
                  </div>
                  <ul>
                    <li>
                      Modernized a <strong>10M+ line Java platform</strong>{' '}
                      processing billions of dollars in transactions. Completed
                      an AI-assisted Java 8 → 21 migration{' '}
                      <strong>67% faster</strong> than projected across the
                      software development lifecycle.
                    </li>
                    <li>
                      Root-caused a production pricing defect and fixed the core
                      logic to prevent recurrence, avoiding millions in client
                      losses and earning direct client commendation.
                    </li>
                    <li>
                      Cut trader execution time <strong>60%</strong> on{' '}
                      <a href="https://iongroup.com/products/markets/aphelion/">
                        Aphelion
                      </a>{' '}
                      with a one-click Dynamic Trading Algo that monitored
                      prices and placed orders across liquidity providers to
                      mitigate position risk at breakeven.
                    </li>
                    <li>
                      As Technical Excellence Lead, shortened vulnerability
                      detection <strong>75%</strong> and remediated{' '}
                      <strong>15+ critical vulnerabilities</strong> through
                      Black Duck, EC2, and Jenkins automation. Mentored eight
                      engineers through code and design reviews.
                    </li>
                    <li>
                      Led a team launching an electronic trading product,
                      delivering <strong>30+ features</strong> from requirements
                      and architecture through integration and testing.
                    </li>
                    <li>
                      Improved efficiency <strong>10–15% under load</strong>{' '}
                      with a thread-safe, concurrent in-memory cache that
                      reduced database queries.
                    </li>
                  </ul>
                </article>
                <article className="resume-position">
                  <div className="resume-entry-heading">
                    <h4>Software Engineer 1</h4>
                    <p>Feb 2021 — Aug 2023</p>
                  </div>
                  <ul>
                    <li>
                      Scaled{' '}
                      <a href="https://iongroup.com/products/markets/xtp/">
                        XTP
                      </a>{' '}
                      to <strong>millions of trades per day</strong> across
                      thousands of accounts for major banks on multiple
                      continents, building fault-tolerant Java / Java EE
                      services on JBoss and WildFly.
                    </li>
                    <li>
                      Reduced nightly market-data processing from{' '}
                      <strong>65 minutes to 6</strong> with a thread-pooled Java
                      pipeline; lowered per-record p99 latency from{' '}
                      <strong>20 ms to 4 ms</strong>.
                    </li>
                    <li>
                      Supported 24/7 availability against client SLAs through
                      production on-call, incident triage, and root-cause
                      analysis.
                    </li>
                    <li>
                      Automated patch delivery with Jenkins, taking releases
                      from <strong>20 minutes to 2</strong> across 20+ patches
                      per week and saving roughly six engineer-hours weekly.
                    </li>
                    <li>
                      Delivered <strong>50+ regulatory reports</strong> and
                      multi-continent batch workflows against nightly deadlines,
                      designing Oracle persistence schemas and tuning queries.
                    </li>
                  </ul>
                </article>
                <article className="resume-internship">
                  <div className="resume-entry-heading">
                    <h3>Centre for Development of Advanced Computing</h3>
                    <p>May — Jun 2019</p>
                  </div>
                  <p className="resume-entry-context">
                    Software Development Intern · C-DAC
                  </p>
                  <ul>
                    <li>
                      Built a registration portal with JSP, Bootstrap, and MySQL
                      for the Rajasthan Government Medical &amp; Health website,
                      serving approximately 130,000 users.
                    </li>
                  </ul>
                </article>
              </section>

              <section
                id="education"
                aria-labelledby="education-title"
                className="resume-section"
              >
                <h2 id="education-title">
                  <span>02</span> Education
                </h2>
                <article className="resume-education">
                  <div className="resume-entry-heading">
                    <h3>
                      <a href="https://www.scs.cmu.edu/">
                        Carnegie Mellon University ↗
                      </a>
                    </h3>
                    <p>Aug 2025 — Dec 2026</p>
                  </div>
                  <p>
                    Master of Software Engineering · School of Computer Science
                  </p>
                  <p className="resume-entry-context">
                    GPA 4.0 / 4.0 · Expected graduation December 2026
                  </p>
                </article>
                <article className="resume-education">
                  <div className="resume-entry-heading">
                    <h3>
                      <a href="https://vit.ac.in/">
                        Vellore Institute of Technology ↗
                      </a>
                    </h3>
                    <p>Jun 2017 — May 2021</p>
                  </div>
                  <p>B.Tech in Information Technology</p>
                  <p className="resume-entry-context">GPA 8.75 / 10</p>
                </article>
              </section>

              <section
                id="projects"
                aria-labelledby="projects-title"
                className="resume-section"
              >
                <h2 id="projects-title">
                  <span>03</span> Selected projects
                </h2>
                <article className="resume-project">
                  <div className="resume-entry-heading">
                    <h3>
                      Intelligent Ingestion &amp; Attribute Prediction System
                    </h3>
                    <p>Jan — Dec 2026</p>
                  </div>
                  <p className="resume-entry-context">
                    CMU Capstone · Team Lead &amp; Forward Deployed Engineer
                  </p>
                  <ul>
                    <li>
                      Led five engineers embedded with client eParts Services
                      LLC. Reduced manual catalog review <strong>3–5×</strong>{' '}
                      with per-attribute confidence routing, hybrid rule / ML
                      prediction, and human-in-the-loop retraining.
                    </li>
                    <li>
                      Owned stakeholder requirements and{' '}
                      <strong>20+ architecture decision records</strong> across
                      ingestion, prediction, routing, and writeback. Built
                      idempotent writeback and audit logging on Azure, with
                      Datadog monitoring.
                    </li>
                    <li>
                      Built the team’s <strong>32-agent, seven-pipeline</strong>{' '}
                      FastAPI engineering-operations system with seven MCP
                      wrappers and ChromaDB RAG, integrating Zoom transcripts,
                      Jira, and GitHub PR webhooks.
                    </li>
                    <li>
                      Made agent routing testable without model calls by
                      separating orchestration contracts from model output;
                      verified dispatch order and negative cases across{' '}
                      <strong>20 offline scenarios</strong>.
                    </li>
                  </ul>
                </article>
                <article className="resume-project">
                  <div className="resume-entry-heading">
                    <h3>
                      <a href={sitePath('/stories/twitter-analytics/')}>
                        Twitter/X User Recommendation System
                      </a>
                    </h3>
                    <p>Jan — Apr 2026</p>
                  </div>
                  <p className="resume-entry-context">
                    CMU · Java, Spark, Kubernetes, AWS, Redis
                  </p>
                  <ul>
                    <li>
                      Processed <strong>1 TB+ of data</strong> with Spark ETL
                      and built a recommendation scoring algorithm with{' '}
                      <strong>98% accuracy</strong>. Containerized Java services
                      with Docker and Helm, and compared self-managed
                      Kubernetes, EKS, and ECS.
                    </li>
                    <li>
                      Reached <strong>20,000 requests/sec at $0.31/hour</strong>{' '}
                      in Phase 3 using ECS Fargate and RDS. A separate,
                      expensive{' '}
                      <strong>
                        Redis-only experiment reached 70,000 requests/sec
                      </strong>
                      , keeping data entirely in memory without a database.
                    </li>
                  </ul>
                  <a
                    className="resume-story-link"
                    href={sitePath('/stories/twitter-analytics/')}
                  >
                    Read the architecture and performance story{' '}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
                <article className="resume-project">
                  <div className="resume-entry-heading">
                    <h3>
                      <a href={sitePath('/stories/uber-ride-matching/')}>
                        Uber Ride Booking System
                      </a>
                    </h3>
                    <p>Jan — Apr 2026</p>
                  </div>
                  <p className="resume-entry-context">
                    CMU · Kafka &amp; Samza
                  </p>
                  <ul>
                    <li>
                      Built a real-time pipeline ingesting GPS streams to match
                      riders with nearby drivers. Sustained{' '}
                      <strong>10K+ events/sec</strong> and cut rider-match
                      latency <strong>30%</strong> through stream joins.
                    </li>
                  </ul>
                  <a
                    className="resume-story-link"
                    href={sitePath('/stories/uber-ride-matching/')}
                  >
                    Read the streaming system story{' '}
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
                <article className="resume-project">
                  <div className="resume-entry-heading">
                    <h3>Quorum-Based Replication with Raft</h3>
                    <p>Aug — Dec 2025</p>
                  </div>
                  <p className="resume-entry-context">CMU · Go</p>
                  <ul>
                    <li>
                      Implemented Raft over simulated RPC, including leader
                      election, log replication, and term-based safety,
                      maintaining linearizable consistency under node crashes
                      and message loss.
                    </li>
                    <li>
                      Enforced a single leader per term through majority-quorum
                      elections, automatic step-down on higher terms, and log
                      commits only after majority acknowledgment.
                    </li>
                  </ul>
                </article>
              </section>

              <section
                id="skills"
                aria-labelledby="skills-title"
                className="resume-section"
              >
                <h2 id="skills-title">
                  <span>04</span> Technical skills
                </h2>
                <dl className="resume-skills">
                  {skills.map(([label, detail]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{detail}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>
          <footer className="resume-document-footer">
            <p>Prefer a copy to keep?</p>
            <DownloadResume />
          </footer>
        </div>
        <footer className="resume-footer">
          <a href={sitePath('/')}>← Back to the workbench</a>
          <a href="#resume-top">Back to top ↑</a>
        </footer>
      </main>
    </div>
  );
}
