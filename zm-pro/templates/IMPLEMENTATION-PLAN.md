# Implementation plan — <task>

> Copy to `docs/plans/<date>-<slug>.md` in your project. Keep it short; update it while you work, not after.
> The plan is proportional: a typo fix needs two lines, a migration needs every section.

## Objective

<!-- One paragraph: the outcome, in user-visible terms. -->

## Scope

- **In:** <files, modules, behaviors>
- **Out:** <explicitly excluded — prevents silent scope growth>

## Context read before planning

<!-- Files, commands and outputs actually inspected. Link paths, don't paste whole files. -->

- `RULES.md` / `AGENTS.md`: <constraints that shaped the plan>
- Code: <entry points, call sites>
- Tests: <existing coverage and how to run it>

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| <what can go wrong> | <low/medium/high> | <test, flag, backup, rollback> |

## Steps

| # | Step | Verification |
|---|---|---|
| 1 | <smallest safe change> | <command + expected output> |
| 2 | <next step> | <command + expected output> |

## Acceptance criteria

- [ ] <observable behavior>
- [ ] <regression covered by a test>
- [ ] <docs/changelog updated>

## Evidence log

<!-- Append as you go: command → real output (trimmed). This becomes the delivery record. -->

## Open items

<!-- What stays for later, with owner and reason. "Not tested: <reason>" is a valid entry. -->
