# Breaking changes and migration history

> The single place that lists every breaking change this project shipped, with the migration for each. Not the changelog — the changelog narrates; here you find what you must *do*.

## Current support

Latest minor only (`0.9.x`); older minors unsupported — see `docs/maintenance-policy.md`.

## History

| From → To | Breaking change | What you must do | Introduced |
|---|---|---|---|
| ≤ 0.3.x → 0.4.0 | Badge count, install docs corrected; installer requires explicit `--force` to overwrite | re-read `README.md` install section; remove silent-overwrite assumptions | 0.4.0 |
| any → current | No further breaking changes documented in this file — the kit has not removed or renamed a public artifact since 0.4.0 | follow the `Upgrade` section of `CHANGELOG.md` | — |

## How to keep this current

- A change qualifies as breaking per the SemVer table in `docs/migration.md` (consumer must act).
- The release author adds the row **in the same PR** — never retroactively.
- `CHANGELOG.md` links here under `### Upgrade` for entries that require action.
- A release with a required action that lacks a row here blocks publication (release gate: `CONTRIBUTING.md` + `docs/maintenance-policy.md`).

Today: **no pending required actions.** Zero breaking changes between 0.4.0 and the current release.
