# The eParts Agent Harness

How a five-person capstone team built its own software engineering system, automated it past the point of safety, and put the humans back in the two places that mattered.

*Subject: the team’s internal engineering system, not the client product. Verified against the working tree on 2026-09-09 — every count, exit code and rule ID below was read out of the repository or produced by running it.*

## The problem underneath the project
Two systems, one repository

Almost every conversation about this repository starts by confusing two different things, so it is worth separating them in the first paragraph.

**The client product** is an Intelligent Product Data Ingestion and Enrichment Platform for eParts Services LLC in Homestead, Pennsylvania. eParts sells eCommerce procurement tooling to construction contractors, and their system of record is PIMS — a product information management database with 78 active categories, 755 product types, and roughly 50,000 rows of product attribute values keyed against a master list of 487 active attributes. Supplier catalogs arrive as PDFs, CSVs, SFTP drops and email attachments, and today about 1.5 full-time staff at eParts plus 3 at sister company Alps Controls read those catalogs by hand and map every supplier attribute onto a PIMS attribute. The product being built is a pipe-and-filter pipeline — ingestion, normalization, ML attribute prediction, confidence-based routing, human review queue, idempotent writeback — that does the mapping and escalates only what it is unsure about.

**The engineering system** is what lives in this repository. It is the machinery the *team* runs to execute that project: 31 agents that read meeting transcripts, extract requirements, draft architecture decision records, detect drift, track commitments made to coaches, triage defects, and open pull requests full of generated artifacts for humans to approve or reject.

The distinction matters because the failure modes are completely different. The product can be wrong about a voltage rating. The engineering system can be wrong about *what the team agreed to* — and it will be wrong confidently, in prose, in a document that looks exactly like a document a person wrote.

> The design decision worth stealing is that the orchestration contract is separated from what the agents say. *Which* agents fire, in what order, and what happens on an unrecognised trigger are all verifiable without a single model call.

That sentence is the whole architecture in one line, and everything below is an unpacking of it. Twenty scenarios exercise that contract offline in about a second, on a machine with no API key and no network access. Most agent systems can only be tested by running them, which means every test costs tokens, takes seconds to minutes, and returns a different answer tomorrow. Here the routing layer is a pure function of the trigger, so it is testable the way ordinary software is testable.

## The assignment that forced first principles
AASE / LASE — a meta-model, not a methodology

The team did not set out to build an agent framework. They were handed a premise from CMU’s Software and Societal Systems department, presented at Studio orientation under the name **AASE/LASE** — AI-Aided or LLM-Aided Software Engineering, a deliberate riff on the old CASE acronym.

The premise has one load-bearing assumption: *authoring software is now inexpensive.* Every established SDLC pattern — Scrum, RUP, all of them — was designed around the opposite assumption, that writing code is the most labor-intensive part of development. Story points, velocity, sprint length, burndown charts: all of that exists because code used to be slow to produce. If generation collapses to seconds, those instruments stop measuring anything real. Worse, the assumption change moves the cost somewhere else: generation is cheap, but as the orientation deck puts it, *the intellectual losses are high* — the outsourcing of domain, system and requirements expertise.

So the instruction was not “use Scrum with AI.” It was: go back to first principles and build a bespoke lifecycle out of four elements.

:::diagram eparts-metamodel

That four-element meta-model is why the repository looks the way it does. Every agent has an entry in an ETVX manifest — Entry criteria, Task definition, Verification checks, eXit criteria — and every process carries a `resource_type` of `auton`, `assist` or `human`. The manifest is not documentation written after the fact; `pipeline/etvx.py` loads it and `validate_coverage()` checks that every agent the orchestrator registers has a process definition. There are currently 31 registered agents and 31 documented processes.

The team also wrote down the SDLC pattern they were converging on, as a standalone document: **Agentic-Augmented Scrum**. It keeps Scrum’s predictability machinery and rewires every metric. The unit of work becomes a *Spec Card* — intent, executable acceptance criteria, the spec the agent works from, a risk tier, and a *validation budget*. Estimation is in **Validation Hours**, the human-attention cost of specifying, reviewing and unblocking, not the agent’s generation time. The cadence is a three-day tick rather than a two-week sprint, giving roughly 80 planning cycles a year instead of 26. And velocity is replaced by five metrics, of which the two most interesting are *Handoff Time* (how long an agent sits stuck before a human resumes it) and *Rework Rate* (merged PRs needing follow-up fixes within seven days) — the leading indicator of AI-induced debt.

## The harness
Router, queue, registry, pipeline executor

The harness is four small modules under `orchestrator/` plus one under `pipeline/`, and its most important property is what it deliberately refuses to do. `orchestrator/main.py` is a FastAPI app with eighteen endpoints, and its docstring states the constraint outright: *pure routing and queue management, does NOT make LLM calls.*

Here is the seam that makes the whole system testable.

:::diagram eparts-harness-seam

### The router is a dictionary

This is the part people find anticlimactic and it is the reason the system can be tested at all. `orchestrator/router.py` is a module-level dict mapping eleven trigger types to ordered lists of agent names, plus one eight-line function:

```orchestrator/router.py | excerpt
TRIGGER_ROUTES: dict[str, list[str]] = {
    "transcript": [
        "transcript_parser",
        "priority_classifier",
        "req_extractor",
        "drift_detector",
        "decision_logger",
    ],
    ...
    "manual": [],  # manual triggers specify the agent directly
}

def resolve_agents(trigger_type, agent_override=None):
    if agent_override:
        return [agent_override]
    agents = TRIGGER_ROUTES.get(trigger_type, [])
    if not agents:
        return []
    return list(agents)
```

**Two guardrails hide in those eighteen lines.** An `agent_override` returns exactly one agent — a manual trigger never drags its pipeline along with it. And an unrecognised trigger returns an empty list rather than guessing a plausible pipeline. Both behaviours have named eval scenarios, because both are the kind of thing a well-meaning refactor quietly breaks.

### The queue is deliberately single-threaded

`orchestrator/queue.py` runs one agent at a time in a background daemon thread. The docstring gives the reason plainly: agents commit to git, update Jira and write to SQLite, and concurrency on any of those produces races. The FastAPI event loop is never blocked, but the agents themselves are serialised. For a five-person team whose pipelines complete in well under a second of orchestration overhead, parallelism would buy nothing and cost correctness.

### The registry is where the diagram becomes executable

`orchestrator/registry.py` instantiates all seven MCP clients once, hands each agent only the clients it needs, and wraps each agent in a closure that converts an `AgentTask` payload into an `AgentTrigger`, calls `execute()`, and returns a plain dict. Separating instantiation from routing is what makes the orchestrator mockable: swap any agent by replacing one registry entry.

It also creates the failure mode that motivated the custom linter. An agent class that is never wired into the registry is dead code — the queue has no handler for it, so it simply never fires, and *no error is ever raised*. That is worth reading twice. In a conventional codebase, unused code is harmless. In an orchestrated agent system, an unregistered agent is a silently missing capability.

### Pipelines thread context between steps

Above the router sits `pipeline/pipelines.py`, which defines seven named pipelines as ordered `PipelineStep` lists. Each step declares which context keys it reads, which key it writes, whether it is `required`, and a `skip_if_empty` condition. A `PipelineContext` accumulates data, artifacts and per-step results as it flows through, and the executor records both per-step and end-to-end metrics.

The decomposition is a deliberate rejection of the mega-prompt. The team’s own rationale document is direct about it: one prompt that parses a transcript *and* classifies priorities *and* extracts requirements *and* checks for drift would be fragile, untestable and expensive. Seven small prompts are each independently versionable and replaceable — when the priority classifier is wrong you fix one prompt, not a two-thousand-token monster.

## The agents
31 modules · 8 domains · one base class

Every agent is a class under `agents/` that subclasses `BaseAgent` and implements exactly one abstract method: `run(trigger) -> AgentResult`. Everything else it gets for free, and the list of what “free” covers is the real design of the system.

:::diagram eparts-base-agent

Two details in that list are choices, not conveniences.

The first is that **metering is unconditional and unbreakable**. Every metrics write in `base.py` sits inside a bare `try/except Exception: pass`, with a comment saying why: *metrics should never break agent execution.* You get the measurement layer the meta-model demands without the measurement layer becoming a new source of outages.

The second is **temperature zero as a team convention, not a default**. The reasoning is in `docs/prompt_management.md` and it is about reproducibility between people rather than model quality: for parsing, classification and extraction, a non-zero temperature means two teammates get different requirements out of the same transcript. As the document puts it — that is not engineering, that is gambling.

:::diagram eparts-roster

### Offline-first, and the one agent that refuses to be

Nine agents branch on `self._settings.has_llm`. With no API key configured, `transcript_parser` falls through to `pipeline/vtt_processor.py` and derives speaker statistics, topics, questions, decisions and action items structurally. `priority_classifier` falls back to keyword sets — `deadline`, `demo`, `block`, `urgent`, `client` map to P0. Every agent stamps its output with the mode it ran in, so `[offline (structural)]` appears in the artifact description and nobody mistakes a regex result for a model result.

The interesting exception is `plan_generator`, the agent that turns a spec into a reviewable implementation plan before any code is written. Its docstring states the refusal explicitly:

> Planning is the one step we do not want a keyword fallback for, so with no API key configured the agent fails loudly with a review item rather than emitting a plausible-looking plan.

It runs in two phases. **GRILL** asks every question it needs answered up front; if any question is *blocking* — if a wrong guess would change which files change, the class breakdown, or the test set — it returns the questions and produces no plan at all. `MAX_BLOCKING_QUESTIONS = 0`. Only with the ambiguity cleared does **PLAN** run, producing a markdown artifact with files to change, class breakdown, required tests and what each proves, sequencing, out-of-scope, risks, and explicit stop conditions for whichever agent implements it. The artifact is stamped `awaiting review` with a line that reads: *no code may start until accepted.*

That is the clearest expression of the system’s theory of value. The plan, not the code, is the reviewable unit — because rejecting a file set costs minutes and rejecting an implementation costs days.

## The substrate, and why the loop stops
Wiki, event bus, registry, vector store — all SQLite

The first question anyone asks about an event-driven agent system is whether it can run away. It cannot, and the reason is structural rather than defensive.

**SharedMemory** is a SQLite-backed namespaced key-value store, explicitly modelled on the wiki pattern: rather than each agent producing an isolated output, every agent enriches one structured store. Nine namespaces — requirements, architecture, decisions, risks, commitments, concerns, ml_decisions, meetings, metrics. Every entry records its source agent and pipeline, and every write is appended to a change log. The team’s test for whether this earns its keep is a good one: *if we deleted the system and went back to manual, what would we lose?* The honest answer is the accumulated wiki, the embedded coach sessions, and the auto-populated risk register — three things nobody rebuilds by hand.

**EventBus** is the decoupling layer, also SQLite-backed so the event log is an audit trail rather than a transient bus. Agents publish typed events; pipelines subscribe. If `transcript_parser` called `drift_detector` directly, the two would be coupled and every new consumer would mean editing an existing agent. Instead the parser announces `new_requirements` and stops caring.

:::diagram eparts-events

Read that table as a directed graph and the termination argument is immediate: **events flow downstream only.** Transcript feeds requirements feeds architecture, and nothing routes back to transcript. Coach session feeds concerns feeds PM alerts, and nothing routes back to the session. Cross-pipeline events are one-shot — they do not re-fire their source. When no new events are generated, the cycle ends. There is no cycle detector because there is no cycle.

### Prompt governance by content hash

Prompts are treated as versioned artifacts, and the mechanism is stricter than it first sounds. Every file in `prompts/` has a SHA-256 content hash. When an agent runs, the `PromptRegistry` computes the hash of what is on disk and compares it to the pinned *active* version. A new hash — meaning someone edited the file — is registered as `pending_review`, and **the agent keeps using the old pinned version until a reviewer approves the new one.** Editing a prompt does not change behaviour; approving a prompt does. Per-version the registry also tracks run count, average tokens, average quality score and correction rate, which is how the team answers whether a new prompt version actually improved anything or merely cost more.

Retrieval runs on ChromaDB with local ONNX MiniLM embeddings — 384 dimensions, no API dependency, no per-token cost, works offline. The rationale document is refreshingly unromantic about it: embedding is a commodity, and the alternative buys negligible quality at this scale while adding a network dependency to a system that is otherwise runnable on a laptop with no keys.

## The error that compounds
The failure the author caused, and the correction

Everything so far describes a system working. This section describes it failing, because the failure is the reason the rest of the design looks the way it does — and because the person who built it names it as a mistake he made rather than a limitation he inherited.

Start with what the system is allowed to know. The source material is narrow on purpose: **meeting transcripts, plus a retrieval index over the project’s own documents.** That is the entire input surface. Everything an agent asserts traces back to something a person said in a meeting or something the team had already written down. No web access, no general knowledge injected at the edges, no invented context.

That narrowness is a strength right up until you notice the second property: **the agents are chained.** One agent’s output is the next agent’s input. The transcript parser’s structured minutes feed the priority classifier; the classifier’s output feeds the requirements extractor; the extracted requirements feed the drift detector, which compares them against the canonical architecture. Seven steps in the requirements pipeline, each building on the last.

So if step two is slightly wrong — if it drifts a little from what was actually said — steps three through seven inherit that and build on it. The error does not stay where it started. It compounds, and it compounds with exactly the efficiency that made the automation worth building.

> I automated it too well. Transcript in one end, artifacts out the other, built so cleanly that there was nowhere for a person to get in. Which sounds like success until you notice the agents are chained.

### Why this is harder than an ordinary bug

An ordinary bug announces itself. It raises an exception, returns malformed output, turns a build red. This one does none of that.

These agents fail *with enormous confidence*. What you get back is a well-structured, fluently written, entirely plausible architecture decision record documenting a decision the team never made. Nothing about it looks wrong. There is no field that failed validation, no log line at `ERROR`, no tell of any kind. The only way to know it is wrong is to open the source transcript and check it line by line — which is precisely the work the system existed to save.

And a few artifacts downstream, you lose even the ability to localise it. You have a pile of documents that are subtly not true, and no way to say which of six stages went off.

### What it actually looked like

This is not hypothetical, and the repository does not hide it. On **27 April 2026** the requirements extractor ran over a client meeting and committed four requirements straight to the branch. Here is that morning’s git log, in commit order:

```git log --reverse — 2026-04-27 | the incident
10:08  [agent:req_extractor] Add requirement REQ-001: Yeah, starting. So… I think… So the…
10:08  [agent:req_extractor] Add requirement REQ-002: I'm a bit confused. Take care. I thi…
10:08  [agent:req_extractor] Add requirement REQ-003: I think I'll be traveling the end of…
10:08  [agent:req_extractor] Add requirement REQ-004: But he did tumble, right? So… Yeah.…
12:02  Remove outdated REQ-001.md
12:02  Remove outdated REQ-002.md
12:02  Remove outdated REQ-003.md
12:02  Remove outdated REQ-004.md
12:04  [agent:req_extractor] Add CONSTRAINT REQ-010: Training data requirements
12:05  [agent:req_extractor] Add FUNCTIONAL REQ-001: Automated product attribute extraction
12:05  [agent:req_extractor] Add CONSTRAINT REQ-005: Azure cloud deployment
12:05  [agent:req_extractor] Add NON_FUNCTIONAL REQ-007: Pipeline performance monitoring
       [5 more at 12:05, then 3 more on 29 April]
```

**Caught within two hours.** Conversational filler — hesitation, a comment about travel, someone noting an echo on the call — promoted to requirement titles and committed as project artifacts, because nothing between the parser and the repository asked a person whether these were requirements. The second pass produced nine typed requirements within minutes, and the last three followed two days later: the real set of twelve, each carrying a type. Note what was *not* caught automatically: nothing failed, nothing errored. A human read four commit titles and recognised nonsense.

Four bad artifacts is a cheap lesson. The reason it stayed cheap is that they landed at the *front* of the chain, where they were still legible as garbage. Had the same drift occurred at step four — subtle rather than absurd — it would have propagated into ADRs and traceability links and been indistinguishable from real work.

### The correction: checkpoints, not universal review

The obvious response is to review everything. That is the same trap as testing every agent on every push: a review burden nobody sustains is a review burden nobody performs, and you end up with the appearance of oversight instead of oversight.

So the correction was selective. Pick the points in each pipeline where an error would do the **most damage downstream** — where the blast radius is largest — and make those the checkpoints. The human is not checking everything. They are checking the places where being wrong is most expensive.

Three mechanisms implement that, and they operate at different layers:

:::diagram eparts-checkpoints

What changed most is not the error rate — it is the **diagnosability** of the errors that get through. Before, a wrong final artifact told you nothing about which of six stages produced the drift; you could only throw it away and re-run the whole pipeline. After, each checkpoint leaves a verified output behind, so a wrong result can be walked backwards to the exact step where it went off. Fix it there, and re-run the remainder rather than starting over.

That is the same property a staged build gives you, and it is worth naming plainly: *the value of a checkpoint is not only that it catches things. It is that it makes what it missed findable.*

### The lesson, stated as the mistake it was

> I had been optimising the wrong thing. I was measuring how much of the process I could automate, and the right question was where a human decision has the most leverage. Automation compounds — and it compounds errors exactly as efficiently as it compounds work.

Read that alongside the routing work in the next section and the two are the same instinct applied twice. Both start by refusing the obvious move — review everything, test everything — and both replace it with a question about *placement*: where is the cheapest point at which this failure becomes visible? For orchestration the answer was a decision table that costs nothing to verify. For artifact quality it was a handful of checkpoints chosen by blast radius. Neither is comprehensive. Both are sustainable, which is the only property that matters in a control that has to run every day.

## The guardrails
Five layers, ordered by what they cost to run

This is the part of the system that changed most, and it changed because of one conversation. On **24 July 2026** the team sat down with Cory Gwin, a senior engineer on GitHub Copilot, for an AI-tools coaching session. Three things he said are now load-bearing in the repository, and the quality-gates workflow header quotes him directly.

The first was a pushback. The team had been treating types, linters, coverage and security scanning as table stakes — the boring baseline before the interesting AI work. His framing inverted that: *a great deal of quality assurance is deterministic and consumes no tokens.* Deterministic checks are the first line of defence and should be leaned into hard, precisely because they run continuously at zero marginal cost. Only genuinely non-deterministic behaviour needs a model in the loop.

That reordering is why the guardrails are best read as a ladder, cheapest first.

:::diagram eparts-guardrail-ladder

### L1 — four rules a general-purpose linter cannot see

The linter’s docstring is the best short argument in the repository for writing your own tooling. Its premise: every capability here is a class the orchestrator discovers *by convention, not by compiler-checked interface*, and nothing otherwise stops an agent from being written so that it silently never runs.

- **SES001** — every module under `agents/` defines a `BaseAgent` subclass. Forget it and the agent loses metrics, the audit trail, retry, and the human-review gate, and the registry cannot wrap it as a handler.
- **SES002** — the module docstring declares both `Triggered by:` and `Outputs:`. Those headers are the source the architecture docs and artifact catalogue are generated from; 31 agents maintained by five people drift the moment that is unenforced.
- **SES003** — every `BaseAgent` subclass is both imported and instantiated in `orchestrator/registry.py`. This catches the silent-dead-agent failure directly.
- **SES004** — every literal prompt filename passed to `load_prompt()` or `call_claude()` resolves to a real file. Otherwise `FileNotFoundError` surfaces only on the code path that uses it — in production, long after the PR merged.

There is a fifth rule, and it is *advisory on purpose*. **SES005** flags any `commit_file()` call from an agent with no explicit `branch=` argument, because both the Bitbucket and GitHub MCP wrappers default to `branch="main"` — meaning such a call writes straight to the protected branch with no PR and no human approval. Nine call sites do this today, deliberately, for append-only record keeping. So the rule warns rather than blocks, and `docs/ses_product_repo_integration.md` makes fixing all nine a precondition for ever granting the harness write access to the client’s product repository. That is a guardrail with a documented upgrade path rather than a rule nobody can satisfy.

```python tools/lint_ses.py | exit 0
advisory: agents/architecture/drift_detector.py:65: SES005 commit_file() has no
          explicit branch=; it defaults to 'main', so this writes to the
          protected branch with no PR and no human approval gate
advisory: agents/architecture/traceability_builder.py:43: SES005 ...
advisory: agents/coding/test_generator.py:45: SES005 ...
          [6 more]

lint_ses: 84 file(s) checked, 0 blocking, 9 advisory
```

**Run on 2026-09-09 against the current tree.** Zero blocking violations; nine known advisory findings, each naming the exact risk it represents rather than a rule number. Under `--strict` the same nine become blocking — the CI job runs both, with the strict pass marked `continue-on-error` so the ratchet is visible without being a permanently red gate.

### L2 — evals as regression detection, not scoring

The second thing from the coaching session was the eval practice, and it was the strongest recommendation of the day. The framing that stuck was not about measuring quality:

> For a given skill, define scenarios and validate that the agent calls the correct tools and skills under each. Agents are non-deterministic, so evals establish whether behaviour holds under known conditions. The key benefit is regression detection — knowing whether an agent has lost an ability it previously had.

What makes the team’s write-up of this credible is `docs/evals.md` §2, headed *“What existed before, honestly.”* They already had `agents/knowledge/prompt_regression.py`, with golden cases, a scoring function, baselines and a rule to block a PR on a 10% quality drop. But it never called a model — it scored the golden *input* against the expected structure as a proxy, and no baseline file had ever been written. Their own summary: *we had the machinery and not the practice.*

The harness that replaced it has three properties worth copying. Scenarios are declarative JSON with a stable `id`, so renaming an ID reads as “old capability gone, new capability added” and must be done deliberately. A `critical` flag fails the run outright regardless of aggregate score, and the report names the missing ability rather than printing a lower number. And a run that loads zero suites is *exit code 2*, not a pass — the schema module’s comment says it plainly: an eval run that silently evaluates nothing is worse than a failure, because it reports success.

The scenario set is chosen to include cases that *can* fail. That is the difference between a benchmark and a decoration:

- `transcript.parse_before_extract` — marked critical, and it is an ordering constraint rather than a preference. An extractor reading an unparsed transcript produces confident nonsense.
- `unknown_trigger.degrades_quietly` — an unrecognised trigger must dispatch *nothing*, not guess a plausible pipeline.
- `manual.override_isolates_single_agent` — a manual override runs exactly one agent and does not drag its pipeline along.
- `single_artifact_correction_is_not_a_bug` — a negative case in the triage suite. A benchmark containing only things that *should* happen cannot catch over-triggering.
- `pr_event.review_and_regression_capability` — critical, because losing `prompt_regression` from the PR route would silently disable the team’s only automated guard against prompt quality decay.

That last one is the scenario they used to prove the harness works. They removed `prompt_regression` from the `pr_event` route on purpose, and the run reported `FAIL [CRITICAL] pr_event.review_and_regression_capability — lost capability: missing ['prompt_regression']` and exited 1. Restoring the route returned the run to 20 of 20.

```PYTHONPATH=. python -m evals.runner | exit 0
# Agent Eval Report

Tier: offline only (no model calls)
Scenarios: 20 — 20 passed, 0 failed, 0 skipped

## orchestrator_routing (mean score 1.000)
- **PASS** `transcript.full_contract` — 1 check(s) passed
    (dispatched=['transcript_parser', 'priority_classifier',
     'req_extractor', 'drift_detector', 'decision_logger'])
- **PASS** [CRITICAL] `transcript.parse_before_extract` — 1 check(s) passed
- **PASS** [CRITICAL] `coach_transcript.memory_capability` — 2 check(s) passed
- **PASS** [CRITICAL] `pr_event.review_and_regression_capability` — 1 check(s) passed
- **PASS** [CRITICAL] `manual.override_isolates_single_agent` — 2 check(s) passed
    (dispatched=['req_extractor'])
- **PASS** [CRITICAL] `unknown_trigger.degrades_quietly` — 1 check(s) passed
    (dispatched=[])
  [8 more]

## defect_triage_skill (mean score 1.000)
- **PASS** [CRITICAL] `red_ci_on_main` — [contract-only, no model] 5 check(s) passed
- **PASS** [CRITICAL] `single_artifact_correction_is_not_a_bug` — 1 check(s) passed
  [4 more]

All evaluated scenarios passed.
```

**Run on 2026-09-09, no API key present.** Note the `[contract-only, no model]` stamp on the triage suite: offline, that suite verifies its own contract — every expected label exists in the controlled vocabulary, every named tool exists in the declared tool surface — and says so in the report rather than passing as though it had tested behaviour. An expectation naming a label the skill can never emit is a broken eval that would otherwise sit green forever.

### L3 and L4 — where the human actually sits

Ten call sites across six agents set `requires_human_review=True`, and the pattern in each is the same: the agent produces the artifact, attaches a structured `review_items` list describing what needs a decision, and hands it on. `priority_classifier` sets it for every P0 item with the message `P0 ticket needs approval`. `adr_generator` sets it for every ADR without exception. `plan_generator` sets it in five distinct places, including — notably — when it *cannot* produce a plan, so an unanswerable spec surfaces as a review item rather than a silent no-op.

The skill layer applies the same discipline at the interface. `skills/defect-triage/SKILL.md` drafts a fully classified Jira Bug from a pasted CI log, then stops: *never create the ticket without explicit confirmation.* It is allowed at most two clarifying questions before proceeding under stated assumptions, it must not invent label values outside the declared vocabularies, and it carries one rule that reveals real thought about authority — *if the caller disputes the drafted severity, take theirs; record, don’t argue.*

Layer 4 is the structural version of the same idea, and it fixed a specific operational problem. The pipeline used to run on one laptop, manually. Now anyone drops a Zoom `*.transcript.vtt` into `transcripts/inbox/` — via git push or the GitHub web upload button — and `pipeline/process_inbox.py` canonicalises the filename, runs ingestion, moves the transcript, rebuilds the cross-meeting analysis, and writes a run summary. GitHub Actions then opens a pull request. The module docstring states the invariant: *the PR review IS the human gate; generated minutes are drafts until a person approves the merge.*

The requirements-extraction workflow goes further and is `workflow_dispatch`-only — manual trigger, never on push — because it spends real tokens driving `transcript_parser` → `req_extractor` → `adr_generator` over meeting data. Its header calls this out as a deliberate, reviewed run rather than something that should fire automatically.

### L5 — the layers that cost something

The `--live` eval tier runs the skill against a real model and scores its actual tool ordering and label choices against the declared expectations. It is opt-in via `workflow_dispatch` for the obvious reason.

The defect loop is the classification scheme in `docs/defect_management.md`: every defect is a Jira Bug classified on four axes — severity, stage found, root cause, found by — using label vocabularies rather than custom fields, with the explicit constraint that every metric must be derivable from a JQL query so the numbers have provenance. The taxonomy contains one genuinely new class. `rc-prompt` covers the case the IEEE-1044-style taxonomies have no room for: *the code was fine, the model was fine — the prompt or context produced the wrong artifact.* Tracking it separately is how the team learns whether its prompt regression suite is earning its keep.

And the third thing from the coaching session became the `qa/` directory. Because code is now cheap to produce, it is practical to build small purpose-built interfaces solely for QA — tools that let a human drive one module in isolation and confirm it behaves as expected, rather than only reading code or trusting a green suite. Cory was specific that this means user interfaces, not more agents. `qa/vtt_qa_server.py` is the result: standard library only, no network, no API key, read-only, serving a local page that lets you feed a VTT through `parse_vtt()` and look at what came out. The directory’s README opens by calling these *throwaway* interfaces — not part of the product, imported by nothing, safe to delete.

## How it was actually built
Five months, 95 commits, one turning point

The git history is unusually legible about process, partly because the agents commit under their own prefix — `[agent:req_extractor]`, `[agent:system]` — so you can see exactly where the machine started producing artifacts and where humans took them back.

The build began with a specification, not with code. `CURSOR_PROMPT.md` is 32 kilobytes of context written to be fed to a coding agent *before any code existed*: the team, the client, the product architecture, the POC numbers, the tech stack, the conventions. Spec-first, on the same theory the planning agent later encodes formally — that the expensive mistakes are made upstream of implementation.

:::diagram eparts-build-timeline

That last commit message is the whole arc in eight words. The README used to open with counts — 31 agents, 7 pipelines, 7 MCP servers. It now opens with the twenty scenarios and the one-second run time, because a count of agents is a claim about size and a passing contract suite is a claim about correctness.

## What it does not do
Stated by the team, verified by running it

The most persuasive thing in this repository is a section heading in the README: **“The honest limitation.”** It is worth reproducing the substance because it is the part most such write-ups omit.

### Known gaps, unretouched

- **The eval suite is a regression guard, not a benchmark.** All 20 scenarios pass. That tells you the orchestration contract has not drifted; it tells you nothing about whether any agent’s output is good. Scoring the *content* an agent produces, rather than the routing around it, is the obvious next thing and is not done here.
- **The live eval tier has never run.** There was no API key in the environment where it was written. The function that implements it carries a note saying so, and instructing the reader to treat its first CI run as its validation and not to present it as a demonstrated result before then.
- **Nine agents still write directly to main.** SES005 flags every one. Fixing them is a documented precondition for granting the harness write access to the client’s product repository — a gate that has not yet been passed.
- **ruff is advisory with 79 pre-existing violations.** The CI header explains the reasoning rather than hiding it: turning it blocking today would train the team to ignore a permanently red gate. The custom SES linter *is* blocking, because its rules were introduced clean.
- **The in-process executor flags; it does not pause.** Worth being exact about, because the checkpoint story invites the assumption. When a step sets `requires_human_review`, `PipelineExecutor` records it on the step, the pipeline result and the wiki tag — and continues to the next step. The only thing that halts a run mid-pipeline is a *failed* required step. The hard gate is the pull request *between* runs, plus the planning agent’s outright refusal. A genuine in-band pause-and-resume is not implemented.
- **Output quality is checked by golden files and by hand.** Two golden cases in `tests/golden/` plus humans driving single modules through the throwaway QA interfaces. That is the whole content-quality story.
- **The system runs against synthetic fixtures.** Since the September scrub, the demonstrable path is the fixtures in `examples/`. Real transcript processing requires an uncommitted identity file.

There is a structural reason this section exists rather than being edited away. The team’s own measurement critique, in `docs/evals.md`, is that *every metric we tracked was a process metric — time saved, handoff time, rework rate. None of them measured whether the output was actually any good.* Having named that gap, they could not then claim to have closed it. The eval harness narrows it to the routing layer and says so.

## What transfers
Six things that would work in any agent system

Strip away the capstone context and six ideas here are portable to any team wiring agents into real work.

### 1. Make the orchestration contract a pure function

This is the one that buys everything else. Because `resolve_agents()` is a dict lookup, twenty scenarios about dispatch membership, ordering, override isolation and quiet degradation run in under a second with no key. If routing decisions were embedded in agent prose — “decide which agents to run for this trigger” — none of those tests could exist. The generalisation: whatever part of your agent system is genuinely a decision table, implement it as a decision table.

### 2. Write a linter for your own conventions

The four properties SES001–004 enforce are invisible to ruff, mypy and every other general-purpose tool, because they are properties of *this* architecture. They took a few hundred lines of stdlib AST walking and they catch the single worst failure mode in a convention-discovered system: the capability that silently never fires. If there is a rule your team wants enforced, the cheapest enforcement is usually a linter you write yourself.

### 3. Include cases that can fail

Negative scenarios — the unknown trigger that must dispatch nothing, the correction that must *not* become a bug ticket — are what separate a benchmark from a decoration. A suite containing only things that should happen cannot detect over-triggering, which is the most common way agent systems become annoying before they become wrong.

### 4. Make the review gate structural, not procedural

“Please review agent output” is a norm, and norms erode. A CI workflow that can only open a pull request is a constraint. The `requires_human_review` flag, the `needs-human-review` label, and the planning agent’s *no code may start until accepted* header are all the same move: put the gate in the mechanism so nobody has to remember it.

### 5. Put the human where the blast radius is, not everywhere

In a chain, an error at step two is not one error — it is the input to every step after it. But reviewing every stage is a burden nobody sustains, and unsustained oversight is worse than none because it looks like coverage. The workable version is to rank stages by how much damage a wrong output does downstream and put the checkpoint at the top of that list. Two side effects are worth having on purpose: the reviewed output becomes a known-good restart point, and a wrong final artifact becomes traceable to the stage that produced it instead of being a total loss.

### 6. Fail loudly where a fallback would be worse than nothing

Offline fallbacks are right for nine agents, because a regex-derived list of action items stamped `[offline (structural)]` is honestly labelled and genuinely useful. They are wrong for the planner, because a plausible-looking implementation plan produced by keyword matching is *indistinguishable from a good one until someone builds it*. Knowing which of your capabilities degrade gracefully and which must refuse to run is a design decision, and it deserves to be made explicitly rather than inherited from whatever the base class does.

The last one is the general lesson, and it applies well beyond this repository. Cheap generation makes it easy to produce something that looks like the artifact you wanted. The engineering work has moved to knowing, mechanically and in advance, which of those artifacts you are allowed to trust.
