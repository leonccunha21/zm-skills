# Context cost per reference

> The router promise: load the map, not the whole territory. This table is the budget ledger — how much each reference costs to load and how often it is expected to be needed. Reviewed at every release (`docs/maintenance-policy.md`).

## Current sizes (2026-11-16, `zm-pro v0.10.1`)

| Reference | Bytes | Lines | Expected load frequency | Benefit |
|---|---|---|---|---|
| 01-code-rules | 4058 | 47 | high — every code task | baseline survival rules |
| 02-project-standards | 2879 | 49 | high — kickoff/delivery | repo shape |
| 03-layout-ui | 3436 | 49 | medium — UI tasks | accessible, locale-correct UI |
| 04-multi-agent | 8025 | 118 | low-medium — multi-agent only | collision prevention |
| 05-project-memory | 7685 | 100 | high — long tasks | institutional memory |
| 06-data-privacy-lgpd | 3628 | 39 | medium — data tasks | privacy engineering drafts |
| 07-security | 3262 | 41 | medium — auth/data tasks | secrets, OWASP, incidents |
| 08-testing-quality | 2511 | 38 | high — code tasks | evidence over opinion |
| 09-delivery-git | 2288 | 38 | high — commit/PR/release | honest delivery |
| 10-operations | 2783 | 36 | medium — deploy/incident | tested rollback |
| 11-architecture | 3347 | 46 | medium — structural decisions | deep modules |
| 12-performance | 3084 | 56 | low-medium — perf work | measure first |
| 13-token-economy | 3840 | 55 | high — every task | context discipline |
| 14-agent-operations | 6228 | 102 | high — every agent task | tool risk, stop rules |
| 15-ai-security | 5652 | 80 | medium — AI features | LLM threat model |
| 16-domain-playbooks | 5898 | 87 | medium — domain tasks | domain checks |
| 17-working-modes | 5304 | 100 | medium — every task (mode name) | rigor dial |
| 18-stack-adapters | 5096 | 94 | medium — setup/stack tasks | detection-first commands |

**Totals:** 18 files, ~79 KB (~20k tokens if everything loaded — never the intended path; the router plus 2–4 references is the design).

## Rules for the budget

- A new reference must fit an unmet need, earn a router trigger, and justify its bytes: what question can a task not answer without it, and which task loads it?
- References that stop being loaded at releases are compressed, merged into the closest neighbor, or removed — with the deciding ADR.
- Size is not a target in itself: a 40-line reference that hides one decisive rule is fine; a 200-line one that restates chat history is not.
- `EVALUATIONS.md` tracks whether the wrong references are loaded at runtime; the ledger tracks what they cost when they are.

## Review cadence

At each release: re-measure (this table is produced by `ls -l` / `Get-ChildItem` — 2 minutes), update sizes and frequencies, and flag any reference whose load frequency dropped to "never" for discussion.
