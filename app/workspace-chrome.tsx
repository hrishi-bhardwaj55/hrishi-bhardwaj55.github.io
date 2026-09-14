import type { ReactNode } from 'react';
import { sitePath } from '@/lib/site-path';
import { github } from './projects';

export function PortfolioNav({ active }: { active: 'workbench' | 'blogs' }) {
  return (
    <nav className="portfolio-nav" aria-label="Portfolio">
      <a
        href={sitePath('/')}
        className="portfolio-brand"
        aria-label="Hrishikesh Bhardwaj home"
      >
        hb<span>.</span>
      </a>
      <div className="portfolio-tabs">
        <a
          href={sitePath('/')}
          aria-current={active === 'workbench' ? 'page' : undefined}
        >
          <span aria-hidden="true">⌘</span> Workbench
        </a>
        <a
          href={sitePath('/blogs/')}
          aria-current={active === 'blogs' ? 'page' : undefined}
        >
          <span aria-hidden="true">≡</span> Blogs
        </a>
      </div>
      <a className="portfolio-github" href={github}>
        GitHub ↗
      </a>
    </nav>
  );
}

export function WindowBar({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  return (
    <div className="desk-titlebar">
      <div aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <span>{label}</span>
      <div className="window-meta">{children}</div>
    </div>
  );
}
