# Maturity report — 2026-11-16

> Levels are claimed only with the evidence listed. A level without evidence is marketing.

| Level | Definition | Status | Evidence |
|---|---|---|---|
| 1 — Structured | files and docs organized | **met** | router + 18 references + templates; `npm run validate` green |
| 2 — Validated | install and structure verified | **met** | `tests/install.test.mjs` (12 cases), `tests/validate.test.mjs` (15), `tests/checksums.test.mjs` (8); installer dry-run/backup/atomic copy |
| 3 — Evaluated | agent behavior measured | **not met** | no behavioral suite or baseline report yet (`MELHORIAS.md` §14) |
| 4 — Compatible | harnesses tested end to end | **not met** | OpenCode 2.3.0 is the only tested harness; Claude/Codex/Cursor/Gemini are explicitly unverified |
| 5 — Sustainable | governance and maintenance | **partial** | `docs/maintenance-policy.md`, ADR, issue/PR templates, CI gate; no long-term track record |

## What the evidence is

```
npm run validate   → ok - zm-pro íntegro
npm test           → tests 39 · pass 39 · fail 0
npm run test:examples → tests 3 · pass 3 · fail 0
```

## What would move the needle

1. **Level 3:** version a small evaluation suite (scenarios, acceptance criteria, comparison with and without the kit) and publish a baseline report — `EVALUATIONS.md` + `docs/evaluation-results/`.
2. **Level 4:** reproducible reports from real harnesses; each matrix cell needs version, OS, install path, observed behavior and limitations. Until then the cell stays ❓.
3. **Level 5:** at least two release cycles with the maintenance policy followed, plus issue triage history.

## Known limitations

- No behavioral evidence yet: Markdown that validates is not an agent that behaves.
- Harness compatibility is declared honestly, which means it is mostly unknown.
- The kit cannot audit your application's security, privacy or legal adequacy.
