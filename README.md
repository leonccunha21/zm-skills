# zm-pro — the professional project playbook for AI agents

**A portable, self-contained skill that turns any coding agent into a disciplined project professional** — rules, standards, layout & UI, multi-agent coordination, project memory, privacy (LGPD/GDPR), security, testing, delivery and operations. Built on the open [Agent Skills](https://github.com/agentskills/agentskills) format; works in OpenCode, Claude Code, Codex, Cursor, Gemini CLI and any harness that loads `SKILL.md` packs.

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](CHANGELOG.md)
[![validate](https://github.com/leonccunha21/zm-skills/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/leonccunha21/zm-skills/actions/workflows/validate.yml)

Read this in Portuguese: [README.pt-BR.md](README.pt-BR.md).

## Why

Agents already write code. What's missing in most projects is the **professional operating system around the code**: gates that actually block, deliveries with evidence, memory that survives the session, privacy by default, and layout that doesn't look templated. zm-pro is that operating system, packaged as an on-demand skill so it costs nothing in context until it's needed.

## What's inside

```
zm-pro/                        # the skill — copy this folder into your project/harness
├── SKILL.md                   # router: when to use, the cycle, the index
├── reference/                 # 10 focused guides, loaded on demand
│   ├── 01-code-rules.md           # principles, gates, dependencies, definition of done
│   ├── 02-project-standards.md    # repo layout, docs, commits, semver, changelog
│   ├── 03-layout-ui.md            # pt-BR defaults, mobile-first, touch ≥44px, a11y AA, tokens
│   ├── 04-multi-agent.md          # one coordinator, one task at a time, A/B scopes, handoff
│   ├── 05-project-memory.md       # institutional / session / structural memory
│   ├── 06-data-privacy-lgpd.md    # personal data triggers, controls, LGPD companion pack
│   ├── 07-security.md             # secrets, OWASP essentials, auth/RLS, backups, incidents
│   ├── 08-testing-quality.md      # pyramid, MSW/emulators/Playwright, regression, gates
│   ├── 09-delivery-git.md         # commits, PR, release, fail-closed deploy, rollback
│   └── 10-operations.md           # logs/metrics/alerts, backup drills, runbooks, post-mortems
└── templates/                 # generic, copyable starting points
    ├── AGENTS.md                  # agent protocol template
    ├── RULES.md                   # architecture/security invariants
    ├── ADR.md                     # architecture decision record
    ├── DEFINITION-OF-DONE.md
    ├── DELIVERY-CHECKLIST.md
    └── PR-TEMPLATE.md
```

Design principles:

1. **Reference ≠ dependency ≠ installation** — the kit teaches discipline; it never authorizes adding libraries to your product.
2. **Progressive disclosure** — `SKILL.md` stays short; detail lives in `reference/` and loads only when the task calls for it.
3. **Evidence before claims** — no "done" without commands run, output quoted, gaps stated.
4. **Your project wins** — its `AGENTS.md`/`RULES.md` override this kit; the kit is the default for projects without their own.
5. **Cost-aware and license-clean** — nothing paid without owner decision; every embedded reference is evaluated, never blindly installed.

## Install

### OpenCode

**Per project (recommended to start):**
```bash
mkdir -p .agents/skills
cp -r zm-pro .agents/skills/zm-pro   # path to this repo's inner folder
```

**Global (all your projects):**
```bash
mkdir -p ~/.config/opencode/skills
cp -r zm-pro ~/.config/opencode/skills/zm-pro
```

The skill is auto-discovered. Its body loads only when an agent invokes it — no token tax on unrelated sessions.

### Claude Code / Codex CLI

Copy `zm-pro/` into the harness skills directory (e.g., `~/.claude/skills/zm-pro`), or reference it from your project's `CLAUDE.md`/`AGENTS.md` as the procedure doc. The format is the open Agent Skills spec.

### Cursor / Gemini CLI / others

Point the agent instructions at `zm-pro/SKILL.md` (Project Rules / Context files). The router is self-describing — no harness-specific magic required.

### Updating

Re-copy the folder (`cp -r zm-pro <dest>` / `Copy-Item -Recurse -Force`), or pull and re-copy. Diffs stay readable because the kit is plain Markdown.

## Quickstart

Give your agent this prompt on a real task:

> Use the zm-pro skill. Read RULES.md and AGENTS.md first. Objective: <X>. In-scope files: <…>. Acceptance criteria: <…>. Run the verification commands and quote the real output. Don't declare success without evidence.

Or rely on the trigger description — the agent picks the track (kickoff, implement, review, deliver, privacy) and loads only what it needs.

## What zm-pro is not

- **Not a framework, not a library, not a CLI** — it's documentation-as-skill. No runtime, no network calls, no telemetry, no dependencies.
- **Not legal advice** — the privacy track produces engineering drafts and controls; legal conclusions belong to your DPO/counsel.
- **Not a substitute for your project's rules** — it defers to them by design.

## FAQ

**Does it work offline?** Yes. Everything is local Markdown.
**Does it send data anywhere?** No. It contains no executable code beyond a validator script in this repo (for contributors).
**Can I fork and adapt it?** Yes — MIT. Keep the license notice; tell your users what you changed.
**Will it work with my stack?** The rules are stack-agnostic; examples assume TypeScript/Node as a sane baseline but adapt to Python, Go, PHP, etc.
**How do I report a bad rule or a typo?** Open an issue — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Contributing & releases

See [CONTRIBUTING.md](CONTRIBUTING.md). Semver; every change via PR with the repo validator green (`npm run validate`); history in [CHANGELOG.md](CHANGELOG.md). Skill changes ship as `zm-pro` version bumps.

## License

MIT — see [LICENSE](LICENSE). Made by ZM and contributors.
