export type Project = {
  id: string;
  name: string;
  label: string;
  category: string;
  stack: readonly string[];
  title: string;
  description: string;
  decision: string;
  evidence: string;
  limitation: string;
  source?: string;
  documentation?: string;
  detailLabel?: string;
  symbol?: string;
  story?: string;
  stages: readonly { name: string; text: string }[];
};
export const github = 'https://github.com/hrishi-bhardwaj55';
export const linkedin = 'https://www.linkedin.com/in/hrishikesh-bhardwaj/';
export const email = 'hrishikb@andrew.cmu.edu';
export const projects: readonly Project[] = [
  {
    id: 'attribute-prediction',
    label: 'PY',
    stages: [
      {
        name: 'Ingest',
        text: 'Normalize supplier catalog records into one attribute schema.',
      },
      {
        name: 'Predict',
        text: 'Combine deterministic rules with per-attribute model prediction.',
      },
      {
        name: 'Route',
        text: 'Send only low-confidence attributes to a human reviewer.',
      },
      {
        name: 'Write back',
        text: 'Apply idempotent updates and log every change for audit.',
      },
    ],
    name: 'Attribute Prediction',
    category: 'Applied AI · CMU capstone',
    stack: ['Python', 'FastAPI', 'Azure', 'ChromaDB'],
    title: 'Confidence decides what a person still has to read.',
    description:
      'Catalog ingestion and attribute prediction for eParts Services LLC, built by the five-engineer team I led as forward deployed engineer.',
    decision:
      'Route per attribute rather than per record. Each prediction carries its own confidence, so a reviewer sees only the fields the system is unsure about, and their corrections feed retraining.',
    evidence:
      'Manual catalog review dropped three to five times against the process the client had been using, across ingestion, prediction, routing, and writeback.',
    limitation:
      'Client-owned data and deployment; measured on their catalogs rather than a public benchmark, and the source stays private.',
    symbol: '✓',
  },
  {
    id: 'skeptic',
    label: 'PY',
    stages: [
      {
        name: 'Inspect',
        text: 'Parse the SQL and capture the PostgreSQL plan.',
      },
      {
        name: 'Verify',
        text: 'Compare result multisets and run adversarial fixtures.',
      },
      {
        name: 'Measure',
        text: 'Benchmark only candidates whose verification passed.',
      },
    ],
    name: 'Skeptic',
    category: 'Database correctness',
    stack: ['Python', 'PostgreSQL', 'SQL'],
    title: 'Faster is only useful when the answer is right.',
    description:
      'A Postgres performance advisor that tests SQL rewrites against real data and adversarial fixtures before benchmarking them.',
    decision:
      'Gate every benchmark on verification. Compare row multisets, challenge NULLs and duplicates, and keep unsupported cases unverified.',
    evidence:
      'Two rewrites passed the main dataset but failed adversarial fixtures in the committed eight-proposal evaluation.',
    limitation:
      'Authored local examples; empirical verification rather than formal equivalence or live-model accuracy.',
    source: `${github}/skeptic`,
    documentation: `${github}/skeptic/blob/main/planproof/pipeline.py`,
    detailLabel: 'Verification pipeline',
    symbol: '≠',
  },
  {
    id: 'servicerswitch',
    label: 'JV',
    stages: [
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
    name: 'ServicerSwitch',
    category: 'Evidence-driven systems',
    stack: ['Java', 'Python', 'Next.js'],
    title: 'Every finding should lead back to evidence.',
    description:
      'A mortgage-transfer audit that combines document extraction, deterministic calculations, and page-level evidence.',
    decision:
      'Keep arithmetic in a stateless Java service. Let Python manage extraction and orchestration, with eight tools bound to the current audit.',
    evidence:
      'The repository documents 300 synthetic accounts and 1,500 PDFs, with source-page provenance attached to findings.',
    limitation:
      'Synthetic evaluation; historical model results are not current-runtime or real-customer performance.',
    source: `${github}/ServiceSwitcher`,
    documentation: `${github}/ServiceSwitcher/blob/master/docs/evals.md`,
    detailLabel: 'Evaluation methodology',
    symbol: '↳',
  },
  {
    id: 'cortex',
    label: 'TS',
    stages: [
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
    name: 'Cortex',
    category: 'Interactive products',
    stack: ['React', 'TypeScript', 'Vitest'],
    title: 'A good experiment is one you can replay.',
    description:
      'Nine cognitive practice games with seeded challenges, five progressive levels, and game-specific feedback.',
    decision:
      'Separate pure game engines from React presentation. Store the seed and configuration version, and measure response timing independently of rendering.',
    evidence:
      'Replayable sessions, pause-aware timing, guarded submissions, and local history without an account.',
    limitation:
      'Independent practice software; scores are training heuristics, not employer percentiles or hiring predictions.',
    source: `${github}/ZapN`,
    documentation: `${github}/ZapN/blob/master/docs/architecture.md`,
    detailLabel: 'Engine architecture',
    symbol: '⌘',
  },
  {
    id: 'twitter-analytics',
    name: 'Twitter Analytics',
    label: 'GO',
    category: 'Cloud systems · Source private',
    stack: ['Go', 'Spark', 'MySQL', 'AWS'],
    title: 'Most of the work was figuring out why it was slow.',
    description:
      'A contact-ranking service built over a terabyte of historical tweets. The project moved from Kubernetes to ECS Fargate and RDS.',
    decision:
      'Replace five sequential database queries with one denormalized lookup. Precompute reusable features in Spark, then follow the next bottleneck.',
    evidence:
      'Phase 3 reached 20,000 requests per second at $0.31/hour. A separate Redis-only, in-memory experiment reached 70,000 RPS.',
    limitation:
      'Historical project benchmarks across different configurations. The Redis-only experiment was expensive; its throughput does not share the $0.31/hour cost.',
    story: '/stories/twitter-analytics/',
    stages: [
      {
        name: 'Prepare',
        text: 'Spark cleans the historical tweets and prepares reusable pair features.',
      },
      {
        name: 'Serve',
        text: 'Go combines one MySQL lookup with request-specific scoring, bounded caches, and duplicate-request suppression.',
      },
      {
        name: 'Measure',
        text: 'Load tests and utilization measurements guide schema, placement, and task-count decisions.',
      },
    ],
  },
  {
    id: 'uber-ride-matching',
    name: 'Uber Ride Matching',
    label: 'JV',
    category: 'Stream processing · Source private',
    stack: ['Java', 'Kafka', 'Samza', 'AWS EMR'],
    title: 'The next event changes who can accept a ride.',
    description:
      'An Uber-style coursework backend that matches ride requests with available drivers, updates block-local state, and joins rider events with advertising data.',
    decision:
      'Partition driver and ride events by city block. Keep availability in a recoverable state store, and remove a selected driver before processing the next match.',
    evidence:
      'Separate driver-match, ad-match, and ad-price jobs; explicit event transitions; rider-profile updates broadcast to the partitions that need them.',
    limitation:
      'Built over supplied NYCabs event traces. The build log records implementation details, without measured throughput or recovery-time results.',
    story: '/stories/uber-ride-matching/',
    stages: [
      {
        name: 'Route',
        text: 'Kafka sends block events to blockId % 5; profile updates reach all five partitions.',
      },
      {
        name: 'Match',
        text: 'Samza updates availability and scores drivers in the same block as the ride request.',
      },
      {
        name: 'Update',
        text: 'A match removes the chosen driver; ride completion registers the driver at the destination.',
      },
    ],
  },
];
