# Maturity report — 2026-11-16

> Levels are claimed only with the evidence listed. A level without evidence is marketing.

| Level | Definition | Status | Evidence |
|---|---|---|---|
| 1 — Structured | files and docs organized | **met** | router + 18 references + templates; `npm run validate` green |
| 2 — Validated | install and structure verified | **met** | installer/validator/checksums unit suites plus evaluation, coordination, docs-parity, adversarial-fixture and stack-adapter tests; installer dry-run/backup/atomic copy; every committed test file wired into `npm test` (guarded by `tests/test-wiring.test.mjs`) |
| 3 — Evaluated | agent behavior measured | **not met** | no behavioral suite or baseline report yet (`MELHORIAS.md` §7) |
| 4 — Compatible | harnesses tested end to end | **not met** | OpenCode 2.3.0 is the only tested harness; Claude/Codex/Cursor/Gemini are explicitly unverified |
| 5 — Sustainable | governance and maintenance | **partial** | `docs/maintenance-policy.md`, ADR, issue/PR templates, CI gate; no long-term track record |

## What the evidence is

```
npm run validate   → ok - zm-pro íntegro (98 files)
npm test           → tests 101 · pass 100 · fail 0 · skipped 1 (symlink — Windows)
npm run test:examples → tests 19 · pass 19 · fail 0
node scripts/parity-check.mjs → all pairs equivalent
```

## What would move the needle

1. **Level 3:** version a small evaluation suite (scenarios, acceptance criteria, comparison with and without the kit) and publish a baseline report — `EVALUATIONS.md` + `docs/evaluation-results/`.
2. **Level 4:** reproducible reports from real harnesses; each matrix cell needs version, OS, install path, observed behavior and limitations. Until then the cell stays ❓.
3. **Level 5:** at least two release cycles with the maintenance policy followed, plus issue triage history.

## Known limitations

- No behavioral evidence yet: Markdown that validates is not an agent that behaves.
- Harness compatibility is declared honestly, which means it is mostly unknown.
- The kit cannot audit your application's security, privacy or legal adequacy.
