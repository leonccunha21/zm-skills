# Release notes — v<X.Y.Z>

> Copy to the release PR or the changelog entry. Users should understand impact without reading the diff.

## Summary

<!-- One paragraph: what this release changes for the people using it. -->

## Changes

- **Added:** <new capability — who benefits>
- **Changed:** <behavior change — what to expect>
- **Fixed:** <bug — symptom before/after>
- **Security:** <hardening, without exploit details>

## Breaking changes and migration

| Change | Who is affected | Migration |
|---|---|---|
| <removed/renamed config or API> | <consumers> | <exact steps, before/after> |

- [ ] Migration tested from every supported version
- [ ] Downgrade path documented (or explicitly unsafe, with reason)

## Verification

```
<commands run and real output: tests, build, smoke, checksum verify>
```

## Rollback plan

- **Trigger:** <error rate, failed smoke test, data corruption>
- **Action:** <previous tag/flag/migration down>
- **Data impact:** <none | writes between deploy and rollback>

## Known limitations

<!-- What still does not work, with owner and review date. Silence here is a lie. -->
