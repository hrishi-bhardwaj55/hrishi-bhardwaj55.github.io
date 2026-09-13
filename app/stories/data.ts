import twitterAnalytics from '@/content/stories/twitter-analytics.md?raw';
import awsFoundations from '@/content/stories/aws-foundations.md?raw';
import elasticScaling from '@/content/stories/elastic-scaling.md?raw';
import wecloudChat from '@/content/stories/wecloud-chat.md?raw';
import cloudStorage from '@/content/stories/cloud-storage.md?raw';
import socialNetworkStorage from '@/content/stories/social-network-storage.md?raw';
import uberRideMatching from '@/content/stories/uber-ride-matching.md?raw';
import cloudMachineLearning from '@/content/stories/cloud-machine-learning.md?raw';
import serverlessFunctions from '@/content/stories/serverless-functions.md?raw';
import { blogCatalog } from '../blog-catalog';
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
  '/stories/twitter-analytics/performance-milestones.png': {
    width: 1600,
    height: 890,
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
};
export const storyDiagrams = diagramDefinitions as readonly Diagram[];
export const stories = blogCatalog.map((item) => {
  const markdown = articleText[item.slug];
  if (!markdown) throw new Error(`Missing article: ${item.slug}`);
  return { ...item, markdown };
});

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

export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
