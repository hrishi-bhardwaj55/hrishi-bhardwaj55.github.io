export const missions = [
  {
    id: 'skeptic',
    label: 'Find the hidden edge case',
    question:
      'Two SQL queries match on ordinary data. What should happen before claiming a speedup?',
    options: [
      'Benchmark immediately',
      'Check NULLs and duplicate rows',
      'Choose the shorter query',
    ],
    correct: 1,
    feedback:
      'Ordinary rows can hide a semantic difference. Skeptic gates benchmarking on verification.',
  },
  {
    id: 'servicerswitch',
    label: 'Choose the right boundary',
    question: 'Which component owns arithmetic and reconciliation?',
    options: [
      'The language model',
      'The browser interface',
      'The deterministic Java engine',
    ],
    correct: 2,
    feedback:
      'Java handles calculations. Python handles extraction and orchestration, while source evidence stays attached.',
  },
  {
    id: 'cortex',
    label: 'Make the session replayable',
    question: 'What makes a practice session reproducible?',
    options: [
      'Its seed and configuration version',
      'Its highest score',
      'Its animation speed',
    ],
    correct: 0,
    feedback:
      'Seeded challenges and versioned configuration make a session inspectable and replayable.',
  },
] as const;
export function completeMission(
  completed: readonly string[],
  id: string,
  answer: number,
): string[] {
  const mission = missions.find((m) => m.id === id);
  if (
    !mission ||
    !Number.isInteger(answer) ||
    answer < 0 ||
    answer >= mission.options.length
  )
    throw new Error('Invalid mission answer');
  return mission.correct === answer && !completed.includes(id)
    ? [...completed, id]
    : [...completed];
}
