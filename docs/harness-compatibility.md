# Harness compatibility

> This repo follows the evidence rule it teaches: **tested**, or it says so explicitly. Anything marked ❓ is documented but unverified — reports are welcome (open an issue or start a discussion).

| Harness | Version tested | Status | Date of evidence | Install mode | What it means |
|---|---|---|---|---|---|
| OpenCode | 2.3.0 · Windows 11 | ✅ **Tested end-to-end** | 2026-11-16 (pilot report recorded in this file; not re-executed for this table) | project + global | Auto-discovered from `.agents/skills/zm-pro` (project) and `$XDG_CONFIG_HOME/opencode/skills/zm-pro` (global, default `~/.config/opencode/skills/zm-pro`). Used by the 0.4.0 pilot — router picked the right track, 9/9 tests green, zero extra context loaded. |
| Claude Code | — | ❓ Not verified | — | — | Copy `zm-pro/` into `~/.claude/skills/zm-pro` (or reference it from your `CLAUDE.md`/`AGENTS.md`). Works by spec; nobody has reported back yet. |
| Codex CLI | — | ❓ Not verified | — | — | Same delivery shape; treat as a referenced procedure doc until proven. |
| Cursor | — | ❓ Not verified | — | — | No skills directory: point Project Rules at `zm-pro/SKILL.md`, or paste the router as context. |
| Gemini CLI | — | ❓ Not verified | — | — | Same; report what happens. |
| Any harness implementing the open Agent Skills format | — | 🔬 Expected to work | — | — | Frontmatter + body; report failures as issues. |

## What "tested" decomposes into

A harness is a matrix of capabilities, not a yes/no. Status per capability (✅ evidence / ❓ untested):

| Capability | OpenCode 2.3.0 | Claude Code | Codex CLI | Cursor | Gemini CLI |
|---|---|---|---|---|---|
| Discovery of the skill folder | ✅ project + global (pilot) | ❓ | ❓ | ❓ rules-only route documented | ❓ |
| Router read (`SKILL.md` loaded) | ✅ pilot | ❓ | ❓ | ❓ | ❓ |
| Minimal reference load (no guide preload) | ✅ pilot — 2 references loaded | ❓ | ❓ | ❓ | ❓ |
| Task execution (evidence before done) | ✅ pilot — 9/9 tests green | ❓ | ❓ | ❓ | ❓ |
| Respect for project `RULES.md` over kit | ✅ pilot — local rule respected | ❓ | ❓ | ❓ | ❓ |
| Uninstall = delete the folder | ✅ verified locally (installer tests) | ❓ | ❓ | ❓ | ❓ |
| On-demand loading (lazy references) | ✅ native skills mechanism | ❓ (rules-only = always on) | ❓ | ❓ (always on) | ❓ (always on) |

Only cells with ✅ carry evidence; every ❓ stays a promise to test, never a claim.

## Behavioral evaluation pilots (uncontrolled, 2026-11-16)

Two single-run pilots were executed with `scripts/evaluate-run.mjs` on **opencode/inkling-2-small-free** — the weakest configuration available; both were recorded in `docs/evaluation-results/` and neither counts as a baseline:

- `eval-001` (bugfix task) — the agent planned, never invoked a tool, session ended. `pilot-eval-001.md`.
- `eval-012` (typo trap) — the agent emitted a literal `<tool_call>` tag as text and stopped. `pilot-eval-012.md`.

**What these show:** the evaluation pipeline works (argv delivery, transcript, scaffold); this model cannot drive the tool loop on this harness. **What they do not show:** anything about kit quality — the agent never reached the phase where the kit matters. OpenCode 2.3.0 remains "tested" for installation and skill discovery; agentic task execution on this model is unproven.

## Reproducible test script

Run this in a scratch project — never in a production repository:

1. **Install** — `node scripts/install.mjs opencode --dir .` (or the copy route in the README).
2. **Add one local rule** — a `RULES.md` with a line the kit must respect, e.g. "use tabs for indentation".
3. **Ask for one small task** — "Use the zm-pro skill. Add a unit test for `<function>`. Do not touch other files. Run the test command and quote the real output."
4. **Observe** — did the agent find the router, load only the needed `reference/` files, respect your local rule over the kit, run real commands (no invented ones), and state what it could not verify?
5. **Report** — open a [harness compatibility report](https://github.com/leonccunha21/zm-skills/issues/new?template=harness_report.md) with version, OS, install path, observation and output. Remove secrets, customer data and private paths first.

A pass means all five observables happened; a partial pass is still useful — say which one failed.

## Three routes to universal coverage (and what each is proven to do)

No skill copies itself into every harness with the same effect. There are three delivery routes; each is documented and has different evidence status:

| Route | Harnesses | Mechanism | Status |
|---|---|---|---|
| **Native skills folder** | OpenCode | `.agents/skills/zm-pro/` auto-discovery | ✅ tested end to end here (docs/evaluation-results/, harness 2.3.0) |
| **Rules / project instructions file** | Claude Code (`CLAUDE.md`), Codex CLI (AGENTS.md), Cursor (Project Rules), Gemini CLI (context file) | router pasted or referenced; loads every session | ⚠️ documented route; unverified per-vendor here |
| **Plain context inclusion** | any chat/CLI | paste `zm-pro/SKILL.md` inline | ✅ universally possible; loses on-demand routing (guides don't auto-load) |

**"Works for everyone" means:** a documented route exists for every harness, the router is readable by all three routes, and each tier's evidence is stated — not that every combination was executed. Tier 1 = tested end to end; Tier 2 = documented route, unverified; Tier 3 = unknown (report required).

## How to contribute evidence

If you used this table, we want to hear from you — win or lose:

1. Harness + version + OS (exact)
2. The install steps you followed (copy path, global/project)
3. Output of whatever verification you ran (e.g. `npm run validate`, `node --test`)
4. What worked, what didn't, what was confusing

File it as an **issue** (bug) or a **discussion** (experience report). Verified results update the table, credited if you want.

## Why a table instead of a badge

"Works everywhere" is a claim nobody tested. A table with versions and dates is a guarantee you can verify — that is the entire point of this repository.
