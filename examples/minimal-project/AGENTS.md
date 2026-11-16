# AGENTS.md — Agent protocol for this repository

> Example of the filled template (see `templates/AGENTS.md` for the blank version).

1. **Rule #0 — read before acting:** `RULES.md`, this file, `README.md`, then the task (objective, files, acceptance criteria). Load the `zm-pro` skill first.
2. **One task per run.** Out of scope = stop and ask.
3. **Evidence before "done":** run the commands and quote real output.
4. **Smallest safe change**; regression test when there is a seam.
5. **Anti-collision:** `git status` before writing; pathspec commits; never bury another session's WIP.
6. **Secrets and real customer data never** in code, logs, commits, screenshots or external tools.
7. **Deploys are fail-closed.** A red gate blocks; emergencies are manual and auditable.
8. **Reference ≠ dependency:** catalogs inform; installing requires an explicit decision.
9. **Conflict:** RULES > AGENTS > skill > catalog. Stuck? Write an ADR — don't improvise.

## Real commands for this project

| Action | Command |
|---|---|
| Dev | `npm run dev` |
| Typecheck | `npm run typecheck` |
| Tests | `npm test` |
| Lint | `npm run lint` |
| Build | `npm run build` |
| Quality gate | `npm run quality:gate` |
| Security gate | `npm run security:gate` |
| E2E | `npm run e2e` |

## Integrity

Every delivery records: files changed · commands executed + results · risks · open items · evidence. Never declare "PASSING" without command output. With multiple sessions in one tree, `docs/AGENT-COORDINATION.md` is the meeting point.
