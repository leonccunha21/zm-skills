# 02 — Project standards

Every professional project keeps the same spine. Domains vary; the skeleton doesn't.

## Minimum repository layout

```
project/
├── README.md            # what, why, stack, commands, env vars, how to run
├── AGENTS.md            # protocol for AI agents (see templates/)
├── RULES.md             # architecture/security rules (see templates/)
├── LICENSE              # always — no license means all-rights-reserved
├── CHANGELOG.md         # Keep a Changelog + semver
├── docs/
│   ├── adr/             # NNNN-title.md — why each decision was made
│   └── …appendices
├── PENDENCIAS.md        # what awaits real environments (optional, per team)
└── …
```

One source of truth per fact: each fact lives in exactly one place; everywhere else points to it.

## What each document answers

- **README** — a stranger runs the project in 15 minutes: stack, install, required env vars (names, not values), dev/build/test commands, who maintains it.
- **AGENTS.md** — how an AI agent operates in this repo: startup protocol, real commands, integrity rules. Start from `templates/AGENTS.md`.
- **RULES.md** — what must never happen here (architecture, security, data, deploy). Start from `templates/RULES.md`. Skills and catalogs never override RULES.
- **ADR** (MADR style) — the *why*: context → options → decision → consequences. New decision? Write a new ADR; superseded ones get status `superseded by ADR-MMMM`, never rewritten history.
- **Delivery log** — per delivery: date, SHA, evidence, open items. Your institutional memory (see `05-project-memory.md`).

## Git, branches, commits

- `main` always deployable; one branch per delivery: `feat/`, `fix/`, `chore/`, `docs/` + short slug.
- Small, pathspec-scoped commits; conventional commits: `feat(sync): tombstone on deleteMissing`.
- Never force-push `main`; local rebase of your own branch before PR is fine.
- Semantic tags `vX.Y.Z`; CHANGELOG updated in the same commit as the tag.
- Merge strategy (merge commit vs. squash vs. rebase): decide once per repo and document it in RULES.

## Versioning (semver)

MAJOR = contract break · MINOR = compatible addition · PATCH = fix. "Contract" means the external API, the data schema, the CLI, the file format, the sync/licensing behavior. In doubt → PATCH + a CHANGELOG note. CHANGELOG entries carry the action for consumers (see `docs/migration.md` in the kit — actionable, not title-only); a breaking release always names the migration, examples before/after, and the rollback path.

## Done means documented

`DEFINITION-OF-DONE.md` defines "done" once per project; `DELIVERY-CHECKLIST.md` is filled in per delivery. PRs without both are not mergeable.

## Repository hygiene

`.gitignore` covers `.env*`, `*.pem`, build artifacts, coverage, `*.local.md`. A secret scanner runs in CI. No generated files in history. Canonical scripts in `package.json` (`dev`, `build`, `test`, `typecheck`, `lint`): agents discover the project through scripts, not by guessing.
