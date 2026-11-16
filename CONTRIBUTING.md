# Contributing to zm-pro

Thanks for helping make this the reference skill for professional project work. This file tells you how to change it **without breaking the thing it teaches**.

## Ground rules

1. **One source of truth per fact.** A rule lives in exactly one file. `SKILL.md` routes and links; it never duplicates the body of a reference.
2. **Progressive disclosure is sacred.** The router stays short (< ~100 lines). Detail goes to `reference/`; if a branch of work needs it, put a pointer in `SKILL.md` with the trigger, don't inline the whole guide.
3. **English in the kit; pt-BR only where it is the point** (e.g., Brazilian locale rules, microcopy guidance). Keep bias-free, globally usable language.
4. **No ZM-specific, company-specific or project-specific residue.** The kit serves arbitrary projects. Internal paths, product names and team registries don't belong here.
5. **Reference ≠ dependency.** Never add a dependency, runtime, service or network call to the skill. The validator must stay zero-dependency Node (`node scripts/validate.mjs`).
6. **Evidence and honesty.** Claims about behavior need a reproducible check. "Docs say X" is not a test; if you couldn't verify it, say so in the PR.

## Before you change anything

- Open an issue first for non-trivial changes (new reference, restructured router, renamed file) — conversation is cheap; reverting is not.
- Small fixes (typos, broken links, stale commands) can go straight to a PR.

## How to change

1. Fork or branch `main`.
2. Edit inside `zm-pro/` (the skill) or repo meta files (README, this file, CI…).
3. Run the validator:

   ```bash
   npm run validate
   ```

   It checks: frontmatter shape, required files, reference integrity, and forbidden project-specific residue. **It must pass.**
4. Update `CHANGELOG.md` under a new version heading (semver: breaking = MAJOR, new = MINOR, fixes = PATCH).
5. Update the README badges/version if you bump versions.
6. Fill the PR template. A maintainer reviews with the same discipline the kit teaches — because we review with the kit.

## Style guide

- Imperative voice, short sentences, tables over prose where structure helps.
- Every rule states a **completion criterion** when it's a procedure ("green output quoted", "all four states implemented").
- Prefer verifiable statements ("exits non-zero on red gate") over vibes ("high quality").
- No emojis in normative text; minimal in docs.
- One concept per line; bold for the load-bearing word, not for decoration.

## What we will not merge

- New runtime dependencies or network calls in the validator (zero-dep is a feature)
- Project- or company-specific references (paths, SKUs, internal registries)
- Rules that can't be checked or at least observed
- Marketing, self-promotion, or vendor pay-to-play recommendations
- Weakening of safety defaults (secrets handling, fail-closed deploys, no-PII-in-fixtures) without a documented, strong justification + migration path

## Releases

Maintainers cut releases: bump `version` in `package.json`, finalize `CHANGELOG.md`, tag `vX.Y.Z`, create the GitHub release with the changelog section. Consumers update with a plain folder copy — no package manager involved.

## Code of conduct

Be direct and kind. Critique work, not people. Assume good faith; verify claims. Harassment of any kind results in removal from the project.
