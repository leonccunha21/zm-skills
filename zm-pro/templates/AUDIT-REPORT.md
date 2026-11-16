# Technical audit report — <scope>

> Copy to `docs/audits/<date>-<slug>.md`. Findings without evidence are opinions; keep the evidence column filled.

## Scope and method

- **Audited:** <repo/module/feature, commit or version>
- **Not audited:** <explicit list — the report's honesty depends on this>
- **Method:** <static read, commands run, tests, manual flows>
- **Mode:** read-only unless explicitly stated otherwise

## Summary

| Severity | Count |
|---|---|
| Blocker | 0 |
| High | 0 |
| Medium | 0 |
| Low | 0 |

<!-- One paragraph: the main risk and the first thing to fix. -->

## Findings

| # | Severity | Area | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|---|---|
| 1 | high | <security/data/tests/ops> | <what is wrong> | <file:line, command output> | <who is affected and how> | <smallest safe fix> |

## Detail

### 1. <title>

- **What:** <observed behavior>
- **Why it matters:** <concrete scenario>
- **Evidence:** <path:line, command + output>
- **Fix:** <steps; note if it needs an ADR or owner decision>
- **Verification after fix:** <test/command that proves it>

## Order of execution

1. Blockers and security issues first — with a regression test.
2. High findings that block delivery or hide failures.
3. Medium/low: batch by area, one risk group per change.

## Out of scope / unknown

<!-- Untested paths, third-party services, environments you could not reach. -->
