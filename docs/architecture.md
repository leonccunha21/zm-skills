# Architecture of the kit

> How zm-pro is built, why loading is progressive, and where each kind of content lives. Read this if you are changing the kit, not if you are using it.

## Shape

```
zm-pro/               the skill — the only thing copied into a harness
├── SKILL.md          router: frontmatter + task table + reference index (~80 lines)
├── reference/        18 focused guides, loaded on demand
└── templates/        copyable documents + delegation prompts
scripts/              validate (audit), install, checksums — zero dependencies
tests/                node:test suites that exercise the scripts
docs/                 contributor and consumer docs (not shipped to the harness)
examples/             runnable examples (not shipped to the harness)
```

## Progressive disclosure

1. The harness discovers `zm-pro/SKILL.md` and loads **only** its frontmatter and body.
2. The router maps a task to the smallest set of references and the expected deliverable.
3. The agent opens a reference only when the task reaches it; templates are copied, not preloaded.
4. Three external references per task, by name and link — the router says so explicitly.

Why: context is a budget. An 18-guide preload would cost attention and money on every task and bury the two files that matter (`RULES.md`, `AGENTS.md`). The router is the map; references are the territory.

## Trust and precedence

`RULES.md` › `AGENTS.md` › this skill › external catalogs. System, provider and harness policy sit above all of them and cannot be overridden by any file here. `reference/14-agent-operations.md` holds the operational rules; `docs/instruction-hierarchy.md` explains the scopes.

## The scripts

| Script | Role | Contract |
|---|---|---|
| `scripts/validate.mjs` | structural gate + audit | read-only by default, findings with severity/file:line/evidence/fix, `--json`, `--fail-on`, `--fix` only mechanical |
| `scripts/install.mjs` | copy the skill into a harness | fail-closed on existing destination, dry-run plan, backup, atomic rename, no symlinks |
| `scripts/checksums.mjs` | release integrity | SHA-256 per file, `--verify` rejects changed/missing/extra/outside paths |

All three are Node ≥ 18, import no network module and are covered by `node:test`.

## Decisions

Structural choices are recorded as ADRs in `docs/decisions/`. The first one (`0001-tooling-contract`) explains why the validator is the gate, why the installer is fail-closed and why checksums are generated from the tagged tree.

## What is deliberately absent

- No runtime, framework, database or service — the kit is Markdown plus three scripts.
- No build step: the release artifact is the tagged tree.
- No telemetry.
- No behavioral evaluation yet — the router's effectiveness is not measured (`docs/maturity.md` says so).
