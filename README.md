# Hrishi Bhardwaj — Workbench portfolio

A minimal dark portfolio built with React, TypeScript, Vinext, and CSS. Workbench is the homepage: an interactive project explorer with architecture stages, technical decisions, evidence, and links to the public repositories.

## Develop

Install dependencies with `npm ci`, then run `npm run dev`. `npm run build` produces the Cloudflare-compatible site. `npx tsc --noEmit --incremental false` checks types.

## Update content

- Project descriptions and repository links: `app/projects.ts`
- Project explorer and architecture stages: `app/workbench.tsx`
- Footer and project illustrations: `app/project-visuals.tsx`
- Metadata and fonts: `app/layout.tsx`
- Responsive styling: `app/globals.css`
- Research and source provenance: `docs/design-research.md`

Workbench uses the installed Base UI tabs root directly to preserve vertical keyboard navigation, composed with the existing tab wrappers. Project and architecture selections are temporary page state. The former `/versions/workbench` address permanently redirects to `/`; the comparison gallery and other designs have been removed.

## Before using for applications

Confirm the display name and add a resume, preferred contact email, LinkedIn, and target roles. Work history and credentials were omitted because none were supplied. Project descriptions and links use public GitHub evidence. The current publication is private.
