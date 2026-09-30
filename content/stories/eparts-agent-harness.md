# Automating the boring parts of software engineering

Our capstone ran on meetings: with the client, with our mentor, with our coaches. Each one produced decisions that somebody had to write up as requirements, check against the architecture and turn into tickets. So I built a system of agents to do that work. By the end of the project it had 31 of them.

It did the job, and that turned out to be the problem. Transcripts went in one end and committed documents came out the other, with nowhere for a person to step in. The agents were chained, so when one of them got something slightly wrong, every agent after it built on the mistake. This is how the system worked, the day it went wrong, and what I changed so the rest of it could be trusted.

## The product, and the system behind it

The client was eParts Services, which sells procurement software to construction contractors. Their product database has 487 attributes, and supplier catalogs arrive as PDFs and spreadsheets. About four and a half people's worth of staff, across eParts and a sister company, read those catalogs and map every attribute by hand. Our capstone product automates that mapping. It predicts each attribute, attaches a confidence score and sends only the uncertain ones to a person.

The agents in this post are something else: the engineering tooling the five of us used to run the project. The difference matters because they fail differently. The product can be wrong about a voltage rating. The tooling can be wrong about what the team agreed to, and it will be wrong in fluent prose that looks exactly like something a person wrote.

The course pushed us toward building it. Its premise was that code is now cheap to write, so the process built around expensive code, like story points and two-week sprints, measures the wrong thing. We were asked to design our own. The one we wrote down used three-day cycles and estimated work in hours of human review, because reviewing was now the expensive part.

## Keeping the model out of the routing

Agents fire on events: a meeting transcript uploaded, a pull request opened, a Jira ticket changed, a scheduled job. Each one does a single job. One turns a transcript into minutes, the next classifies priorities, the next extracts requirements, and another checks those against the architecture. They fall into eight groups: requirements, architecture, code review, project management, team knowledge, coach sessions, ML decisions and planning.

I split the work that finely on purpose. One large prompt that parsed, classified, extracted and checked would have been impossible to test or fix. With small agents, when the priority classifier is wrong, I change one prompt.

The decision I'm happiest with is that no model decides which agents run. The orchestrator is a small FastAPI service that only routes and queues, and the routing table is a Python dictionary:

```The routing table | excerpt
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

It looks too simple to be interesting, but it is what made the system testable. A manual run of one agent returns exactly that agent, so it never drags a pipeline along with it. An unknown trigger returns an empty list instead of guessing at one. Because the routing is ordinary code, I could test it like ordinary code, in milliseconds, with no API key and no network.

The rest of the system follows the same split between plain code and model calls.

:::diagram eparts-harness-seam

A few other choices came from the same thinking. The queue runs one agent at a time, because agents commit to git, update Jira and write to SQLite, and running them in parallel would have meant races on all three. Every agent inherits a base class that handles timing, retries with backoff, token and cost tracking and an audit log, so writing an agent means writing one `run()` method. Model calls use temperature zero, so two teammates running the same transcript get the same requirements. Agents communicate through an event bus where events only flow downstream, from transcripts to requirements to architecture, so the system can't loop.

Prompts are versioned like code. Each prompt is tracked by a hash of its contents, and an edited prompt waits for approval while agents keep using the last approved version. Editing a prompt never changes behaviour by accident.

## The day it committed small talk

On 27 April the requirements agent ran over a client meeting and committed four requirements straight to the repository. This is that morning's history, trimmed:

```git log, 27 April | the incident
10:08  Add requirement REQ-001: Yeah, starting. So… I think… So the…
10:08  Add requirement REQ-002: I'm a bit confused. Take care. I thi…
10:08  Add requirement REQ-003: I think I'll be traveling the end of…
10:08  Add requirement REQ-004: But he did tumble, right? So… Yeah.…
12:02  Remove outdated REQ-001.md
       … REQ-002 to REQ-004 removed
12:04  Add CONSTRAINT REQ-010: Training data requirements
12:05  Add FUNCTIONAL REQ-001: Automated product attribute extraction
12:05  Add CONSTRAINT REQ-005: Azure cloud deployment
       … 6 more typed requirements, then 3 on 29 April
```

Hesitation, a remark about travel plans and someone noticing an echo on the call had all become requirement titles, because nothing between the transcript and the repository asked a person. They were deleted just under two hours later and the extraction was re-run, which produced the twelve real requirements, each typed as functional, non-functional, a constraint or a goal.

Nothing failed. There was no exception and no red build. A person read four commit titles and recognised nonsense.

That was the easy version of the problem, because the damage happened at the front of the chain, where it was obviously garbage. The requirements pipeline has seven steps, each reading the previous one's output. If an early step drifts a little from what was said, every later step builds on the drift. By the end you have a well-written design record for a decision nobody made. Nothing about it looks wrong, and the only way to catch it is to reread the transcript, which is the work the system was supposed to save. You also can't tell which of the steps went off.

I had been measuring how much of the process I could automate. The better question was where a person's judgment prevents the most damage.

## Putting people back where mistakes spread

Reviewing everything wasn't the answer. A review step nobody keeps up with only looks like oversight. Instead I picked the points where a wrong output would do the most damage downstream and put a checkpoint at each.

- **A review flag.** An agent can mark its result as needing a person, with a list of what needs deciding. The priority classifier sets it on every top-priority item, and the architecture agent on every design record it drafts.
- **Pull requests as the gate.** Pipelines running in CI can't write to the main branch. They open a pull request labelled `needs-human-review`, and nothing becomes part of the project until someone merges it. The next run reads the merged state, so the chain builds on reviewed work.
- **A planner that refuses.** The planning agent turns a spec into an implementation plan before any code is written. It starts by listing the questions it needs answered, and if any answer could change which files get touched or which tests are needed, it returns the questions and no plan. It also refuses to run without an API key. Other agents drop to keyword rules and label their output as offline, but a plan built from keyword matching looks like a good plan until someone tries to build it. Every plan it does write is stamped *awaiting review, no code may start until accepted*.

The biggest gain was being able to find errors. Each checkpoint leaves reviewed output behind, so a wrong result can be traced back to the step that produced it, fixed there, and the pipeline re-run from that point instead of from scratch.

The pull request gate also fixed a practical problem. The pipeline used to run on one laptop. Now anyone on the team drops a Zoom transcript into an inbox folder in the repository, GitHub Actions runs the pipeline and opens a pull request with the minutes, and merging it is the approval.

## Testing everything that isn't the model

The second round of changes came from a coaching session in July with Cory Gwin, a senior engineer on GitHub Copilot. We had been treating linters and type checks as the boring baseline before the interesting AI work. He argued the opposite: a lot of quality assurance is deterministic and costs no tokens, so it should be the first line of defence, and only behaviour that is genuinely unpredictable needs a model in the loop. Within five days we had three things in place.

**A linter for our own conventions.** The orchestrator finds agents by convention rather than through an interface a compiler checks. If someone writes an agent and forgets to register it, the agent never runs and nothing reports an error. In most codebases unused code is harmless. Here it is a missing capability nobody notices. So I wrote a linter, about 380 lines that walk the Python syntax tree, with four rules: every agent inherits the base class, says what triggers it and what it produces, is registered with the orchestrator, and only loads prompts that exist. It checks 84 files in under a second and blocks pull requests. A fifth rule warns when an agent commits straight to the main branch. Nine still do, deliberately, for append-only records, so that rule warns instead of blocking.

**Evals that catch regressions.** Cory's advice was to define scenarios for each capability and check that the right tools get called in each, because the value is in noticing when an agent loses something it used to do. We already had a prompt regression checker, but it had never called a model or recorded a baseline. We had the machinery and not the practice.

The new harness has 20 scenarios and runs in about a second with no API key, because offline it tests the contract around the agents rather than what they write. Some scenarios describe things that must not happen: an unknown trigger dispatches nothing, and a one-off correction isn't filed as a bug. A suite of only positive cases can't catch a system that does too much. Critical scenarios fail the run outright, and a run that finds no scenarios fails too, since an eval that tests nothing and reports success is worse than none.

To check it worked, we removed the prompt regression agent from the pull request route on purpose. The run failed with `lost capability: missing ['prompt_regression']`. Putting it back returned the suite to 20 of 20.

**Throwaway interfaces for testing by hand.** Since code is cheap, it's worth building small tools just so a person can drive one module on its own. We built a local page for the transcript parser: paste a transcript, see what it extracts. It has no network access, nothing imports it, and it can be deleted at any time.

## What it still doesn't do

- The evals check routing, not quality. Twenty passing scenarios mean the orchestration hasn't drifted. They say nothing about whether an agent's requirements are any good, which is still checked with two golden examples and by people.
- The tier of evals that calls a real model has never run. It was written without an API key, so its first CI run will be its first real test.
- Nine agents still write directly to the main branch. Fixing them is the condition for ever letting the system touch the client's product code.
- A review flag doesn't pause a pipeline. It's recorded and the run carries on. The hard stops are the pull request between runs and the planner's refusal.
- Since we removed real transcripts and client material from the repository in September, it runs on synthetic examples.

## What I'd reuse

Most of this carries over to any system that wires agents into real work.

- If part of the system is a decision table, write it as one. Routing as a dictionary gave us twenty tests that run in a second.
- Write a linter for your own conventions. General-purpose tools can't see them, and a few hundred lines caught our worst failure: an agent that silently never runs.
- Test for what shouldn't happen as well as what should.
- Build review into the mechanism. A CI job that can only open a pull request can't skip it.
- Put people where mistakes spread furthest, and let the rest run.
- Decide which parts can degrade gracefully and which must refuse. A regex list of action items marked as offline is useful. A keyword-matched implementation plan is dangerous.

Producing something that looks like the document you wanted is cheap now. Most of the engineering went into knowing which of those documents to trust.
