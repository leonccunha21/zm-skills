# Definition of Done

> Applies to every delivery in the project. "Done" without the items below is WIP with good manners.

## Code

- [ ] Problem reproduced/understood; change **minimal and safe**; no silent scope creep
- [ ] Typecheck clean; lint clean; test suite green (output quoted in the delivery)
- [ ] Regression test included when a seam existed; cross-account denial test when auth/RLS was touched
- [ ] No unjustified `any`, empty `catch`, stray debug logs or commented-out checks
- [ ] Migration (if any) with tested rollback; soft-delete/tombstone where history exists

## Quality & security

- [ ] Secret scan clean; no PII in code, fixtures, logs or new screenshots
- [ ] Server-side per-resource authorization reviewed (another tenant/account → denied)
- [ ] New dependencies justified (existence, license, maintenance, cost, weight)
- [ ] Security headers/CSP/sessions/CORS not regressed; failure stays fail-closed

## Verification (evidence attached)

- [ ] `<typecheck command>` — output
- [ ] `<test command>` — output
- [ ] `<build command(s)>` — output
- [ ] `<e2e command>` — output (mandatory when UI/commercial flow/sync/licensing/offline changed)
- [ ] Smoke test in `<environment>` (mandatory for releases)

## Traceability

- [ ] Conventional commits, pathspec-scoped
- [ ] Delivery log updated (date, SHA, evidence, open items) in the same commit/PR
- [ ] Items blocked on real environments/business decisions recorded as open items
- [ ] Docs/ADRs updated if decisions changed; CHANGELOG updated if users are affected
- [ ] PR with the template filled; human review approved; gates green
- [ ] Nothing marked "done" without its verification — "not tested" is said explicitly
