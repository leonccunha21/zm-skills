# Changelog

All notable changes to this project. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [semver](https://semver.org/).

## [Unreleased]

### Added

- `tests/` — first real unit suite (`node:test`, zero dependencies): the validator accepts this repo and rejects broken relative links, project residue and router/package version drift; the installer covers project and global installs, existing destination, `--force`, invalid or missing harness, and paths with spaces.
- `package.json` — `npm test` now runs the unit suite; `npm run validate` remains the structural gate.
- CI — the `validate` workflow runs `npm test` on the same Node/OS matrix.
- `scripts/install.mjs` — safe upgrades: `--dry-run` prints the installed and incoming versions plus the file plan (changed/new/local-only) and writes nothing; `--force` keeps the previous folder as `zm-pro.backup-<timestamp>` with rollback instructions; the copy goes through a temp folder and a rename, so a failed run never leaves a half-written install presented as done; downgrades are detected and warned.
- `tests/` — installer suite covers dry-run, backup preservation of local files, version detection (upgrade and downgrade) and flag order.

- `scripts/checksums.mjs` — `--verify <manifest>` mode: checks every SHA-256, flags missing/extra files under `zm-pro/`, rejects paths outside the repository, and exits non-zero on any problem; documented in `SECURITY.md` (how to verify a downloaded release).
- `.github/workflows/validate.yml` — least-privilege `contents: read`, actions pinned by commit SHA, and a separate checksums job that generates and verifies the manifest.
- `.github/workflows/release.yml` — the tag now gates on `npm run validate` + `npm test`, pins actions by SHA, and verifies the checksum manifest before publishing.

- `.github/ISSUE_TEMPLATE/harness_report.md` — compatibility evidence form (harness, version, OS, install mode, observation, commands, limitations) plus a private-vulnerability contact link in `config.yml`; the PR template now covers motivation, scope, files, evidence, impact, docs and a security checklist.
- `docs/maintenance-policy.md` — supported versions, deprecation flow, review cadence, harness honesty and triage pointers.
- `docs/decisions/0001-tooling-contract.md` — first ADR: validator gate, fail-closed installer, verifiable checksums, `node:test` only.
- `docs/harness-compatibility.md` — reproducible five-step test script with pass criteria.

### Changed

- `scripts/install.mjs` — flag parsing no longer mistakes a `--dir` value for the harness name.

- `scripts/validate.mjs` — validator v2: ignores fenced code, validates relative links, images and heading anchors (unicode and `--` slugs, percent-encoded paths), skips `.git/` and `node_modules/`, enforces frontmatter fields/delimiters/duplicates/limits, makes index coverage an error, syncs versions across `package.json`, `SKILL.md`, `CHANGELOG.md`, README badges and `SECURITY.md`, and supports `--json`.
- `CONTRIBUTING.md` — the gate now includes `npm test` alongside `npm run validate`.

### Fixed

- `checksums.mjs` documented usage — `npm run checksums > file` wrote npm's banner into the manifest, producing a corrupt release artifact. Docs now use `npm run --silent checksums` (`node scripts/checksums.mjs` directly in CI), and `--verify` rejects such lines.
- `README.md` / `README.pt-BR.md` — version badge is now dynamic (latest GitHub release) instead of the stale static `0.4.0`; documented uninstall/recovery; scripted install documented as `npm run install-skill -- opencode`.
- `SECURITY.md` — supported versions updated from `0.4.x` to the current minor, with the update-first policy stated.
- `scripts/install.mjs` — a missing harness now fails with the documented npm form; `--dir` is documented as the project root, not the final destination.

## [0.8.1] — 2026-11-16

Patch release: roadmap documentation catches up with shipped versions.

### Changed

- `docs/roadmap.md` — rewritten to reflect shipped releases 0.5.0–0.8.0 and the community-intake state.

## [0.8.0] — 2026-11-16

The catalog release: the kit now ships its own license and enters the community skill catalogs.

### Added

- `zm-pro/LICENSE` — the skill folder itself now carries the MIT license (travels with vendored installs; satisfies catalog intake rules such as sickn33's).
- Community intake: PRs opened against the Agent Skills awesome catalogs — [Prat011/awesome-llm-skills #337](https://github.com/Prat011/awesome-llm-skills/pull/337) and [sickn33/agentic-awesome-skills #2351](https://github.com/sickn33/agentic-awesome-skills/pull/2351) (ready-for-review, CI-assisted intake). OpenCode 2.3.0 is the only end-to-end verified harness; see `docs/harness-compatibility.md`.

## [0.7.0] — 2026-11-16

The beginner update: the kit now meets absolute newcomers where they are.

### Added

- **GitHub Discussions** opened and linked from both README footers — community front door; announcement discussion pinned by maintainers.
- `docs/primeiro-dia.md` — the full zero-to-first-commit walkthrough for absolute beginners (git/Node/harness setup, honest cost expectations, filling `RULES.md`/`AGENTS.md`, first task, safe rollback, survival glossary, first-session troubleshooting). EN twin: `for-humans.md` links it.
- "Before you start / Antes de começar" section in both READMEs — Git, Node ≥ 18, authenticated harness, honest budget (the kit is free; providers vary).
- Glossary of surviving terms in `docs/para-leigos.md` and plain-language pointer from `for-humans.md`.

## [0.6.1] — 2026-11-16

Docs-only release: presents the kit's content in plain language inside both READMEs.

### Changed

- `README.md` / `README.pt-BR.md` — both now carry the "The 13 guides in plain language" table and link the beginner guides (EN: `for-humans.md`, pt-BR: `para-leigos.md`).
- `CHANGELOG.md` — deduplicated the `[Unreleased]` / `[0.6.0]` sections.

## [0.6.0] — 2026-11-16

The budget update: spend context deliberately, and the kit now explains *how*.

### Added

- `zm-pro/reference/13-token-economy.md` — the missing reference: spending context like a budget (reads on demand, caching discipline, narrow subagent scopes, output budgets, model routing).
- `docs/para-leigos.md` — the kit explained for non-specialists (pt-BR): what it is, the 13 guides in plain language, the templates, the validator, honest limits.
- `docs/for-humans.md` — the same beginner walkthrough in English.
- `.github/workflows/release.yml` — pushing a `v*` tag now auto-builds the checksum manifest and creates/updates the GitHub release with the `CHECKSUMS-<tag>.txt` attached (no manual steps).

### Changed

- `package.json` — `"test": "node scripts/validate.mjs"` so contributors get what they expect from `npm test`.
- `zm-pro/reference/05-project-memory.md` — new section: memory models for agents (procedural / semantic / episodic) with write/read/prune rules per model.
- `zm-pro/SKILL.md` + `README.md` / `README.pt-BR.md` — the reference index and trees now list 13 guides (13-token-economy); both READMEs link the beginner guide.

## [0.5.0] — 2026-11-16

The repository now obeys the rules it ships: dogfooded agent protocol, evidence-based compatibility matrix, one-command installs, and zero-gaps documentation.

### Added

- `.github/FUNDING.yml` — `buy_me_a_coffee: zmcompanh`. The repo Sponsor button now opens the Buy Me a Coffee page.
- `README.md` / `README.pt-BR.md` — centered header with quick navigation (`Install · What's inside · Quickstart · FAQ · Contributing`), the Buy Me a Coffee badge in the badge row, and a centered footer with the Sponsor call-to-action.
- `.github/workflows/validate.yml` — the validator now also runs on `windows-latest` (Linux + Windows × Node 18/20/22), covering the CRLF regressions observed in the pilot.
- Root `AGENTS.md` / `RULES.md` — the repository itself now dogfoods the kit's own agent protocol and its gates.
- `docs/harness-compatibility.md` — per-harness status with evidence (what was tested, where, what is unverified). No marketing claims: the table is the badge.
- `docs/demo.md` — the real 0.4.0 pilot run, from empty directory to delivered module (commands and output quoted).
- `docs/roadmap.md` — direction for the next releases (no dates; see tags).
- `scripts/install.mjs` — zero-dependency installer for `opencode` and `claude` (project/global copy with `--force` guard); `codex` / `cursor` / `gemini` print the manual route. `npm run install-skill`.
- `scripts/checksums.mjs` — SHA-256 manifest of `zm-pro/` for releases; documented in CONTRIBUTING. `npm run checksums`.

### Changed

- `zm-pro/SKILL.md` — the router states its version and `scripts/validate.mjs` fails if router and `package.json` drift apart.
- `README.md` / `README.pt-BR.md` — Install sections link the compatibility matrix and the scripted install.

## [0.4.0] — 2026-11-16

Pilot-feedback release: validated by a real end-to-end pilot project (`pilot-zm-pro`) that consumed the skill from scratch — 9/9 tests green, evidence-backed delivery log.

### Changed (additive, minor)

- `zm-pro/.gitattributes` ships inside the skill (`eol=lf` scoped to the skill only) — kills the CRLF warnings when the skill is installed into Windows projects (observed in the pilot)
- `reference/01-code-rules.md` documents the legitimate zero-dependency baseline (plain ESM JS + `node --test` + `node --check`), observed as sufficient for small utilities
- Supported-version table in `SECURITY.md` → `0.4.x`
- Pilot learnings recorded in the pilot repository (`pilot-zm-pro/DELIVERY-LOG.md`)

## [0.3.0] — 2026-11-16

Feature-complete pass — zm-pro now covers the full lifecycle from "empty repo" to "production + feedback", with a worked example included.

### Added

- `reference/11-architecture.md` — deep modules, dependency direction, seams, splitting heuristics, ADR discipline, contract versioning, tech-debt handling, anti-patterns
- `reference/12-performance.md` — measure-first profiling, Core Web Vitals budgets (LCP/INP/CLS), bundle budgets, N+1, indexes, caching with invalidation, CI perf gates, anti-patterns
- `templates/prompts/` — copyable delegation prompts: `implement-feature.md`, `fix-bug.md`, `review-pr.md`, `release-day.md`, `privacy-audit.md`
- `examples/minimal-project/` — a filled starter: AGENTS.md with real commands, a real ADR, and a DELIVERY-LOG with evidence-backed entries
- `SECURITY.md` (private vulnerability reporting, supported versions), `CODE_OF_CONDUCT.md`, link- and repo-shape checks in `scripts/validate.mjs`
- CI now validates on Node 18, 20 and 22

### Changed

- `SKILL.md` router index extended (12 references + prompts noted); description unchanged

## [0.2.0] — 2026-11-15

Public-readiness release: the kit is now fully English, generic and self-validating, ready to be consumed by any project and published as its own public repository.

### Changed (breaking for consumers of 0.1.0)

- All skill content rewritten in **English**; Brazilian-locale rules are now clearly scoped inside `reference/03-layout-ui.md` as Brazilian defaults
- Reference files renamed to English: `01-code-rules.md` … `10-operations.md` (was `01-regras-codigo.md` … `10-operacao-observabilidade.md`)
- Templates renamed to English: `DEFINITION-OF-DONE.md`, `DELIVERY-CHECKLIST.md` (was `DEFINICAO-DE-PRONTO.md`, `CHECKLIST-ENTREGA.md`)
- Removed every company/project-specific reference; the kit is generic and safe to install in arbitrary projects
- `README.md` rewritten in English; added `README.pt-BR.md`, `CONTRIBUTING.md`, issue/PR templates and a GitHub Actions validator
- Repository renamed `zm-skills` → `zm-pro` (the repo hosts the `zm-pro` skill)

### Added

- `scripts/validate.mjs` + `npm run validate` (zero-dependency): frontmatter checks, required-file checks, reference/index integrity, forbidden project-specific residue detection
- `.github/workflows/validate.yml` — CI validation on push/PR
- `.github/ISSUE_TEMPLATE/{bug_report,feature_request}.md`, `.github/PULL_REQUEST_TEMPLATE.md`
- FAQ, quickstart and install matrix for OpenCode / Claude Code / Codex / Cursor / Gemini CLI

## [0.1.0] — 2026-11-15

### Added

- Skill `zm-pro`: router `SKILL.md` + 10 references + 6 templates (Brazilian Portuguese)
- Rules and gates with evidence discipline (`reference/01` … `reference/10`)
- Multi-agent coordination protocol (one coordinator, one task at a time)
- Project memory in three layers (institutional / session / structural)
- LGPD companion pointer to the MIT-licensed lgpd-skills pack
- Copyable templates: `AGENTS.md`, `RULES.md`, `ADR.md`, `DEFINICAO-DE-PRONTO.md`, `CHECKLIST-ENTREGA.md`, `PR-TEMPLATE.md`
