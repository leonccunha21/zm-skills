# Changelog

All notable changes to this project. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [semver](https://semver.org/).

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
