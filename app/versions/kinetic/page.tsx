import type { Metadata } from 'next';
import Kinetic from './kinetic';
export const metadata: Metadata = { title: 'Kinetic — Hrishi Bhardwaj' };
export default function Page() {
  return <Kinetic />;
}
