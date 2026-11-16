# Quickstart — five minutes

> Goal: one small change delivered with evidence. If you only read one page, read this one.

## 0. Prerequisites (1 min)

```bash
git --version          # any recent git
node --version         # >= 18 (validator/installer only)
```

An authenticated AI harness (OpenCode, Claude Code, Cursor, …). The kit itself is free; your provider may not be — see the README.

## 1. Get the kit (1 min)

```bash
git clone https://github.com/leonccunha21/zm-skills.git
cd zm-skills
```

Or download the ZIP and unzip it. No package manager, no build step.

## 2. Install into your project (1 min)

From your project root, pointing at the cloned folder:

```bash
node /path/to/zm-skills/scripts/install.mjs opencode
```

That copies `zm-pro/` to `.agents/skills/zm-pro/`. Global instead: add `--global`. Claude Code: use `claude`. Other harnesses: `codex | cursor | gemini` prints the manual route. Preview first with `--dry-run`.

## 3. Ask for one small change (2 min)

In a new session:

> Use the zm-pro skill. Read `RULES.md` and `AGENTS.md` first. Objective: add a regression test for `<small bug>`. Scope: `<file>`. Run the test command and quote the real output. Don't declare success without evidence.

What good looks like: the agent reads the router, loads only the reference it needs, runs the real command, and reports files/commands/risks — or says what it could not verify.

## 4. Verify and keep (1 min)

```bash
node /path/to/zm-skills/scripts/validate.mjs   # structural gate, from the kit checkout
```

- Not convinced? Delete `.agents/skills/zm-pro/` — nothing else was installed.
- Updating? `--dry-run`, then `--force` (previous folder kept as backup).

## Troubleshooting

See [troubleshooting.md](troubleshooting.md). Still stuck? [SUPPORT.md](../SUPPORT.md).
