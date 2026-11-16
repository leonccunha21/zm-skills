# 08 — Testing & quality

Tests are the price of changing code with confidence. The goal is not 100% coverage — it's **no critical flow breaking silently**.

## The pyramid

1. **Unit** (majority) — pure business rules: calculations, validations, state machines. Fast, no I/O, synthetic data.
2. **Integration** — API ↔ DB ↔ auth against emulators/local instances (Postgres in a container, Firebase Emulator, MSW for third-party HTTP). Test RLS for real: another account's resource must fail.
3. **E2E** (few, critical) — flows that move money or guard data (signup → sale → receipt; login → operation; offline → reload → sync). Playwright + fixtures; runs in the pipeline for relevant changes.
4. **Cross-cutting** — accessibility (axe-core/axe-playwright), performance (Lighthouse CI, web-vitals), visual (Storybook optional), security (ZAP/audit on the gate).

## Golden rules

- **Regression test when a seam exists**: every fixed bug gets a test that fails without the fix. No seam? Create the smallest possible one — "it can't be tested" is not a conclusion.
- **No test depending on order or wall-clock** without control (fake timers); no fixtures with real data — ever.
- **Deterministic**: a flaky test is a bug in the test — quarantine and fix; never blindly retry-until-green.
- **The gate is real**: typecheck + full suite, with the output quoted in the delivery. "Should be passing" is not a result.
- **Coverage as diagnostic, not religion**: aim ≥80% on domain/rule modules and 100% of critical flows; uncovered lines in money/data paths are alerts, not statistics.

## Quality gates by change type

| Change | Required |
|---|---|
| Any code | typecheck + tests |
| Schema/migration | + up/down migration test |
| Auth / authorization / RLS | + cross-account denial test |
| Dependency | + quality/security gate |
| UI / commercial flow | + e2e + axe |
| Offline/sync/licensing | + e2e on the affected flow + network-failure simulation |
| Release | everything + build(s) + changelog |

## Bug → test

Reproduce first (steps + expected vs. actual) → failing test → minimal fix → green → typecheck/build → evidence in the delivery. A fix without a regression test comes back as a bug next quarter.

## Tooling (evaluate; install only by decision)

Playwright · Testing Library · MSW · Firebase Emulator UI · Storybook · axe-core / axe-playwright · Lighthouse CI · web-vitals · built-in coverage (c8 / node --experimental-coverage) is enough.
