# Hrishikesh Bhardwaj — Workbench portfolio

A dark portfolio with public-code projects and long-form stories for work whose source is private. Built with React, TypeScript, Vinext, and CSS; every page is exported as static HTML for GitHub Pages.

## Run locally

Install with `npm ci`, then use `npm run dev`. `npm run build` exports the site into `dist/client`. No database, API key, or server is needed to host the finished site.

## Publish on GitHub Pages

1. Push this portfolio folder to your own GitHub repository, including `.github/workflows/pages.yml` and `package-lock.json`. Do not copy the separate private project repository into it.
2. In the repository, open **Settings → Pages → Build and deployment → Source**, and choose **GitHub Actions**.
3. Publishing is automatic: every push to `main` runs the workflow, which builds the static site and deploys it. You can also publish on demand with **Run workflow** on **Publish portfolio to GitHub Pages** in the Actions tab. GitHub shows the live URL in Pages settings and in each deployment summary.

The workflow gets the URL prefix from GitHub automatically, so it works from both a profile repository such as `hrishi-bhardwaj55.github.io` and a project repository such as `portfolio`. See [GitHub's custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Custom domain

The site serves from `hrishikeshbhardwaj.com`. Two things make that work, and both must agree:

- `public/CNAME` holds the domain so it is copied into the uploaded artifact. A `CNAME` at the repository root does nothing when Pages builds from Actions, because only the artifact is published.
- `NEXT_PUBLIC_SITE_ORIGIN` in `.github/workflows/pages.yml` supplies the absolute origin for canonical links and Open Graph image URLs, which cannot be derived from a relative base path.

At the registrar the apex needs four A records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and `www` needs a CNAME to `hrishi-bhardwaj55.github.io`. Point DNS at GitHub before publishing a `CNAME`: with the file deployed and DNS still elsewhere, Pages redirects the site to a domain that does not reach it. To move to another domain, change all three together and regenerate `public/og.png`, which has the domain drawn into the image.

For a local subpath build in PowerShell, set `$env:NEXT_PUBLIC_BASE_PATH='/portfolio'`, then run `npm run build`. That output is in `dist/client/portfolio`; upload the contents of that directory because GitHub mounts it at `/portfolio` itself. Clear the environment variable before building a root-domain site. The workflow selects the correct directory automatically.

## Update projects and stories

- Project descriptions, access links, technology labels, and architecture stages: `app/projects.ts`
- Workbench interface: `app/workbench.tsx`
- Blogs tab and index: `app/blogs/page.tsx`
- Resume page, experience, education, skills, and project links: `app/resume/page.tsx`
- Original downloadable resume: `public/files/Hrishikesh_Bhardwaj_Resume.pdf`
- Shared Workbench/Blogs/Resume navigation and window frame: `app/workspace-chrome.tsx`
- Story text: `content/stories/twitter-analytics.md`
- All nine blog articles: `content/stories/*.md`
- Story titles, descriptions and source notes: `content/stories/catalog.json`
- Article imports and registry: `app/stories/data.ts`
- Responsive diagrams: `content/stories/diagrams.json` and `app/stories/story-diagram.tsx`
- Interactive ride lifecycle illustration: `app/stories/ride-lifecycle.tsx`
- Shared article layout: `app/stories/[slug]/page.tsx`
- Article diagrams: `public/stories/twitter-analytics/`
- Fonts and metadata: `app/layout.tsx`
- Styling: `app/globals.css`

To add a story, create a Markdown file in `content/stories`, add its metadata to `content/stories/catalog.json`, then import it with `?raw` and register its text in `app/stories/data.ts`. Every article gets a static page and appears in Blogs. The homepage highlights Twitter Analytics, Uber Ride Matching, and WeCloud Chat. A selected project can also link to its story through `app/projects.ts`; omit `source` and `documentation` when code is private.

The article renderer supports paragraphs, a `#` title, `##` section headings, inline backticks, emphasis, bold text, HTTPS Markdown links, and PNG diagrams at `/stories/your-slug/file.png`. Put an italic caption immediately after an image. A standalone `:::diagram diagram-id` block renders a matching definition from `diagrams.json`; supported types are flows, comparisons, and bars. Raw HTML and scripts are rendered as text, never executed. This deliberately small format does not support general Markdown tables, lists, or embedded HTML.

Workbench uses Base UI's tabs root directly to preserve vertical keyboard navigation. The former `/versions/workbench/` address uses a static HTML redirect to the homepage.

## Validation and hosting

The static build checks page, image, script, stylesheet, and font references. Both root and `/portfolio` exports have been checked. Blog navigation and the article’s layout have also been checked in the local browser. `npx tsc --noEmit --incremental false` checks types.

The existing Sites preview remains a separate private publication. The GitHub Pages workflow does not use Sites credentials or require a Cloudflare account. `.openai/hosting.json` is only used for that private preview. You will publish publicly when you enable Pages and run the workflow in your GitHub repository.

The `/resume/` page uses the supplied resume PDF and consolidated resume bank, with the latest Twitter performance corrections from the author. Its download buttons serve the uploaded PDF unchanged. Both the page and PDF are static files hosted entirely by GitHub Pages. To update the downloadable document, replace `public/files/Hrishikesh_Bhardwaj_Resume.pdf` and update the size/page-count label in `app/resume/page.tsx` if needed; edit the web resume separately.
