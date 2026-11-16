# Changelog

All notable changes to this project. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [semver](https://semver.org/).

## [Unreleased]

### Added

- `.github/FUNDING.yml` — `buy_me_a_coffee: zmcompanh`. The repo Sponsor button now opens the Buy Me a Coffee page.
- `README.md` / `README.pt-BR.md` — centered header with quick navigation (`Install · What's inside · Quickstart · FAQ · Contributing`), the Buy Me a Coffee badge in the badge row, and a centered footer with the Sponsor call-to-action.
- `.github/workflows/validate.yml` — the validator now also runs on `windows-latest` (Linux + Windows x Node 18/20/22), covering the CRLF regressions observed in the pilot.

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
