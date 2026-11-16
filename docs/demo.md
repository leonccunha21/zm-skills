# How zm-pro looks in action — the real 0.4.0 pilot

This is not a mockup. It is the actual pilot run that validated the 0.4.0 release (2026-11-16) — an empty project, no framework, no dependencies, one module delivered end to end. Commands and outputs are the real ones from the pilot's `DELIVERY-LOG.md`.

## The task

> A pure money utility: `formatBRL(centavos)` → `"R$ 1.234,56"`, and `applyDiscount(amountCents, percent)` with round-half-up. Zero dependencies, deterministic tests.

## What the agent did — and why

1. **Read the ground first.** Copied `templates/AGENTS.md` (adapted to the project's commands) and `templates/RULES.md` into the repo. The skill itself was installed at `.agents/skills/zm-pro/` — 24 files, copy-paste install.
2. **The router picked the track.** `SKILL.md` was read; the task matched the *implement* track, so only `reference/01-code-rules.md` and `02-project-standards.md` were loaded. The other 10 references stayed unloaded — progressive disclosure doing its job.
3. **Smallest safe change.** One module (`src/money.js`), one test file (`test/money.test.js`), `package.json` with `test`/`check` scripts. No build step, no dependencies.
4. **Evidence before "done"** — the exact commands, exactly as run:

```bash
node --check src/money.js        # clean
node --check test/money.test.js  # clean
node --test test/                # tests 9 · pass 9 · fail 0 · duration_ms 215
```

5. **Delivered honestly.** The delivery log lists scope, files changed, risks (none — pure module), rollback (`git reset --hard <sha>` — no data), and explicitly what was **not** tested: other Node versions, coverage beyond the listed cases, integration in a real app (expressly out of pilot scope).

## What to notice

- The agent said "not tested: …" instead of "done, trust me". That's the difference between a generator and a professional.
- The whole thing ran without a framework, a build, a package manager or a network call — plain Node and stdlib.
- The pilot consumed the kit **as a user would**, not as a maintainer.

## Run it yourself (10 minutes)

```bash
mkdir my-pilot && cd my-pilot
git init
mkdir -p .agents/skills
cp -r <zm-pro>/zm-pro .agents/skills/zm-pro
# now tell your agent:
# "Use the zm-pro skill. Objective: <your task>. Acceptance criteria: <…>. Run the checks and quote real output."
```

See `examples/minimal-project/` for a filled example of the repo shape.

## Provenance

- Pilot: `pilot-zm-pro` (local, 2026-11-16) — `DELIVERY-LOG.md`, `AGENTS.md` (filled), `RULES.md` copied from templates.
- The pilot is not published; quoting it here with its permission, in anonymized form.
