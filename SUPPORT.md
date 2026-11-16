# Support

How to get help with **zm-pro** — the Agent Skill, not the security of your own product (for that, your team + OpenAI/Anthropic/whatever org you use).

## Quick answers

- **How do I install it?** See the install matrix in the [README](README.md#install). Claude Code users: copy `zm-pro/` into `~/.claude/skills/`. Others: the same matrix covers Codex/Cursor/Gemini CLI.
- **Does performance/CI break on my stack?** The validator is stack-agnostic and zero-dependency; open an issue with the output of `npm run validate`.
- **My agent ignores the skill.** Check the harness supports skills; check the `description` in `SKILL.md` covers your task; otherwise invoke it explicitly ("use the zm-pro skill").

## Where to ask

| Need | Channel |
|---|---|
| Bug in the kit (rule wrong/broken/contradictory) | [Issues](https://github.com/leonccunha21/zm-skills/issues) |
| Feature ideas, proposals | [Issues](https://github.com/leonccunha21/zm-skills/issues) with "feat" |
| "How do I use this for X?" / discussion / showcase | [Discussions](https://github.com/leonccunha21/zm-skills/discussions) |
| Vulnerability | See [SECURITY.md](SECURITY.md) — private reporting only |

## What to include for a useful question

- Your harness + OS + Node version
- Output of `npm run validate`
- Minimal reproduction: which track you asked the agent to run and what it did

## Maintainer expectations

This is a volunteer-maintained open-source project. Responses within ~1 week are typical; faster around releases. If it's urgent and blocking a release of yours, say so — but please don't operate this kit blind: read the `reference/` your track needs first, that's what they're for.
