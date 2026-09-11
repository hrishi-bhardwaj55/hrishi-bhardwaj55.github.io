import { sitePath } from '@/lib/site-path';
export default function NotFound() {
  return (
    <main className="portfolio workbench missing-page">
      <p className="v-kicker">404 / FILE NOT FOUND</p>
      <h1>This page isn’t here.</h1>
      <a href={sitePath('/')}>Return to Workbench ↗</a>
    </main>
  );
}
