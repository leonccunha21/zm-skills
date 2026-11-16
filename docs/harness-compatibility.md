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

## How to contribute evidence

If you used this table, we want to hear from you — win or lose:

1. Harness + version + OS (exact)
2. The install steps you followed (copy path, global/project)
3. Output of whatever verification you ran (e.g. `npm run validate`, `node --test`)
4. What worked, what didn't, what was confusing

File it as an **issue** (bug) or a **discussion** (experience report). Verified results update the table, credited if you want.

## Why a table instead of a badge

"Works everywhere" is a claim nobody tested. A table with versions and dates is a guarantee you can verify — that is the entire point of this repository.
