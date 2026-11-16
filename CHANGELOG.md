# Changelog

All notable changes to this project. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [semver](https://semver.org/).

## [Unreleased]

### Added

- `templates/RULES.md` — new section "Mechanical enforcement": concrete ways to turn marked rules into CI gates (secrets scan, scope-limited branches, migration up/down verification, evidence checkbox, lockfile-drift check), and the explicit distinction between mechanically enforced vs. behavioral rules.
- `templates/CI-ENFORCEMENT.yml` — copyable consumer-side workflow embodying that section: fails the PR on secrets, lockfile drift, out-of-scope paths on `fix/` branches, and leaves the migration-rollback job ready to adapt.
- `docs/harness-compatibility.md` — matrix now includes an "On-demand loading (lazy references)" row: native skills mechanism only for OpenCode; other harnesses load always-on via rules file.

### Upgrade

Nothing yet — 0.9.0 just shipped; see below.

## [0.9.0] - 2026-11-16

### Added

- `scripts/install.mjs` — `--with-tools` flag: optionally copies `scripts/coordinate.mjs` into `<projectRoot>/scripts/coordinate.mjs` for consumer projects; covered by unit tests in `tests/install.test.mjs`.
- `scripts/coordinate.mjs` — coordinator governance: `clean` requires coordinator authority (`--by <coordinator-id>`, `--role coordinator`, or `--force`) to prevent accidental session purging; `claim` checks for existing claims across active sessions and blocks collisions unless overridden by an active coordinator with `--force` (covered by `tests/coordinate.test.mjs`).
- `zm-pro/reference/09-delivery-git.md` — concrete branching & delivery workflows (standard vs hotfix vs release cut), step-by-step rollback procedure, anti-patterns section, and dual checklists (per-PR change checklist + release cut checklist).
- `zm-pro/reference/10-operations.md` — observability instrumentation procedure (`request_id` propagation, liveness vs readiness probes, redaction filters), incident triage severity classification (P0/P1/P2), anti-patterns section, operational readiness checklist, and routine maintenance checklist.
- `zm-pro/reference/11-architecture.md` — boundary enforcement & static verification (circular dependency scanning, layer isolation, package export maps), 4-phase contract evolution procedure (additive, dual-write/read, deprecate, decommission), anti-patterns, module design checklist, and architectural change/ADR checklist.
- `zm-pro/reference/12-performance.md` — scientific 4-step performance investigation & profiling procedure (`EXPLAIN (ANALYZE, BUFFERS)` and traces), memory and streaming discipline (payload streaming, bounded LRU caches, pool sizing), anti-patterns, data layer checklist, and frontend release checklist.
- `scripts/coordinate.mjs` — `watch [--interval <s>] [--limit <n>]` command: polls the blackboard for new messages in real time and prints them as they arrive (Ctrl+C to stop). Useful when an agent is waiting for a handoff from another agent.
- `scripts/coordinate.mjs` — `diff [--json] [--stale-minutes <m>]` command: shows only files currently claimed by more than one active session; exits non-zero when any conflict exists (both human and JSON output modes).
- `scripts/diagnose.mjs` — coordination awareness: reads `.agents/coordination/sessions/` and reports active sessions, stale sessions (>15 min without heartbeat) and file-claim conflicts as `suggestion`/`warning` findings.
- `scripts/metrics.mjs` — coordination metrics: `activeSessions`, `staleSessions`, `conflicts`, `blackboardMessages`; shown in human output and in `--json` under `facts.coordination`.
- `scripts/parity-check.mjs` — extended from README-only to two pairs: `README.md ↔ README.pt-BR.md` and `docs/for-humans.md ↔ docs/para-leigos.md`; `--json` output gains a `pairs` array with per-pair diff list.
- `docs/for-humans.md` — added `## Get started today` and `## Survival glossary` sections to match `docs/para-leigos.md` structure.
- `tests/coordinate.test.mjs` — 7th test: 3-agent collision scenario exercising `status`, `diff`, `check`, partial release and full conflict resolution.
- `scripts/evaluate-run.mjs` — behavioral evaluation runner: prepares scratch workspace from a scenario JSON, executes the harness with the prompt as an argv argument (no shell interpolation), saves a raw transcript and scaffolds the report under `docs/evaluation-results/`.
- `tests/evaluate-run.test.mjs` — 5 tests for the evaluation runner (dry-run, prompt-as-arg, transcript save, scaffold output, placeholder substitution).

- `zm-pro/reference/04-multi-agent.md` and `zm-pro/templates/COORDINATION.md` — cross-platform communication protocol, transient blackboard vs. durable workstream partitioning, handoff contract and collision prevention.
- `tests/` — first real unit suite (`node:test`, zero dependencies): the validator accepts this repo and rejects broken relative links, project residue and router/package version drift; the installer covers project and global installs, existing destination, `--force`, invalid or missing harness, and paths with spaces.
- `package.json` — `npm test` now runs the unit suite; `npm run validate` remains the structural gate.
- CI — the `validate` workflow runs `npm test` on the same Node/OS matrix.
- `scripts/install.mjs` — safe upgrades: `--dry-run` prints the installed and incoming versions plus the file plan (changed/new/local-only) and writes nothing; `--force` keeps the previous folder as `zm-pro.backup-<timestamp>` with rollback instructions; the copy goes through a temp folder and a rename, so a failed run never leaves a half-written install presented as done; downgrades are detected and warned.
- `scripts/validate.mjs` — the audit command (`npm run validate`, `npm run audit` for JSON). Read-only by default; every finding carries severity (`error`/`warning`/`suggestion`), file:line when available, evidence and a suggested fix; `--fail-on=warning` tightens the gate; `--fix` previews mechanical fixes (trailing whitespace, final newline) and `--fix --yes` applies only those. Output is deterministic for the same input.
- `tests/` — installer suite covers dry-run, backup preservation of local files, version detection (upgrade and downgrade) and flag order.

- `scripts/checksums.mjs` — `--verify <manifest>` mode: checks every SHA-256, flags missing/extra files under `zm-pro/`, rejects paths outside the repository, and exits non-zero on any problem; documented in `SECURITY.md` (how to verify a downloaded release).
- `.github/workflows/validate.yml` — least-privilege `contents: read`, actions pinned by commit SHA, and a separate checksums job that generates and verifies the manifest.
- `.github/workflows/release.yml` — the tag now gates on `npm run validate` + `npm test`, pins actions by SHA, and verifies the checksum manifest before publishing.

- `.github/ISSUE_TEMPLATE/harness_report.md` — compatibility evidence form (harness, version, OS, install mode, observation, commands, limitations) plus a private-vulnerability contact link in `config.yml`; the PR template now covers motivation, scope, files, evidence, impact, docs and a security checklist.
- `docs/maintenance-policy.md` — supported versions, deprecation flow, review cadence, harness honesty and triage pointers.
- `docs/decisions/0001-tooling-contract.md` — first ADR: validator gate, fail-closed installer, verifiable checksums, `node:test` only.
- `docs/harness-compatibility.md` — reproducible five-step test script with pass criteria.

- `zm-pro/reference/14-agent-operations.md` — agent operating cycle, tool-risk matrix with confirmation rules, untrusted content and instruction hierarchy, stop rules, reporting contract and recovery; indexed in the router and the routing table.
- `examples/bugfix/` — runnable fix cycle (failing test → one-line fix → green) with the real before/after output; `npm run test:examples` and CI run it.
- `examples/feature/` — a small feature delivered end to end: acceptance criterion, test first, real output, changelog entry and delivery record.
- `examples/legacy/` — characterization tests on undocumented rules, a behavior-preserving refactor and a deliberate break proving the suite catches it.
- `docs/demo.md` — guided 20-minute walkthrough; `scripts/diagnose.mjs` — read-only first-contact diagnostic (`npm run diagnose`, `--json`), covered by tests.
- `docs/quickstart.md` — five-minute path from clone to one evidenced change.
- `docs/maturity.md` — honest maturity report: levels 1–2 met, 3–4 not met, 5 partial, with evidence and limits.

- `docs/migration.md` — SemVer semantics for a skill, what is (and is not) a breaking change, upgrade/downgrade steps and a per-version migration table with the action required.
- `scripts/install.mjs` — symbolic links inside the install tree are rejected instead of followed; a stale `zm-pro.tmp-*` folder left by an interrupted run is removed on the next install once it is older than one hour (never one from a concurrent run); a destination that exists but is not a directory fails before anything is written.
- `tests/` — idempotent reinstall, stale temp cleanup, symlink guard (skipped where the OS forbids creating links), Unicode/space paths and `--dir` before the harness.
- `tests/offline.test.mjs` — asserts no script imports or calls a network module, and runs validation + install with an invalid proxy to prove the tooling never reaches the network.

- `EVALUATIONS.md` + `tests/evaluations/scenarios/` — 15 synthetic scenarios (small/medium/complex) covering bug, feature, legacy, migration, auth, upload, privacy, incident, deploy and conflict cases; `scripts/evaluate.mjs` (`npm run evaluations:check`) schema-checks them read-only (unique ids, referenced guides exist, no secret-like content) and states explicitly that it is **not** a behavioral result. `templates/EVALUATION-REPORT.md` holds the recording format. No baseline has been run or published.
- `examples/task-api/` — complete small web app with a database stand-in: `node:http` REST API (201/400/404/413/500), validation at the boundary, atomic JSON-file-backed store, end-to-end tests with `node:test`. Zero dependencies; run with `node --test` or `npm run test:examples`.
- `tests/` — adversarial injection fixtures (`tests/fixtures/adversarial/`) and the shared detection module `scripts/lib/injection-patterns.mjs`, used by `tests/injection-hygiene.test.mjs`.
- `scripts/parity-check.mjs` + `tests/parity.test.mjs` — EN/pt-BR README parity (heading structure, fence count, commands, links with an allowlist for badges/language files); CI gates it.
- `scripts/metrics.mjs` + `tests/metrics.test.mjs` — deterministic repository facts; `docs/metrics.md` defines each metric with method, cadence, owner and status; `docs/critical-rules.md` — critical rules with rationale, scenario and verification; `docs/attribution.md` — licensing/attribution review; `docs/scope-control.md` — rules against kit bloat; `docs/context-cost.md` — per-reference context ledger; `docs/breaking-changes.md` — breaking-change history; `docs/evaluation-results/` — honest landing spot; `docs/reviewing-automated-contributions.md`; `docs/demo.md`, `docs/glossary.md`, `docs/quickstart.md`.

- CI — the `validate` workflow is now five jobs: `validate` (structure + parity + injection hygiene + adapter editorial model), `tests` (Node 18/20/22 on Ubuntu/Windows/macOS), `examples`, `checksums` (generate + verify), and `pack` (`npm pack --dry-run`). Each prints its runtime.
- `tests/stack-adapters.test.mjs` — editorial-model guard for the stack adapters: every ecosystem present, detection-first required, commands conditional, monorepo handling; runs in CI.
- `tests/install.test.mjs` — synthetic upgrade test: an install whose `SKILL.md` marker says `zm-pro v0.6.0` upgrades to the current tree with a deep file-by-file comparison against the source.
- `scripts/evaluate-run.mjs` — behavioral evaluation runner: scratch copy of the repo, harness invoked via argv (`{{prompt}}` token, no shell), raw transcript + report scaffold; `--dry-run` preview; covered by `tests/evaluate-run.test.mjs`.
- `docs/evaluation-results/pilot-eval-001.md` / `pilot-eval-012.md` — two single-run, author-administered pilots on `opencode/inkling-2-small-free`, explicitly **not** a baseline; both recorded as inconclusive with transcripts.

### Upgrade

No action required. Existing installs keep working; to pick up this release, run `node scripts/install.mjs <harness> --dry-run`, then `--force` (previous folder kept as `zm-pro.backup-<timestamp>`). Details and the version table: `docs/migration.md`.

### Changed

- `.github/workflows/validate.yml` — matrix now includes macOS; the executable example runs as its own step.
- `README.md` / `README.pt-BR.md` / `docs/for-humans.md` / `docs/para-leigos.md` — guide tables updated to 14 references; FAQ now states harness coverage and limits.
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
