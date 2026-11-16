# RULES.md — Non-negotiable gates for this repository

> Violation means PR rejected. These rules **win over** skills, catalogs and convenience.

## Product invariants

1. The kit serves **arbitrary projects**. Never reference specific companies, products, paths, SKUs or internal registries. The validator's residue check enforces this — do not weaken it.
2. Zero dependencies in the skill and its tooling: `zm-pro/` ships Markdown only; `scripts/` is Node stdlib-only (ESM). New runtime dependency or service = explicit owner decision + ADR.
3. English in the kit; pt-BR only where the locale itself is the topic (locale rules, pt-BR documentation). The two READMEs stay in sync — EN canonical.
4. Progressive disclosure is sacred: the router stays short; detail lives in `reference/`. Link, never duplicate.
5. Every reference is evaluated for license/maintenance/cost — never blindly installed.

## Process gates

6. `npm run validate` green before merge; CI runs the same command on Node 18/20/22 × ubuntu-latest/windows-latest. \
   Windows is not optional: CRLF regressions shipped in 0.4.0 because CI was Linux-only.
7. Every PR quotes real output (validator, commands). Claims without evidence are rejected.
8. Releases: semver; `CHANGELOG.md` finalized (move `[Unreleased]` → version + date); `git tag vX.Y.Z`; `npm run checksums` and attach the file to the GitHub release; `SKILL.md` version stays in sync (validator enforces it).
9. `main` protected (3 required status checks). Bypass is manual, documented and auditable.
10. Secrets/PII never in: source, commits, fixtures, logs, prompts. Sponsor links are fine; private payment credentials never in the repo.
11. Divergence between code and doc becomes an ADR under `docs/adr/` — decisions reopen by writing, never by silent override.

## Style

12. Imperative voice, short sentences, tables over prose where structure helps. No emojis in normative text; minimal in docs.
13. One concept per line; bold for the load-bearing word, not for decoration.
