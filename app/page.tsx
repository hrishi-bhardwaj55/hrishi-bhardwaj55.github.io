import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import { siteUrl } from '@/lib/site-path';
import { JsonLd, person } from '@/lib/structured-data';
import Workbench from './workbench';

export const metadata: Metadata = pageMetadata({
  title: 'Hrishikesh Bhardwaj — Software Engineer',
  description:
    'Software engineer. 4.5 years at ION Group in Java, AWS, and distributed systems. Now a Master of Software Engineering student at Carnegie Mellon. Available January 2027.',
  path: '/',
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@graph': [
            {
              '@type': 'WebSite',
              url: siteUrl('/'),
              name: 'Hrishikesh Bhardwaj',
              author: person,
            },
            person,
          ],
        }}
      />
      <Workbench />
    </>
  );
}
