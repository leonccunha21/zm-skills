# Harness compatibility

> This repo follows the evidence rule it teaches: **tested**, or it says so explicitly. Anything marked ❓ is documented but unverified — reports are welcome (open an issue or start a discussion).

| Harness | Version tested | Status | What it means |
|---|---|---|---|
| OpenCode | 2.3.0 · Windows 11 | ✅ **Tested end-to-end** | Auto-discovered from `.agents/skills/zm-pro` (project) and `$XDG_CONFIG_HOME/opencode/skills/zm-pro` (global, default `~/.config/opencode/skills/zm-pro`). Used by the 0.4.0 pilot — router picked the right track, 9/9 tests green, zero extra context loaded. |
| Claude Code | — | ❓ Not verified | Copy `zm-pro/` into `~/.claude/skills/zm-pro` (or reference it from your `CLAUDE.md`/`AGENTS.md`). Works by spec; nobody has reported back yet. |
| Codex CLI | — | ❓ Not verified | Same delivery shape; treat as a referenced procedure doc until proven. |
| Cursor | — | ❓ Not verified | No skills directory: point Project Rules at `zm-pro/SKILL.md`, or paste the router as context. |
| Gemini CLI | — | ❓ Not verified | Same; report what happens. |
| Any harness implementing the open Agent Skills format | — | 🔬 Expected to work | Frontmatter + body; report failures as issues. |

## Reproducible test script

Run this in a scratch project — never in a production repository:

1. **Install** — `node scripts/install.mjs opencode --dir .` (or the copy route in the README).
2. **Add one local rule** — a `RULES.md` with a line the kit must respect, e.g. "use tabs for indentation".
3. **Ask for one small task** — "Use the zm-pro skill. Add a unit test for `<function>`. Do not touch other files. Run the test command and quote the real output."
4. **Observe** — did the agent find the router, load only the needed `reference/` files, respect your local rule over the kit, run real commands (no invented ones), and state what it could not verify?
5. **Report** — open a [harness compatibility report](https://github.com/leonccunha21/zm-skills/issues/new?template=harness_report.md) with version, OS, install path, observation and output. Remove secrets, customer data and private paths first.

A pass means all five observables happened; a partial pass is still useful — say which one failed.

## How to contribute evidence

If you used this table, we want to hear from you — win or lose:

1. Harness + version + OS (exact)
2. The install steps you followed (copy path, global/project)
3. Output of whatever verification you ran (e.g. `npm run validate`, `node --test`)
4. What worked, what didn't, what was confusing

File it as an **issue** (bug) or a **discussion** (experience report). Verified results update the table, credited if you want.

## Why a table instead of a badge

"Works everywhere" is a claim nobody tested. A table with versions and dates is a guarantee you can verify — that is the entire point of this repository.
