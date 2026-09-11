import { sitePath } from '@/lib/site-path';

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
