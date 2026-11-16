# Test plan (risk-based) — <change>

> Copy to `docs/testing/<date>-<slug>.md`. Test effort follows risk, not habit.

## What changed and what can break

| Area | Change | Failure mode | Risk |
|---|---|---|---|
| <module> | <what> | <what the user sees> | low / medium / high |

## Levels

| Level | What it proves | Where it runs | Cost |
|---|---|---|---|
| Unit | logic and edge cases | local, fast | low |
| Integration | module + database/queue/API contract | local container or CI | medium |
| Contract | consumer/provider compatibility | CI | medium |
| E2E | the critical user journey | staging or local stack | high |
| A11y / security | keyboard, screen reader, authz, injection | manual + tooling | medium |

## Cases

- [ ] Happy path: <journey>
- [ ] Boundary: empty, maximum, unicode, timezone/locale
- [ ] Failure: timeout, 4xx/5xx, retry, partial write
- [ ] Regression: <bug that must not return>
- [ ] Authorization: another user's resource returns denied
- [ ] Migration: up, down, and old data readable

## Data and environments

- Synthetic fixtures only — no customer data, no real credentials.
- <which environment, which services are stubbed, how to reset>

## Exit criteria

- [ ] <gate> green in CI with quoted output
- [ ] Known failures listed with severity and owner
- [ ] Rollback tested when the change is irreversible in production
