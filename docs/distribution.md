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

There is no approved listing in a third-party catalog today. If one is opened, its status is recorded here with a date and a link — never claimed as "available" before it is merged.

| Catalog | Status | Date | Link |
|---|---|---|---|
| — | none opened | — | — |

## Versioning and support

Tags follow SemVer; the migration table lives in [migration.md](migration.md). Only the latest minor receives fixes ([maintenance-policy.md](maintenance-policy.md)).
