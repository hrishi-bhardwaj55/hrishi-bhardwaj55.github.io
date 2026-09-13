# Hrishi Bhardwaj — Workbench portfolio

A dark portfolio with public-code projects and long-form stories for work whose source is private. Built with React, TypeScript, Vinext, and CSS; every page is exported as static HTML for GitHub Pages.

## Run locally

Install with `npm ci`, then use `npm run dev`. `npm run build` exports the site into `dist/client`. No database, API key, or server is needed to host the finished site.

## Publish on GitHub Pages

1. Push this portfolio folder to your own GitHub repository, including `.github/workflows/pages.yml` and `package-lock.json`. Do not copy the separate private project repository into it.
2. In the repository, open **Settings → Pages → Build and deployment → Source**, and choose **GitHub Actions**.
3. Push to `main` or `master`, or run **Publish portfolio to GitHub Pages** from the Actions tab. The workflow builds and publishes the static site. GitHub displays its URL in Pages settings and the deployment summary.

The workflow gets the URL prefix from GitHub automatically. It supports both a profile repository such as `hrishi-bhardwaj55.github.io` and a project repository such as `portfolio`. A custom domain can be configured in GitHub's Pages settings. See [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

For a local subpath build in PowerShell, set `$env:NEXT_PUBLIC_BASE_PATH='/portfolio'`, then run `npm run build`. That output is in `dist/client/portfolio`; upload the contents of that directory because GitHub mounts it at `/portfolio` itself. Clear the environment variable before building a root-domain site. The workflow selects the correct directory automatically.

## Update projects and stories

- Project descriptions, access links, technology labels, and architecture stages: `app/projects.ts`
- Workbench interface: `app/workbench.tsx`
- Blogs tab and index: `app/blogs/page.tsx`
- Shared Workbench/Blogs navigation and window frame: `app/workspace-chrome.tsx`
- Story text: `content/stories/twitter-analytics.md`
- Story metadata and registry: `app/stories/data.ts`
- Shared article layout: `app/stories/[slug]/page.tsx`
- Article diagrams: `public/stories/twitter-analytics/`
- Fonts and metadata: `app/layout.tsx`
- Styling: `app/globals.css`

To add a story, create a Markdown file in `content/stories`, import it with `?raw` in `app/stories/data.ts`, and add its metadata to the registry. Add a project entry in `app/projects.ts` with `story: '/stories/your-slug/'`. Omit `source` and `documentation` when code is private. The story gets its own page at build time and appears in the homepage's Project stories section.

The article renderer supports paragraphs, a `#` title, `##` section headings, inline backticks, emphasis, bold text, and PNG diagrams at `/stories/your-slug/file.png`. Put an italic caption immediately after a diagram. Raw HTML and scripts are rendered as text, never executed. This deliberately small format does not support general Markdown tables, lists, or embedded HTML.

Workbench uses Base UI's tabs root directly to preserve vertical keyboard navigation. The former `/versions/workbench/` address uses a static HTML redirect to the homepage.

## Validation and hosting

The static build checks page, image, script, stylesheet, and font references. Both root and `/portfolio` exports have been checked. Blog navigation and the article’s layout have also been checked in the local browser. `npx tsc --noEmit --incremental false` checks types.

The existing Sites preview remains a separate private publication. The GitHub Pages workflow does not use Sites credentials or require a Cloudflare account. `.openai/hosting.json` is only used for that private preview. You will publish publicly when you enable Pages and run the workflow in your GitHub repository.

Before using the portfolio in applications, confirm the display name and add your preferred contact details, resume, and work history. The project claims come from public repositories and the supplied project story; unprovided credentials and employment details are not invented.
