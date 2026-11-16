# 09 — Delivery, Git & release

The delivery is the product. A perfect feature with no verifiable delivery is an expensive prototype.

## Unit of delivery

One **closed objective** per delivery: what changes, acceptance criteria, commands, evidence, record. Two things? Two deliveries.

## Commits and branches

- Conventional commits — `feat|fix|chore|docs|refactor|test(scope): imperative summary`
- Pathspec-scoped commits — never `git add -A` with other sessions' WIP in the tree (see `04-multi-agent`)
- One branch per delivery; small, reversible PRs. Local rebase ok; never force-push `main`
- Merge strategy decided once per repo and documented in RULES

## Pull request (see `templates/PR-TEMPLATE.md`)

Required: why (context), what (changes), how to test, risks/rollback, open items, evidence (commands + real output). Reviews answer within an agreed SLA; a PR whose checklist is not filled is not approved.

## Branching and delivery workflows

1. **Standard delivery (feature/refactor/chore):**
   - Branch off latest `main`: `git checkout -b <type>/<short-topic>`.
   - Smallest safe change: focus exclusively on the single closed objective.
   - Stage by pathspec (`git add <files>`), verify `git status`, commit with Conventional Commits message.
   - Run the gate (`npm run validate` + `npm test` or project equivalents); quote actual output in PR.
   - Merge via squash or rebase (as declared in project RULES); delete branch after merge.

2. **Hotfix / production patch:**
   - Branch from the tagged release commit (e.g. `v0.8.1`): `git checkout -b fix/<critical-bug> <tag>`.
   - Characterize bug first with a reproducing test; apply minimal fix; verify regression test passes.
   - Tag patch release (`v0.8.2`), deploy via fail-closed pipeline, and cherry-pick/rebase back to `main`.

3. **Release cut:**
   - Coordinate on blackboard (`scripts/coordinate.mjs`) to ensure all concurrent agent tasks are finished or released.
   - Update version across all required sources in a single commit (e.g. `package.json`, `SKILL.md`, `CHANGELOG.md`).
   - Create annotated tag: `git tag -a vX.Y.Z -m "release vX.Y.Z"`.

## Rollback and recovery procedure

Never deploy without an explicit rollback path declared in the PR. When an incident occurs:

1. **Declare trigger:** identify symptom meeting rollback criteria (error rate spike > X%, health check failure, broken critical user journey, corrupted data).
2. **Select rollback mechanism:**
   - *Application code regression:* `git revert <sha>` — creates a clean forward revert commit; do not rewrite published history.
   - *Configuration / feature flag:* toggle flag to off or revert configuration parameter without redeploying binaries.
   - *Database schema / migration:* run the tested down-migration script before rolling back code, or ensure migration is backward-compatible with the prior code version (two-phase rollout).
3. **Deploy rollback:** trigger release pipeline with the prior verified artifact or revert commit.
4. **Post-rollback smoke test:** verify baseline functionality returns within 5 minutes; update delivery log with incident status.

## Release

1. Semantic tag `vX.Y.Z` + `CHANGELOG.md` in the same commit (Keep a Changelog: Added/Changed/Fixed/Security)
2. Reproducible release build (lockfile, clean install); artifact named with the version
3. **Fail-closed deploy**: a red gate blocks; production deploys never bypass review — PR approval with required reviewers, green CI status checks, and a deploy trigger that refuses without both. Emergencies are manual, documented, with a post-mortem the next business day
4. **Rollback defined before deploy**: previous tag/branch + migration down + trigger criteria (error rate > X%, checkout down, bad data)
5. **Post-deploy smoke**: login, main operation, sync, licensing — minutes after deploy, in production or homologation

## Definition of done

See `templates/DEFINITION-OF-DONE.md`. Short form: typecheck clean · tests green · build(s) of affected editions OK · no secrets/PII introduced · migration with tested rollback · docs/registry updated in the same commit · evidence attached · PR approved with checklist.

## Changelog and release notes

Write for **users**, not for whoever coded it: what changes in day-to-day use, fixes with symptoms described ("fixed: totals zeroed after date filter"), breaking changes up top with the action required.

## After delivery

Update the delivery log (date, SHA, evidence, open items) and — for critical flows — announce briefly to the team channel. Critical-flow deliveries get heightened monitoring for N hours (see `10-operations`).

## Anti-patterns

- Multi-concern megacommit ("50 files changed: implement cart + refactor database + fix styling + format all")
- Blind staging with `git add -A` or `git add .` while other agents or sessions have dirty workspace files
- Force-pushing to shared branches (`git push --force`) or directly pushing unreviewed commits to `main`
- Silent breaking changes: renaming APIs, flags, or data contracts without SemVer bump and CHANGELOG warning
- Releasing a database migration without verifying its rollback script on a staging replica
- Rubber-stamp approvals ("Looks good to me" without executing tests, inspecting diff, or quoting evidence)
- "Deploy and pray": closing the session immediately after deploy without conducting a post-deploy smoke test

## Delivery checklist

### Per-PR / Change checklist
- [ ] Working tree checked with `git status` before writing; no concurrent agent conflicts (`scripts/coordinate.mjs check`)
- [ ] Single closed objective; changes scoped to the minimal safe diff
- [ ] Explicit pathspec staging used (`git add <file>`), never blanket `git add -A`
- [ ] Local gates executed (`npm run validate` + `npm test` or project equivalents) with real output quoted in PR
- [ ] Diff reviewed locally (`git diff`) before requesting review or creating commit
- [ ] No secrets, credentials, or cleartext personal data introduced in code, tests, or commit messages

### Release cut checklist
- [ ] Semver bumped in `package.json` and synchronized with `SKILL.md` marker + `CHANGELOG.md` in one commit
- [ ] User-facing notes written in `CHANGELOG.md` under the release header; breaking changes highlighted with actions
- [ ] Release integrity verified (e.g. `npm run checksums` / CI checksum manifest check)
- [ ] Rollback steps explicitly stated in the release record (mechanism, target commit/tag, trigger threshold)
- [ ] Post-deploy smoke test executed and verified within 15 minutes of deployment
