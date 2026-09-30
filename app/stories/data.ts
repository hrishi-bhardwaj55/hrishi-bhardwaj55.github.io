import twitterAnalytics from '@/content/stories/twitter-analytics.md?raw';
import awsFoundations from '@/content/stories/aws-foundations.md?raw';
import elasticScaling from '@/content/stories/elastic-scaling.md?raw';
import wecloudChat from '@/content/stories/wecloud-chat.md?raw';
import cloudStorage from '@/content/stories/cloud-storage.md?raw';
import socialNetworkStorage from '@/content/stories/social-network-storage.md?raw';
import uberRideMatching from '@/content/stories/uber-ride-matching.md?raw';
import cloudMachineLearning from '@/content/stories/cloud-machine-learning.md?raw';
import serverlessFunctions from '@/content/stories/serverless-functions.md?raw';
import epartsAgentHarness from '@/content/stories/eparts-agent-harness.md?raw';
import { pageMetadata } from '@/lib/page-metadata';
import { blogCatalog, blogPath } from '../blog-catalog';
import diagramDefinitions from '@/content/stories/diagrams.json';
import type { Diagram } from './story-diagram';

export const storyImageSizes: Record<
  string,
  { width: number; height: number }
> = {
  '/stories/twitter-analytics/phase1-topology.png': {
    width: 1600,
    height: 1250,
  },
  '/stories/twitter-analytics/data-pipeline.png': { width: 1600, height: 850 },
  '/stories/twitter-analytics/schema-redesign.png': {
    width: 1600,
    height: 960,
  },
  '/stories/twitter-analytics/phase2-topology.png': {
    width: 1600,
    height: 1400,
  },
  '/stories/twitter-analytics/phase3-topology.png': {
    width: 1600,
    height: 1320,
  },
};

const articleText: Record<string, string> = {
  'twitter-analytics': twitterAnalytics,
  'aws-foundations': awsFoundations,
  'elastic-scaling': elasticScaling,
  'wecloud-chat': wecloudChat,
  'cloud-storage': cloudStorage,
  'social-network-storage': socialNetworkStorage,
  'uber-ride-matching': uberRideMatching,
  'cloud-machine-learning': cloudMachineLearning,
  'serverless-functions': serverlessFunctions,
  'eparts-agent-harness': epartsAgentHarness,
};
export const storyDiagrams = diagramDefinitions as readonly Diagram[];
export const stories = blogCatalog.map((item) => {
  const markdown = articleText[item.slug];
  if (!markdown) throw new Error(`Missing article: ${item.slug}`);
  return { ...item, markdown };
});

// Shared by the article and its old /stories/ address, so both name the same
// canonical URL and share the same social card.
export function storyMetadata(story: (typeof stories)[number]) {
  return pageMetadata({
    title: `${story.title} — Hrishikesh Bhardwaj`,
    description: story.excerpt,
    path: blogPath(story.slug),
    type: 'article',
    publishedTime: story.published,
  });
}

export function readingMinutes(markdown: string) {
  return Math.max(
    1,
    Math.ceil(
      markdown
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/^:::diagram .+$/gm, '')
        .split(/\s+/).length / 220,
    ),
  );
}

// Fenced code keeps its blank lines, so split around fences before splitting paragraphs.
export function storyBlocks(markdown: string) {
  return markdown
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/^(```[^\n]*\n[\s\S]*?\n```)$/m)
    .flatMap((part) =>
      part.startsWith('```') ? [part] : part.split(/\n\s*\n/),
    )
    .map((block) => block.trim())
    .filter(Boolean);
}

export function storyHeadings(markdown: string) {
  return storyBlocks(markdown)
    .filter((block) => block.startsWith('## '))
    .map((block) => block.slice(3).split('\n')[0].trim());
}

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
