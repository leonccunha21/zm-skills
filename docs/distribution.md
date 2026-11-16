# Distribution

> What ships, where it comes from, and what is deliberately not published. No package registry, no build step.

## Official channel

**GitHub Releases** at [leonccunha21/zm-skills/releases](https://github.com/leonccunha21/zm-skills/releases), plus a plain folder copy from the tag.

| Artifact | Contents | How to get it |
|---|---|---|
| Repository tree at `vX.Y.Z` | `zm-pro/`, docs, scripts, examples | clone or download the ZIP of the tag |
| `CHECKSUMS-vX.Y.Z.txt` | SHA-256 of every file under `zm-pro/` | attached to the release |
| `CHANGELOG.md` section | what changed and the upgrade action | in the repository |

There is **no prebuilt bundle** and nothing is compiled: the published artifact is the source tree at the tag. Verify with `node scripts/checksums.mjs --verify CHECKSUMS-vX.Y.Z.txt` ([SECURITY.md](../SECURITY.md)).

## What ships

- `zm-pro/` — the skill: router, 18 references, 16 templates, delegation prompts.
- The rest of the repository (docs, scripts, tests, CI, examples) exists for contributors and for verification; only `zm-pro/` is copied into a harness.
- The installer copies `zm-pro/` as-is; it never rewrites the skill content.

## What does not ship

- **npm:** `package.json` has `private: true` on purpose. The package is a task runner for the repo (`validate`, `test`, `checksums`, `install-skill`), not a published library. Publishing would create a second distribution channel with its own release semantics for no user benefit.
- **A hosted service, telemetry or paid integration:** none, and adding one requires an owner decision (see `docs/maintenance-policy.md`).
- **Development artifacts:** `node_modules/`, `.git/`, editor folders and local notes are excluded by `.gitignore`; the checksum manifest only lists `zm-pro/`.

## Release integrity and provenance

- **Adopted now:** SHA-256 manifest generated from the tagged tree, attached to the release, verified by the release workflow and by consumers (`--verify`).
- **Considered, not adopted:** Sigstore/GitHub artifact attestations. There is no build step and no compiled artifact today, so the manifest plus the git tag covers the same question; revisit if a bundle or build pipeline is introduced. This is a decision recorded here, not a promise.

## Community catalogs

There is no approved listing in a third-party catalog today. Statuses are recorded here with a date and a link — never claimed as "available" before it is merged. Last verified: 2026-11-16 (unauthenticated GitHub API read).

| Catalog | Status | Date | Link |
|---|---|---|---|
| Prat011/awesome-llm-skills | open (ready for review) | 2026-11-16 | [#337](https://github.com/Prat011/awesome-llm-skills/pull/337) |
| sickn33/agentic-awesome-skills | closed, not merged — maintainer asked for a self-contained submission (SKILL.md plus the referenced Markdown guides with their license) and a test of the exact submitted bundle | 2026-11-16 | [#2351](https://github.com/sickn33/agentic-awesome-skills/pull/2351) |

## Adoption signals (public, voluntary)

No telemetry is added to the skill, ever. Adoption is measured only from public, voluntary signals, dated at each reading. Refresh at each release (or monthly) and keep one dated row per reading — never claim adoption without the date and the numbers.

**How to measure (reproducible, unauthenticated GitHub API):**

```bash
curl -s https://api.github.com/repos/leonccunha21/zm-skills \
  | jq '{stars:.stargazers_count, forks:.forks_count, subscribers:.subscribers_count, open_issues:.open_issues_count}'
curl -s "https://api.github.com/repos/leonccunha21/zm-skills/issues?state=all&per_page=100" \
  | jq '[.[] | {n:.number, is_pr:(.pull_request!=null), state:.state}]'
```

| Signal | 2026-11-16 |
|---|---|
| Stars | 1 |
| Forks | 0 |
| Watchers / subscribers | 1 / 0 |
| Open issues | 0 |
| Real issues (all time) | 0 — every item in `issues?state=all` is a PR (6 owner PRs + 2 dependabot: #1, #2) |
| Catalog submissions | 1 open (#337), 1 closed not merged (#2351, see above) |
| Repository created | 2026-11-16 |

Reading: the project is ~1 day old; the signals above are a **baseline**, not traction. Growth or stagnation can only be claimed from future readings.

## Versioning and support

Tags follow SemVer; the migration table lives in [migration.md](migration.md). Only the latest minor receives fixes ([maintenance-policy.md](maintenance-policy.md)).
