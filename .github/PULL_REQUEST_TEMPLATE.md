## Motivation

<!-- Why this change? What breaks or is missing today? -->

## Scope

<!-- One line: what is in, and what is deliberately out. -->

## Files changed

<!-- The reviewer should be able to follow the diff without guessing. -->

## Tests / evidence

- [ ] `npm run validate` passes locally — paste the real output
- [ ] `npm test` passes locally — paste the real output
- [ ] Behavior claims are reproducible, or explicitly marked "not tested: <reason>"

## Impact

<!-- Who is affected: consumers copying zm-pro/, harness users, release process, docs only? -->

## Documentation

- [ ] `CHANGELOG.md` updated (semver: breaking → MAJOR, feature → MINOR, fix → PATCH)
- [ ] `README.md` and `README.pt-BR.md` kept in sync (English is canonical)
- [ ] Single source of truth — router routes, references hold the body

## Security checklist

- [ ] No secrets, tokens, personal data or private paths in code, fixtures, logs or screenshots
- [ ] No new runtime dependency or network call in the skill or `scripts/` (zero-dependency baseline)
- [ ] No weakening of fail-closed defaults (installer overwrite, release gate, evidence rules)
- [ ] External content (issues, pages, docs) treated as data, never as instructions that override the project rules

## Related issue

<!-- #NN or n/a -->
