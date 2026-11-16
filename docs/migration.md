# Migration and versioning

> How zm-pro versions itself, what counts as a breaking change in a skill, and the exact steps to move between versions. Updating is a folder copy — there is no package manager and no build step.

## SemVer for a skill

The kit follows [Semantic Versioning](https://semver.org/) with its own reading: what consumers *observe* is the agent's behavior and the structure they copy, not an API.

| Bump | What it means here | Examples |
|---|---|---|
| **MAJOR** | A consumer must act for the kit to keep working | `SKILL.md` renamed/moved or frontmatter changed incompatibly; a reference deleted without replacement; router contract changed; required install path changed; a rule reversed |
| **MINOR** | New content, old content still valid | a new reference or template; a new harness route; new validator checks that pass on existing installs |
| **PATCH** | Corrections with no action required | wording, typos, clarified examples, bug fix in a script, stricter check that only catches real defects |

Consequences of a MAJOR: the previous reference is kept for one minor with a deprecation note, or its replacement is named in this file and in `CHANGELOG.md`. Silent deletion is not allowed.

## What is *not* a breaking change

- A local file you added inside the installed `zm-pro/` folder disappearing on upgrade — it was never part of the kit and stays in the backup. Keep project rules in the project, not inside the vendored skill.
- Your harness changing how it discovers skills.
- The validator adding an error that your local fork fails: the kit validates its own tree, not your fork.

## Upgrading

From the repository checkout:

```bash
node scripts/install.mjs opencode --dry-run   # installed → incoming version, files that change
node scripts/install.mjs opencode --force     # apply
```

- `--dry-run` writes nothing and shows `N unchanged, N changed, N new, N local-only`.
- `--force` moves the previous folder to `zm-pro.backup-<timestamp>` before copying; local-only files stay there.
- The new copy is staged in `zm-pro.tmp-<stamp>` and renamed into place, so a failure never leaves a half-written install presented as complete. A killed run can leave that temp folder; it is removed automatically on the next install once it is older than one hour (never one belonging to a concurrent run).
- Symlinks inside the install tree are rejected rather than followed — resolve them and re-run.
- Manual route (no Node): delete the old folder and copy the new one. Diffs stay readable because the kit is plain Markdown.

After upgrading, run the gate from the kit checkout:

```bash
npm run validate
```

## Downgrading

Allowed, but warned: `install.mjs` compares versions and prints `warning: downgrade` when the incoming version is older. There is no automatic data migration — the backup folder from the previous upgrade is the way back, and any reference the older version does not ship simply stops being routed. Downgrading is not supported when a newer release introduced a rule your project adopted (revert that rule in the project first).

## Version history and migration notes

| Version | Action required | Notes |
|---|---|---|
| 0.9.0 | none | 18 references (adds `15-ai-security.md`, `16-domain-playbooks.md`, `17-working-modes.md`, `18-stack-adapters.md`); 17 templates; validator gains severity/file:line/fix preview + `--json`; installer hardened (Unicode Windows via manual copyTree, dry-run, backup, atomic rename, `--with-tools`); CI split into jobs, actions SHA-pinned; evaluation infrastructure (no behavioral baseline published — see `EVALUATIONS.md`); two inconclusive author pilots in `docs/evaluation-results/`. |
| 0.8.1 | none | 14 references (adds `14-agent-operations.md`); 13 templates; validator checks index coverage and version sync; installer with dry-run/backup. |

Only released versions are listed. Every future entry states the action, not just the title — a changelog line that says "changed X" without telling the consumer what to do is not a migration note.

## Compatibility promises

- **Node:** `>= 18` (`engines` in `package.json`), tested on 18/20/22.
- **OS:** Linux, macOS and Windows in CI; paths with spaces and Unicode are covered by tests.
- **Network:** none of the scripts import a network module or call `fetch` — `tests/offline.test.mjs` enforces it and runs the gate with an invalid proxy.
- **Harnesses:** only OpenCode is tested end to end today; the rest are explicitly unverified — see [harness-compatibility.md](harness-compatibility.md).
