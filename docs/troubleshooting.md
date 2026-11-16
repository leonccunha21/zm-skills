# Troubleshooting

> Symptom first. If the table does not cover it, open an issue with the exact harness/version/OS and the commands you ran (see [SUPPORT.md](../SUPPORT.md)).

## The skill is not discovered

| Harness | Project path | Global path | Notes |
|---|---|---|---|
| OpenCode | `.agents/skills/zm-pro/` | `~/.config/opencode/skills/zm-pro/` (or `$XDG_CONFIG_HOME`) | Tested with 2.3.0; restart the session after copying |
| Claude Code | `.claude/skills/zm-pro/` | `~/.claude/skills/zm-pro/` | Unverified — [report what happens](harness-compatibility.md) |
| Codex / Cursor / Gemini | — | — | No standard skills folder; point the context/rules at `zm-pro/SKILL.md` |

Check: the folder is named `zm-pro`, `SKILL.md` is at its root, frontmatter starts with `---` and contains `name: zm-pro`. A renamed folder or a missing frontmatter is silently ignored by most harnesses.

## The agent ignores the skill

- Invoke it explicitly: "Use the zm-pro skill; read `RULES.md` and `AGENTS.md` first."
- If the project has its own `AGENTS.md`/`RULES.md`, that is expected — they win over the kit.
- Confirm the harness loads Agent Skills at all; a chat-only harness needs the router pasted into context.

## `npm run install-skill` fails

- npm swallows the harness unless you pass `--`: `npm run install-skill -- opencode`.
- `unknown harness` → use `opencode | claude | codex | cursor | gemini`.
- `harness required` → the argument is missing (the error prints the correct form).
- `Node >= 18` is required; check `node --version`.

## Installation and upgrade

- Preview: `node scripts/install.mjs opencode --dry-run` (prints versions and changed files, writes nothing).
- Update: add `--force`; the previous folder is kept as `zm-pro.backup-<timestamp>`.
- Rollback: delete the new folder and rename the backup back to `zm-pro`.
- Uninstall: delete the folder. Nothing else is installed.

## Windows specifics

- Use PowerShell: `Copy-Item -Recurse -Force zm-pro .agents\skills\zm-pro`.
- Quote paths with spaces; the scripts handle spaces and unicode.
- CRLF is fine; the validator and tests cover it.
- If `npm` is blocked by execution policy, run `node scripts/…` directly.

## Validator says no

| Message | Meaning | Fix |
|---|---|---|
| `link quebrado` | relative link or image points nowhere | fix the path (use `%20` for spaces) |
| `âncora não encontrada` | heading anchor drifted | update the `#slug` or the heading |
| `não indexado no SKILL.md` | published guide/template has no trigger | add it to the reference/template index |
| `resíduo específico de projeto` | internal name leaked into `zm-pro/` | remove it from the skill |
| `não menciona a versão atual` | router version out of sync | bump `zm-pro vX.Y.Z` in `SKILL.md` |
| `versão mais recente … ≠ package.json` | changelog not finalized | add the matching `## [X.Y.Z]` section |

## Checksums

Generate with the silent form: `npm run --silent checksums > CHECKSUMS-<tag>.txt` (npm's banner corrupts the file otherwise). Verify with `node scripts/checksums.mjs --verify CHECKSUMS-<tag>.txt`.

## Offline and privacy

The kit is local Markdown; the installer, validator and checksums run offline and make no network calls. Your harness/model may be online — that is outside the kit. Nothing in the kit collects telemetry.
