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
export const projects: readonly Project[] = [
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
      'Reported throughput grew from 353.25 to about 10,000 requests per second across three project phases.',
    limitation:
      'Historical semester-project benchmarks across evolving configurations. The final result used a warmed database; it is not production traffic.',
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
];
