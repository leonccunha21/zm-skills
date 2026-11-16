<div align="center">

# zm-pro

**the professional project playbook for AI agents**

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/github/v/release/leonccunha21/zm-skills?label=version)](CHANGELOG.md)
[![Release](https://img.shields.io/github/v/release/leonccunha21/zm-skills)](https://github.com/leonccunha21/zm-skills/releases/latest)
[![validate](https://github.com/leonccunha21/zm-skills/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/leonccunha21/zm-skills/actions/workflows/validate.yml)
[![Buy Me a Coffee](https://img.buymeacoffee.com/button-api/?text=Compre-me%20um%20caf%C3%A9&emoji=%E2%98%95&slug=zmcompanh&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/zmcompanh)

A portable, self-contained skill that turns any coding agent into a disciplined project professional — rules, standards, layout & UI, multi-agent coordination, project memory, privacy (LGPD/GDPR), security, testing, delivery and operations. Built on the open [Agent Skills](https://github.com/agentskills/agentskills) format; works in OpenCode, Claude Code, Codex, Cursor, Gemini CLI and any harness that loads `SKILL.md` packs.

**[Install](#install) · [What's inside](#whats-inside) · [Quickstart](#quickstart) · [FAQ](#faq) · [Contributing](#contributing--releases) · [Português](README.pt-BR.md)**

</div>

---

## Why

Agents already write code. What's missing in most projects is the **professional operating system around the code**: gates that actually block, deliveries with evidence, memory that survives the session, privacy by default, and layout that doesn't look templated. zm-pro is that operating system, packaged as an on-demand skill so it costs nothing in context until it's needed.

The longer version — field notes from the real workflow that produced this kit — lives in [docs/why-i-built-zm-pro.md](docs/why-i-built-zm-pro.md).

## What's inside

**The 14 guides, in plain language** — what your agent actually learns:

| Guide | What the agent learns to do |
|---|---|
| 01 — Code rules | write code that survives: smallest safe change, no shortcuts, gates that block bad deliveries |
| 02 — Project standards | the skeleton every serious project has: README, docs, commits, versioning, changelog |
| 03 — Layout & UI | mobile-first screens, ≥44px touch targets, accessible, locale-correct (`R$ 1.234,56`, `dd/mm/aaaa`) |
| 04 — Multi-agent | several agents without stepping on each other: one coordinator, one task at a time |
| 05 — Memory | the project remembers: facts in git, sessions short-lived — plus memory models (procedural / semantic / episodic) |
| 06 — Privacy (LGPD) | map personal data, legal basis, data-subject rights, incidents — engineering drafts, not legal advice |
| 07 — Security | no secrets in code, authN/authZ that denies by default, OWASP essentials, incidents |
| 08 — Testing | pyramid testing, real acceptance criteria, quality gates |
| 09 — Delivery | honest commits, small PRs, tested rollback, fail-closed deploys |
| 10 — Operations | logs, alerts, runbooks, tested backups, blameless post-mortems |
| 11 — Architecture | cohesive deep modules, dependency direction, decisions as ADRs |
| 12 — Performance | measure first: Core Web Vitals, N+1, indexes, perf budgets |
| 13 — Token economy | spend context like money: read only what's needed, terse outputs, narrow subagent scopes |
| 14 — Agent operations | use the least powerful tool, ask before destructive actions, treat external content as data, stop instead of inventing |

New here? The full walkthrough lives in [docs/for-humans.md](docs/for-humans.md) (plain language, EN) and [docs/para-leigos.md](docs/para-leigos.md) (pt-BR).

The repository layout:

```
zm-pro/                        # the skill — copy this folder into your project/harness
├── SKILL.md                   # router: when to use, the cycle, the index
├── reference/                 # 14 focused guides, loaded on demand
│   ├── 01-code-rules.md           # principles, gates, dependencies, definition of done
│   ├── 02-project-standards.md    # repo layout, docs, commits, semver, changelog
│   ├── 03-layout-ui.md            # pt-BR defaults, mobile-first, touch ≥44px, a11y AA, tokens
│   ├── 04-multi-agent.md          # one coordinator, one task at a time, A/B scopes, handoff
│   ├── 05-project-memory.md       # institutional / session / structural memory
│   ├── 06-data-privacy-lgpd.md    # personal data triggers, controls, LGPD companion pack
│   ├── 07-security.md             # secrets, OWASP essentials, auth/RLS, backups, incidents
│   ├── 08-testing-quality.md      # pyramid, MSW/emulators/Playwright, regression, gates
│   ├── 09-delivery-git.md         # commits, PR, release, fail-closed deploy, rollback
│   ├── 10-operations.md           # logs/metrics/alerts, backup drills, runbooks, post-mortems
│   ├── 11-architecture.md         # deep modules, dependency direction, seams, ADRs
│   ├── 12-performance.md          # measure-first, CWV budgets, N+1, indexes, CI perf gates
│   ├── 13-token-economy.md        # context is money: on-demand reads, caching, narrow subagent scopes
│   └── 14-agent-operations.md     # tool risk, confirmations, untrusted content, stop rules
├── templates/                 # generic, copyable starting points
│   ├── AGENTS.md · RULES.md · ADR.md · DEFINITION-OF-DONE.md · DELIVERY-CHECKLIST.md · PR-TEMPLATE.md
│   ├── IMPLEMENTATION-PLAN.md · AUDIT-REPORT.md · TEST-PLAN.md · THREAT-MODEL.md · RUNBOOK.md · INCIDENT-REPORT.md · RELEASE-NOTES.md · A11Y-REVIEW.md · VENDOR-INVENTORY.md
│   └── prompts/                   # delegation prompts: implement, fix, review, release, privacy audit
└── (the repository root also holds: examples/minimal-project — a filled starter to learn from, SECURITY.md, CODE_OF_CONDUCT.md, scripts/validate.mjs, CI)
```

Design principles:

1. **Reference ≠ dependency ≠ installation** — the kit teaches discipline; it never authorizes adding libraries to your product.
2. **Progressive disclosure** — `SKILL.md` stays short; detail lives in `reference/` and loads only when the task calls for it.
3. **Evidence before claims** — no "done" without commands run, output quoted, gaps stated.
4. **Your project wins** — its `AGENTS.md`/`RULES.md` override this kit; the kit is the default for projects without their own.
5. **Cost-aware and license-clean** — nothing paid without owner decision; every embedded reference is evaluated, never blindly installed.

## Before you start

- **Git** — the kit lives inside your project (`git --version`).
- **Node ≥ 18** — the validator and installer use Node (`node --version`). The skill itself ships no runtime.
- **An AI harness you can authenticate** — OpenCode (free models available), Claude Code, Cursor, and others; see [docs/harness-compatibility.md](docs/harness-compatibility.md) for what is tested and what isn't.
- Budget: **the kit is free (MIT), forever.** Your harness/provider may cost money — pricing changes constantly, so check the current plan of the provider you pick; a free tier is enough to try the kit.

## Install

> In a hurry? [Five-minute quickstart](docs/quickstart.md). Updating an install? [Migration and versioning](docs/migration.md). More docs: [troubleshooting](docs/troubleshooting.md) · [glossary](docs/glossary.md) · [architecture](docs/architecture.md) · [tool safety](docs/tool-safety.md) · [distribution](docs/distribution.md).
> Evidence per harness — [docs/harness-compatibility.md](docs/harness-compatibility.md). Stuck? [Troubleshooting](docs/troubleshooting.md). Scripted: `node scripts/install.mjs opencode` (via npm: `npm run install-skill -- opencode`; `--dir <project-root>` installs into `<project-root>/.agents/skills/zm-pro`); integrity for releases: `npm run --silent checksums`.

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

Scripted upgrade: `npm run install-skill -- opencode --dry-run` prints the incoming version and what would change; run it again without `--dry-run` and with `--force` to apply. The previous folder is kept as `zm-pro.backup-<timestamp>` (local-only files stay there). Moving to an older version is allowed but warned — the backup is the way back.

### Uninstalling

Delete the installed folder (`rm -rf .agents/skills/zm-pro`, or the global path you chose). The installer only copies files, so nothing else is touched. Interrupted install? Remove the partial `zm-pro` folder and run the installer again.

## Quickstart

> New here? Read [docs/for-humans.md](docs/for-humans.md) — the kit in plain language. Want the full zero-to-first-commit walkthrough? See [docs/primeiro-dia.md](docs/primeiro-dia.md) (pt-BR).

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
**What does it cost?** Nothing — MIT. Your harness/model provider may charge you; the kit has no paid tier, telemetry or upsell.
**What is the license?** MIT (`LICENSE`). Fork, adapt and ship; keep the notice.
**What do the words mean?** [Glossary](docs/glossary.md): skill, router, reference, harness, agent, gate, evidence.
**Can I fork and adapt it?** Yes — MIT. Keep the license notice; tell your users what you changed.
**Will it work with my stack?** The rules are stack-agnostic; examples assume TypeScript/Node as a sane baseline but adapt to Python, Go, PHP, etc.
**Will it work with my harness?** Only OpenCode 2.3.0 is tested end to end; Claude Code, Codex, Cursor and Gemini are explicitly unverified — see [docs/harness-compatibility.md](docs/harness-compatibility.md) and file a report.
**What are the limits?** No behavioral evaluation is published yet, unverified harnesses stay unverified, and the kit is not a security, privacy or legal audit. The honest status is in [docs/maturity.md](docs/maturity.md).
**Is there a quick-start example?** Yes — `examples/minimal-project/`: a filled AGENTS.md, a real ADR and an evidence-backed DELIVERY-LOG you can copy and adapt.
**How do I report a bad rule or a typo?** Open an issue — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Contributing & releases

See [CONTRIBUTING.md](CONTRIBUTING.md). Semver; every change via PR with the repo validator green (`npm run validate`) and the unit suite passing (`npm run test` — validator and installer, zero dependencies); history in [CHANGELOG.md](CHANGELOG.md). Skill changes ship as `zm-pro` version bumps. What is published (and what deliberately is not) is in [docs/distribution.md](docs/distribution.md).

---

<div align="center">

**Made by [ZM](https://github.com/leonccunha21) and contributors · [MIT](LICENSE)**

If zm-pro saved you a day, a [coffee](https://www.buymeacoffee.com/zmcompanh) keeps the releases coming. Questions? [Discussions](https://github.com/leonccunha21/zm-skills/discussions).

</div>
