## Summary

<!-- What changes and why, in 3–5 lines. For long context, link the ADR/issue. -->

## Type of change

- [ ] feat (new capability)  - [ ] fix (bugfix)  - [ ] refactor (no behavior change)
- [ ] chore/docs/build/ci    - [ ] security      - [ ] breaking change (detail below)

## How to test

```
<!-- exact steps, minimal setup -->
1.
2.
3.
```

- [ ] Verified at 360px and desktop widths
- [ ] Keyboard + screen reader (or axe) without regressions

## Verification run (real output)

<!-- typecheck, tests, build(s), e2e, gates — no silent "OK" -->

## Evidence

<!-- screenshot/video with synthetic data, command output, CI link -->

## Risks and rollback

- Risk: <…>
- Rollback: <previous tag/branch / migration down / flag>
- Data/migration impact: <none | migration NNNN, down tested>

## Open items

<!-- what stays for later, with owner; what depends on real environments -->

## Author checklist

- [ ] `RULES.md` and `AGENTS.md` respected; RULES wins in conflicts
- [ ] No secrets/PII; synthetic fixtures; secret scan clean
- [ ] Server-side per-resource authorization reviewed — if data was touched
- [ ] Migration with tested rollback — if schema was touched
- [ ] Delivery log / CHANGELOG / docs updated in the same PR
- [ ] `DEFINITION-OF-DONE.md` completed
- [ ] UI changes: the four states (empty/loading/error/success) implemented

## Reviewer checklist

- [ ] Whole diff reviewed, not only the "important" files
- [ ] Gates green in CI; evidence matches the diff
- [ ] Scope did not expand beyond the PR objective
