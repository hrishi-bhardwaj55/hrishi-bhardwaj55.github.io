# Portfolio design research

Reviewed September 9, 2026. These are design references, not copied templates. Assessments below are editorial judgments based on published pages and template descriptions; no comparative performance measurements or browser visual audit were performed.

## Shortlist

| Reference | Useful principle | Decision for this portfolio |
| --- | --- | --- |
| [Brittany Chiang](https://brittanychiang.com/) | Specific experience and projects, accessible navigation, direct repository evidence | Keep information easy to scan and attach evidence to project claims; avoid copying the familiar navy layout |
| [Emil Kowalski](https://emilkowal.ski/) | Compact introduction and useful, tangible projects | Let project decisions establish credibility; avoid inflated marketing copy |
| [Lee Robinson](https://leerob.com/) | Concise personal presentation | Borrow restraint; this portfolio needs more project depth |
| [Rauno Freiberg](https://rauno.me/) | A distinctive personal engineering identity | Add one useful interactive demonstration tied to an existing project |
| [Core, Framer](https://www.framer.com/marketplace/templates/50459/) | Minimal structure, responsive sections, subtle motion | Strong general reference; omit custom cursor and unrelated sections |
| [Plain, Framer](https://www.framer.com/marketplace/templates/plain/) | Dedicated project pages, restrained hierarchy, direct links | Best structural template fit for a hiring-focused portfolio |
| [Hosier, Framer](https://www.framer.com/marketplace/templates/hosier/) | Typography and structured case studies | Borrow case-study depth; scroll masking and gooey effects add little to these projects |
| [Minimalist, Webflow](https://minimalist-templates.webflow.io/) | Monochrome treatment and typographic identity | Useful visual restraint; use concise role-led copy |
| [Portfolio Starter, Webflow](https://portfolio-starter-template.webflow.io/) | Straightforward project grid and navigation | Sound baseline, but needs bespoke technical evidence |
| [Webflow developer collection](https://webflow.com/list/developer-portfolio) | Additional options: DevFolio, Developer X, Portfolio Ace, Orting | Broad agency and ecommerce structures are unnecessary for this brief |

## Chosen direction

An original editorial portfolio: cool near-white background, dark ink, understated blue links, strong type, precise rules, and roomy project panels. One dark verification diagram gives the lead project its own visual identity. No stock illustration, invented testimonials, skill percentages, unverified business outcomes, or excessive animation.

The first screen identifies the engineer and reaches the selected work quickly. A recruiter can scan three projects; an engineer can open the decisions, architecture, limitations, and source links. Keyboard focus, native links, mobile stacking, readable text, and reduced-motion support are built in.

## Content curation

1. **Skeptic**: strongest correctness story. The README and pipeline implementation confirm that benchmarking is gated on VERIFIED candidates. Evaluations are local and authored; do not present them as general model accuracy.
2. **ServicerSwitch**: broadest engineering architecture. Java owns deterministic arithmetic, Python owns extraction and orchestration, and the registry binds eight tools to an audit. Synthetic evaluation figures require their scope and model-version caveats.
3. **Cortex (ZapN)**: shows interactive product work with deterministic engines, seed/config replay, and per-round telemetry.
4. **GetMeAJob**: secondary automation project. Include as additional work, without claiming adoption or operational success.

LowLevelDesign explicitly includes incomplete exercises. KeyBoardgame is a small early CLI project. Neither should displace stronger featured work. The OpenTelemetry fork alone does not establish an upstream contribution.

## Supporting implementation inspected

- https://github.com/hrishi-bhardwaj55/skeptic/blob/main/README.md
- https://github.com/hrishi-bhardwaj55/skeptic/blob/main/planproof/pipeline.py
- https://github.com/hrishi-bhardwaj55/ServiceSwitcher/blob/master/README.md
- https://github.com/hrishi-bhardwaj55/ServiceSwitcher/blob/master/apps/ai/app/tools/registry.py
- https://github.com/hrishi-bhardwaj55/ZapN/blob/master/README.md
- https://github.com/hrishi-bhardwaj55/ZapN/blob/master/docs/architecture.md
- https://github.com/hrishi-bhardwaj55/GetMeAJob/blob/master/README.md

## Content still requiring the owner

GitHub connection identifies hrishi-bhardwaj55. Display name Hrishi Bhardwaj is inferred from that handle and should be confirmed. No resume, work history, education, email, LinkedIn URL, or target role was provided at research time. Do not fabricate these. The site can showcase verified public projects meanwhile.

## Dark refinement

The owner requested a minimal black background and subtle motion. The active design now uses near-black (#090a0b), slightly raised charcoal panels, soft off-white type, and restrained diagram accents. Text-led technology lists replace outlined tags. Browser chrome and the initial HTML background also use the dark theme.

Motion uses a brief staggered hero entrance, one-time viewport reveals, subtle diagram hover responses, and a single verification-line sweep on interaction. Content remains visible without JavaScript. Reduced-motion preferences disable CSS and JavaScript motion, including preference changes during a session. The mobile Explore my work link has an explicit accessible name; SQL panels stack on very narrow screens.

Key text/background pairs passed calculated 4.5:1 contrast checks. Production build, type checking, and a local HTTP response were checked. No browser visual or interaction QA was requested or performed.
