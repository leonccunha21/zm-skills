# ADR 0001 — Tooling contract: validator, installer and checksums

- **Status:** accepted — 2026-11-16
- **Deciders:** maintainer
- **Scope:** `scripts/`, `tests/`, release workflow

## Context

The kit ships Markdown plus three zero-dependency Node scripts. Contributors and consumers need three guarantees: the published skill is structurally sound, installing never destroys local work, and a downloaded release can be verified. The repository rules (zero dependencies, fail-closed gates, evidence before claims) constrain the options.

## Decision

1. **The validator is the structural gate.** `scripts/validate.mjs` exits non-zero on any error and supports `--json` for machines. It checks repository shape, frontmatter, index coverage, relative links/images/anchors (outside fenced code), project-specific residue, and version sync across `package.json`, `SKILL.md`, `CHANGELOG.md`, README badges and `SECURITY.md`.
2. **The installer is fail-closed.** An existing destination requires `--force`. `--dry-run` prints installed → incoming versions and the file plan without writing. `--force` keeps the previous folder as `zm-pro.backup-<timestamp>`, and the copy goes to a temp folder followed by a rename, so a failed run never presents a half-written install as complete.
3. **Integrity is verifiable, not asserted.** `scripts/checksums.mjs` emits a SHA-256 manifest; `--verify` recomputes it, rejects missing/extra files under `zm-pro/` and paths outside the repository. The release workflow runs validate + tests + verify before publishing.
4. **Tests use only `node:test`.** Fixtures are synthetic and live in the OS temp directory; no network, no credentials, no third-party runner.
5. **Heuristics are documented test cases.** Anchor slugs and fenced-code handling are heuristics of GitHub-flavored Markdown; each behavior has a unit test so a regression is visible.

## Consequences

- A red gate blocks merge and release — the only bypass is the documented manual one in `RULES.md`.
- Anchor/heading slug rules may need updating if GitHub changes behavior; the test suite makes that cheap.
- Zero dependencies stay true: CI installs nothing (`npm ci` is unnecessary).
- The installer cannot silently overwrite; upgrading is two explicit steps (`--dry-run`, then `--force`).

## Alternatives rejected

- **External linters/formatters** — they would add dependencies and network failure modes for checks that are cheap in ~200 lines.
- **Silent overwrite on install** — data loss for anyone who edited the vendored copy; contradicts RULES.md.
- **Verifying releases by checksum generated at download time** — circular; the manifest must come from the tagged source and be attached to the release.
