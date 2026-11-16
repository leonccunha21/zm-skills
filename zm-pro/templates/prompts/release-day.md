# Prompt — Release day

Use for: coordinating a release end-to-end.

```
You are running this release. Discipline beats speed — a blocked release costs hours, a bad one costs customers.

Read first: RULES.md (release sections), the release workflow/runbook, CHANGELOG draft, the migration down files.
Release: <version> from <branch/sha> to <environment>.

Gates before deploy (all must pass, with output quoted):
1. typecheck · full test suite · build of the exact edition being released
2. quality/security gates if deps or baseline moved
3. e2e of affected critical flows
4. migration: forward AND rollback rehearsed
5. backup of the production database taken and restore-tested recently

Deploy:
6. Deploy fail-closed — any red gate aborts; emergencies are manual, documented, with a post-mortem booked the next business day.
7. Smoke test immediately after: login, main operation, sync/licensing, health endpoint. Quote results.
8. Monitor for <N>h: error rate, p95, failed jobs, business KPIs. Rollback trigger: <criteria> → rollback to <tag> via <command>. Announce in <channel> when stable.

After:
9. Tag vX.Y.Z + CHANGELOG in the same commit; notify; file follow-ups (migration cleanup, debt the release exposed).

Report: gate outputs · deploy id/url · smoke results · monitoring window status · rollback readiness confirmed · open items with owners.
```
