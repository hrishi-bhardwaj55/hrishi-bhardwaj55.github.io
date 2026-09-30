import type { Metadata } from 'next';
import { siteUrl, sitePath } from '@/lib/site-path';

// The canonical link tells search engines this address is the homepage.
export const metadata: Metadata = {
  alternates: { canonical: siteUrl('/') },
};

export default function WorkbenchRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${sitePath('/')}`} />
      <p>
        <a href={sitePath('/')}>Continue to Workbench</a>
      </p>
    </>
  );
}
