import twitterAnalytics from '@/content/stories/twitter-analytics.md?raw';

export const stories = [
  {
    slug: 'twitter-analytics',
    project: 'Twitter Analytics',
    title:
      'I built a Twitter analytics service. Most of the work was figuring out why it was slow.',
    excerpt:
      'A terabyte of tweets. Five queries turned into one. A service that grew from 353 to about 10,000 requests per second.',
    period: 'February–April 2026',
    context: 'Cloud computing semester project',
    stack: ['Go', 'Java', 'Spark', 'MySQL', 'AWS'],
    sourceNote:
      'Based on the project’s four submitted reports, repository history, ETL notebook, application code, and deployment configurations. Throughput and cost figures are historical project results, not measurements rerun for this article.',
    markdown: twitterAnalytics,
  },
] as const;

export function readingMinutes(markdown: string) {
  return Math.ceil(
    markdown.replace(/!\[[^\]]*\]\([^)]*\)/g, '').split(/\s+/).length / 220,
  );
}

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
