# Roadmap

Direction, not promises. Dates live on released versions — see [`CHANGELOG.md`](../CHANGELOG.md).

## Shipped

- **0.5.0 — Hardening**: repo dogfoods its own kit (root `AGENTS.md`/`RULES.md`), evidence-based harness matrix, real pilot walkthrough (`docs/demo.md`), zero-dep installer, checksums script, router/package version enforced by the validator.
- **0.6.0 — Budget update**: `13-token-economy.md` (spend context deliberately), `for-humans.md` in English, auto-release workflow on tags (checksums + release).
- **0.6.1**: both READMEs carry the 13 guides in plain language.
- **0.7.0 — Beginner update**: `docs/primeiro-dia.md` (zero to first commit), "Before you start" sections, survival glossary.
- **0.8.0 — Catalog release**: `zm-pro/LICENSE` ships inside the skill; PRs against community catalogs ([Prat011/awesome-llm-skills #337](https://github.com/Prat011/awesome-llm-skills/pull/337), [sickn33/agentic-awesome-skills #2351](https://github.com/sickn33/agentic-awesome-skills/pull/2351)); OpenCode remains the only end-to-end verified harness.

## Candidates (in discussion)

- Publish the pilot as a public example repository (pending its author's decision)
- Fill the harness matrix from real community reports (Claude Code / Cursor first)
- Native Cursor rule generation (`.cursor/rules/`) alongside the manual "point at SKILL.md" route
- VoltAgent/awesome-agent-skills submission (blocked until the skill has real community adoption)

## Not on the roadmap — by design

- Runtime dependencies, telemetry, network calls inside the skill
- Vendor lock-in to a single harness
- Silent auto-updates — the kit is copied, never fetched on your machine behind your back
