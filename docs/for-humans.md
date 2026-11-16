# zm-pro for non-experts

> A jargon-free walkthrough of what this repository does and how it stops your AI agent from "forgetting the project". Read this first — then head back to the [README](../README.md).
> **Want the full hands-on first day?** [docs/primeiro-dia.md](primeiro-dia.md) (pt-BR) — zero to first commit.

## The problem it solves

You talk to an AI agent (OpenCode, Claude Code, Cursor…) and it:

- starts editing without reading anything,
- "fixes" the wrong file and breaks two others,
- says "done!" without running the tests,
- re-asks questions that were already settled,
- stuffs its memory with files it should never load.

zm-pro is a **code of conduct for agents**: a set of text files your agent reads before it works. It is not a program — it is instruction, copied into your project.

## Three steps

1. Copy `zm-pro/` into your project (or globally into your harness).
2. Adapt the two mandatory files (`AGENTS.md`, `RULES.md`) to what your project may never violate.
3. Ask the agent: *"Use zm-pro. Objective: X. Acceptance criteria: Y."*

## The "map" of the kit — what each file teaches

`SKILL.md` works as a **router**: the agent reads it first and loads only what the task demands — never everything at once. Each skill, in plain language:

| Guide | In one plain sentence |
|---|---|
| 01 — Code rules | How to write code that survives: smallest safe change, no shortcuts, and gates that **block** bad deliveries |
| 02 — Project standards | The skeleton every serious project has: a README that works, docs, commits, versioning, changelog |
| 03 — Layout and UI | Mobile-first screens, ≥ 44px touch targets, accessible, `R$ 1.234,56` and `dd/mm/yyyy` where relevant |
| 04 — Multi-agent | How several agents work without stepping on each other (one coordinator, one task at a time) |
| 05 — Memory | How the project "remembers": what lives in git (permanent), what lives in the session (short-term), how to keep memory clean — and the **memory models**: procedural (how we do it), semantic (what we decided), episodic (what happened) |
| 06 — Privacy and LGPD | Map personal data, legal basis, data-subject requests, incidents — engineering drafts, not legal advice |
| 07 — Security | No secrets in code, authentication, fail-closed authorization, OWASP, incidents |
| 08 — Testing and quality | The testing pyramid (many unit, few E2E), acceptance criteria, quality gates |
| 09 — Delivery with git | Honest commits, small PRs, tested rollback, fail-closed deploys |
| 10 — Operations | Logs, alerts, runbooks, tested backups, blameless post-mortems |
| 11 — Architecture | Cohesive modules, dependency direction, register decisions (ADRs) |
| 12 — Performance | Measure first: Core Web Vitals, N+1 queries, indexes, performance budgets |
| 13 — Token economy | How agents avoid blasting context and cost: read only what's needed, short outputs, subagents with narrow scopes |
| 14 — Agent operations | Least powerful tool first, confirmation before destructive actions, external content as data, stop rules |

## What lives in the other folders

- **templates/** — generic starting points: the agent protocol (`AGENTS.md`), the rules (`RULES.md`), decision records (`ADR.md`), delivery and PR checklists, and 5 ready-made prompts (implement, fix, review, release day, privacy audit).
- **examples/minimal-project/** — a complete filled example to learn the pattern.
- **scripts/** — local tools: `install.mjs` (installs the skill into your harness), `checksums.mjs` (release integrity), `validate.mjs` (checks the kit is intact).
- **.github/** — the same validator on CI (Ubuntu and Windows), plus issue and PR templates.

## What it does NOT do

- It doesn't write code for you. Your agent writes; the skill makes sure it isn't sloppy.
- It is not legal advice and not compliance. LGPD decisions belong to your DPO/counsel.
- It doesn't override your team's rules — when they exist, **the team wins**.
- It is not verified equally everywhere: OpenCode was tested end-to-end; the other harnesses are documented as unverified (see [harness-compatibility.md](harness-compatibility.md)).

## Why trust it

- Born from a commercial codebase in production; validated on a pilot (module delivered, 9/9 tests, evidence quoted).
- Open source, MIT, bilingual, zero dependencies, no telemetry, no network.
- Every delivery cites the command and its real output — or states explicitly what wasn't tested.
