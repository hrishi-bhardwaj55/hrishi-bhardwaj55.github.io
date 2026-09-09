import type { Metadata } from 'next';
import Arcade from './arcade';
export const metadata: Metadata = { title: 'Project Arcade — Hrishi Bhardwaj' };
export default function Page() {
  return <Arcade />;
}
