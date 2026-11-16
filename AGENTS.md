# AGENTS.md — Agent protocol for this repository

> This repository produces the `zm-pro` skill. Agents working **on the kit itself** follow this file. The kit is the product — treat every change like it ships.

## Rule zero

1. Read `RULES.md`, this file, `CONTRIBUTING.md`, the task and the relevant `zm-pro/reference/` files **before any tool call**.
2. One task per run; never expand scope silently — outside the scope means stop and ask.
3. **Evidence before "done":** run `npm run validate` and quote its real output. Success without output is a process failure.
4. Smallest safe change; regression proof when there's a seam.
5. Anti-collision: `git status` before writing; pathspec commits; never bury another session's WIP.
6. Secrets and real data never in code, logs, commits or screenshots.
7. Reference ≠ dependency: catalogs inform; new runtime/service requires an explicit owner decision and an ADR.
8. Conflicts are documented: `RULES.md` > `AGENTS.md` > the kit's references > catalog. Genuinely stuck → write the ADR, don't improvise over written rules.

## Real commands for this project

| Action | Command |
|---|---|
| Validate (the gate) | `npm run validate` |
| Audit as JSON | `npm run audit` |
| Mechanical fixes (preview) | `npm run audit:fix` (apply with `-- --yes`) |
| Install the skill into a harness | `node scripts/install.mjs opencode` (see `README.md#install`) |
| Release integrity | `npm run --silent checksums > CHECKSUMS-<tag>.txt` + `--verify` |
| Node required | >= 18 |

## Integrity

- Every delivery records: files changed · commands executed and their results · risks · open items · evidence.
- User-visible changes update `CHANGELOG.md` under `[Unreleased]`.
- `README.md` and `README.pt-BR.md` stay in sync; English is canonical.
- What wasn't tested is stated explicitly ("not tested: <reason>") — never implied.
- Environment: edit locally; `main` and releases only through the `CONTRIBUTING.md` process.
