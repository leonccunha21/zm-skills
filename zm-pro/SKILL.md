---
name: zm-pro
description: Complete playbook for professional software projects. Use when a task involves (1) kicking off or setting up a new project, (2) implementing a feature or bugfix, (3) reviewing, auditing or hardening quality or security, (4) delivering — commit, PR, release, deploy or post-incident work, (5) personal data — privacy/LGPD review, or (6) deciding architecture, conventions or layout. Loads only the references the track needs.
---

# zm-pro — the professional project playbook

**zm-pro v0.7.0** — the router; from here, load only what the task needs.

This file is the **router**. Read it fully, identify the track of the task, then load only the references in `reference/` you actually need. Copyable templates live in `templates/`.

**Rule zero:** when the project has its own `AGENTS.md` / `RULES.md`, **those win over this kit**. zm-pro is the professional default for projects that don't define their own — never an override.

## When to use

- Kickoff, planning or setup of any software project
- Implementing, fixing or refactoring code
- Reviewing, auditing or hardening (quality, security, accessibility, privacy)
- Delivering — commit, PR, release, deploy, post-incident follow-up
- Architecture, convention or layout decisions

## When not to use

- Trivia outside projects (a quick question, a one-off text edit)
- Anything where the project defines explicit rules — follow them

## The cycle (every track)

1. **Read the ground first**: `README.md`, `AGENTS.md`, `RULES.md`, manifests and lockfiles — before touching anything.
2. **Reproduce or understand**: expected vs. actual behavior; confirm an entity, endpoint or feature exists before creating a new one.
3. **Smallest safe change**, with a regression test when there's a seam; at most **3 external references per task** (by name + link, never by index).
4. **Verify for real**: run the commands (typecheck, tests, build, e2e) and quote the actual output — never claim success without evidence.
5. **Deliver with a record**: files changed, commands + results, risks, open items, evidence.

## Reference index (load only what the track needs)

| File | Read when the task touches… |
|---|---|
| `reference/01-code-rules.md` | code rules, gates, dependencies, definition of done |
| `reference/02-project-standards.md` | repo layout, docs, commits, PRs, versioning, changelog |
| `reference/03-layout-ui.md` | UI, layout, forms, a11y, locale formatting, design tokens |
| `reference/04-multi-agent.md` | sessions, multi-agent coordination, handoff, delegation prompts |
| `reference/05-project-memory.md` | project memory, ADRs, delivery logs, registries |
| `reference/06-data-privacy-lgpd.md` | personal data: data mapping, legal basis, DSAR, incidents, LGPD |
| `reference/07-security.md` | secrets, OWASP, auth/RLS, headers, dependencies, incidents |
| `reference/08-testing-quality.md` | unit/integration/e2e tests, a11y, performance, coverage |
| `reference/09-delivery-git.md` | commits, branches, PRs, release, rollback |
| `reference/10-operations.md` | logs, metrics, alerts, backups, runbooks, blameless post-mortems |
| `reference/11-architecture.md` | module boundaries, deep modules, dependency direction, seams, ADRs |
| `reference/12-performance.md` | measure-first profiling, Core Web Vitals budgets, N+1, indexes, CI perf gates |
| `reference/13-token-economy.md` | spending context deliberately: reads on demand, caching, narrow subagent scopes, output caps |

## Universal rules (apply on every track)

1. **Reference ≠ dependency ≠ installation.** Catalogs inform decisions; installing requires an explicit decision: license, maintenance and cost-zero (or an approved budget) verified.
2. **Secrets and real customer data never leave the project** — not in code, logs, commits, screenshots, fixtures or third-party tools.
3. **Deploys are fail-closed.** A red gate blocks release; emergencies are manual and auditable.
4. **Locale-correct UI** (see `reference/03-layout-ui.md`): Brazilian Portuguese defaults (`R$ 1.234,56`, `dd/mm/aaaa`, 44px touch targets) when shipping pt-BR products; adapt per market.
5. **Cost-aware by default**: nothing paid without an explicit owner decision.
6. **Evidence before "done"**: a command was run and its output is attached — or the gap is stated explicitly.
7. **Privacy is engineering, not compliance**: this kit produces drafts and controls; legal sign-off belongs to your DPO/counsel.
8. **One source of truth per fact**: a rule is changed in its owning file, never in a copy.

## Conventions about references

Curated external references are cited by **name + link**, never by bare numbers, and at most **three per task**. A mention is a recommendation to deepen reasoning, not authorization to install anything. Verify license and maintenance status at the time you adopt something — links and licenses drift.

## Templates

`templates/` holds generic, copyable starting points for the target project: `templates/AGENTS.md`, `templates/RULES.md`, `templates/ADR.md`, `templates/DEFINITION-OF-DONE.md`, `templates/DELIVERY-CHECKLIST.md`, `templates/PR-TEMPLATE.md`. Delegation prompts for the most common agent tasks (implement, fix, review, release, privacy audit) live in `templates/prompts/` — output is draft material; you review it. Copy and adapt templates — never edit the originals inside this kit from within a project.
