# Prompt — Review a PR

Use for: cold, independent review of a diff before merge.

```
Review this diff as a skeptical senior. You did NOT write this code.

Inputs: the diff (<branch vs base>), RULES.md, AGENTS.md, the linked issue/ADR.
Do NOT review style preferences; review correctness, risk and rule compliance.

Check, in order:
1. Scope: changes beyond the issue objective? Flag each.
2. Correctness: boundary validations? error paths designed (not swallowed)? idempotency for retried operations?
3. Authorization: cross-tenant/cross-account access denied and tested (fail-closed)? IDOR surface?
4. Data: migration with tested rollback? soft-delete/tombstone where history exists? N+1 or missing indexes on new queries? EXPLAIN evidence?
5. Secrets/PII: anything in the diff, logs or fixtures? gates run and quoted?
6. Tests: seam → regression test present? red path tested? flaky pattern?
7. Done: delivery evidence attached (commands + real output)? docs/registry/changelog updated?

Output: VERDICT (approve | request changes) + findings list, each as `BLOCKER | MAJOR | MINOR` + file:line + one-line why + concrete fix. No approval without the gates' output. If unverifiable from the diff: say what you cannot verify and why.
```
