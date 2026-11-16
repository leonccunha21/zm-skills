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

## Delivery checklist

- [ ] Bump semver in `package.json` and sync `SKILL.md` marker + `CHANGELOG.md` — in one commit (`npm run validate` enforces sync)
- [ ] Tests and examples green with output quoted — not remembered
- [ ] No mixing of unrelated changes in the diff; pathspec commit; diff re-read before merge
- [ ] Reviewer named; review script (not rubber stamp) or explicit self-approval recorded
- [ ] Release notes say what action consumers must take, or "no action"
- [ ] Rollback path stated in the PR, not improvised during the incident
