import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import Workbench from './workbench';

export const metadata: Metadata = pageMetadata({
  title: 'Hrishikesh Bhardwaj — Software Engineer',
  description:
    'Backend and distributed systems engineer. 4.5 years at ION Group, now a Master of Software Engineering student at Carnegie Mellon. Available January 2027.',
  path: '/',
});

export default function Home() {
  return <Workbench />;
}
