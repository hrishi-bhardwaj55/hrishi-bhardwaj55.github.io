import type { Metadata } from 'next';
import Workbench from './workbench';
export const metadata: Metadata = { title: 'Workbench — Hrishi Bhardwaj' };
export default function Page() {
  return <Workbench />;
}
