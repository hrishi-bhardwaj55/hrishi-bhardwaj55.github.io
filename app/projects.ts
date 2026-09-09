export const github = 'https://github.com/hrishi-bhardwaj55';
export const projects = [
  {
    id: 'skeptic',
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
] as const;
