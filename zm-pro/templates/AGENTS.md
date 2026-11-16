# AGENTS.md — Agent protocol for this repository

> Copy into a project root and adapt the commands. **Golden rules:**

1. **Rule #0 — read before acting:** read `RULES.md`, this file, the project `README.md` and the task (objective, files, acceptance criteria) *before* any tool call. Load the task's skill first, if one exists.
2. **One task per run.** Never expand scope silently; outside the scope = stop and ask.
3. **Evidence before "done":** run the commands and quote real output; success without evidence is a process failure.
4. **Smallest safe change**; regression test when there's a seam.
5. **Anti-collision protocol:** check `git status` before writing; pathspec commits; never delete or bury another session's WIP; `main` only via approved PR with green gates.
6. **Secrets and real customer data never** in code, logs, commits, screenshots or external tools.
7. **Deploys are fail-closed:** a red gate blocks; emergencies are manual and auditable.
8. **Reference ≠ dependency:** catalogs inform; installing requires an explicit decision (license + maintenance + cost).
9. **Document conflicts:** `RULES.md` > `AGENTS.md` > skill > catalog. If genuinely stuck, write an ADR — don't improvise over written rules.

## Real commands for this project (fill in)

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

- Every delivery records: files changed · commands executed and their results · risks · open items · evidence.
- Never declare "PASSING" without command output. What wasn't tested is said explicitly ("not tested: <reason>").
- With multiple sessions touching one tree, a shared coordination doc is the meeting point — fronts, file ownership, write order.
- Environment: edit in local; homologation/production only with approval and the release checklist.
