# ADR 0002 — Required status checks: align branch protection with real CI jobs

- **Status:** accepted — 2026-11-16
- **Deciders:** maintainer
- **Scope:** `.github/workflows/`, branch protection for `main`
- **Supersedes:** none

## Context

RULES.md #9 requires `main` protection with required status checks — nothing merges without green CI. Until today, the required contexts were `validate (18)`, `validate (20)`, `validate (22)` — names no job in any workflow of this repository has ever reported. The real jobs, as listed by the GitHub API for the same commits, are the `validate` workflow's jobs and the matrix legs `tests (ubuntu-latest, N)` / `tests (windows-latest, N)` / `tests (macos-latest, N)`.

Evidence collected 2026-11-16:

- `gh api repos/.../branches/main/protection` (before) → required contexts `["validate (18)","validate (20)","validate (22)"]`
- `gh api repos/.../commits/<sha>/check-runs` → `validate`, `checksums`, `examples`, `pack`, and 13 matrix legs
- PR #11: CI 15/15 green, `mergeStateStatus: BLOCKED`, merge refused by policy — the protection was unreachable, independent of check outcomes.

Consequence of the old state: every merge to `main` was structurally bypass-or-nothing. Nothing testified whether CI was green, because the gate could never pass.

## Decision

Replace the required contexts with four real, meaningful ones:

- `validate` — the structural gate (structure, links, residue, version sync)
- `tests (ubuntu-latest, 22)` — newest Node, Linux (release-critical path)
- `tests (windows-latest, 18)` — Node floor, Windows (the OS product decision of 0.4.0)
- `tests (macos-latest, 22)` — macOS leg

`strict: false` is retained deliberately: requiring branches to be up to date would serialize all PRs behind any release merge; at this project's cadence that cost is larger than the stale-branch risk it removes.

## Consequences

- PR merges to `main` are gated on real evidence again; a red required leg blocks the merge.
- The required contexts must be updated in the same PR that renames or removes those jobs. Renaming a job without touching branch protection silently re-breaks the gate — the exact failure this ADR fixes. (`tests/test-wiring.test.mjs` guards the same class of drift between committed test files and the `npm test` script.)
- If a future PR is `BLOCKED` despite green CI, the first hypothesis is name drift between workflow jobs and branch protection, not a faulty CI run.
- The manual bypass remains available to the maintainer as documented in RULES.md #9, but it is no longer structurally forced on every merge.

## Alternatives rejected

- **Require all 13 matrix legs plus the 4 auxiliary jobs.** Maximally safe but brittle: any future job rename invalidates the gate and invites the silent bypass culture this ADR exists to end.
- **Leave protection as-is and keep merging via manual bypass.** Keeps a theatrical gate — it never blocks anything and conceals whether CI is actually green.
- **`strict: true`.** Serializes independent PRs behind every release; revisit when the contributor base grows beyond a single maintainer.
