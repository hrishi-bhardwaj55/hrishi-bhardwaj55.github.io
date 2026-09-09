# Hrishi Bhardwaj — portfolio

A minimal dark portfolio built with React, TypeScript, Vinext, and CSS. Includes reduced-motion-aware viewport reveals and subtle interaction animations. Content is grounded in the connected GitHub account's public repositories.

## Develop

Install dependencies with `npm ci`, then run `npm run dev`. `npm run build` produces the Cloudflare-compatible site. `npx tsc --noEmit` checks types.

## Update content

- Main portfolio and project stories: `app/page.tsx`
- Metadata and fonts: `app/layout.tsx`
- Design and responsive styling: `app/globals.css`
- Motion enhancement: `app/motion.tsx`
- SQL interaction: `app/counterexample.tsx`
- Pure SQL-semantics illustration: `lib/sql-counterexample.ts`
- Reference comparison and content provenance: `docs/design-research.md`

The SQL demo models NOT IN / NOT EXISTS for non-null numeric outer IDs and nullable numeric exclusion values. It preserves outer duplicates. It is an educational browser simulation, not a SQL interpreter, database connection, or the full Skeptic verifier.

## Before using for applications

Confirm the display name and provide the resume, preferred contact email, LinkedIn, and target roles. Work history and credentials were intentionally omitted because none were supplied. Current project descriptions and links use public GitHub evidence. Deployment starts private; change visibility when the content is ready for recruiters.

## Validation

Production build and TypeScript checks passed. The demo's ordinary values, NULL behavior, duplicate preservation, and empty inputs were checked using Node assertions. The local route returned HTTP 200. Browser visual/interaction QA was not performed. WebMCP is omitted because the portfolio's primary journey is reading and navigation; the demonstration is supplementary.


## Multiple directions

Open `/versions` to compare five complete alternatives: `/versions/kinetic`, `/versions/professional`, `/versions/arcade`, `/versions/editorial`, and `/versions/workbench`. Each has a route-specific title and a shared version switcher. The original portfolio stays at `/`.

Shared factual content lives in `app/versions/data.ts`. The Arcade mission engine is isolated from its interface and checks answers without giving duplicate completion credit. Progress is temporary React state and resets when the page reloads. Workbench uses the installed Base UI tabs root directly to preserve vertical keyboard behavior, composed with the existing tab wrappers. Kinetic suspends its canvas when paused, offscreen, the document is hidden, or reduced motion is requested.
