# Reviewing automated and AI-generated contributions

> A pull request is a pull request, whatever wrote it. This is the extra scrutiny the kit applies to contributions produced largely by AI tools or automation — where fabrication is the main failure mode.

## Baseline (unchanged)

`npm run validate` and `npm test` green, EN in the kit (pt-BR only where the topic is the locale), no project residue, single source of truth, `CHANGELOG.md` updated, claims reproducible. Same as any contributor.

## What AI-generated output gets scrutinized for

1. **Evidence fabrication:** commands and outputs must be real. Check that pasted output is plausible for the claimed environment (test names, counts, exit codes). If in doubt, ask for a fresh run or a CI link.
2. **Invented APIs:** model names, library functions, flags and file paths that do not exist. Verify against the project's actual dependencies and lockfiles — `scripts/validate.mjs` does not catch this; review does.
3. **Silent scope growth:** unrelated formatting, renames or "improvements" outside the stated scope. Reject or require splitting.
4. **License and provenance:** pasted passages from other projects. Watch for characteristic markers; every adopted block needs a name + link and a compatible license (see `scope-control.md`).
5. **Tests that only confirm the bug:** tests written to pass, not to catch. Read assertions, not counts.
6. **Confidence language:** "fully tested", "perfect", "guaranteed" — treat as unverified claims; require the command output.
7. **Secrets and PII** hidden in fixtures and examples.

## Protocol for maintainers

1. Ask for the reproducible script behind every behavioral claim (or the CI run).
2. Spot-check one factual claim by hand (run the test, open the linked doc, verify the exit code).
3. Require the delivery record: files, commands, output, risks, open items, what was **not** tested.
4. If the PR adds a new dependency/reference, the justification (value, risk, maintenance, license) is mandatory — `docs/scope-control.md`.
5. When the output is shaped by an AI session, ask for the prompt-level context only if needed to judge it; never ask for chat logs.
6. Record the decision when rejecting on these grounds — patterns feed `docs/maintenance-policy.md` review.

## What this kit does not do

- It does not auto-merge AI PRs.
- It does not forbid AI assistance — it forbids unverified claims, whatever their origin.
- It does not require disclosure of the tool used; it requires verifiable evidence.

## Maintenance calendar (risk-based)

- **Unscheduled:** CVE or security disclosure affecting the kit — triage within 72h (`SECURITY.md`).
- **Per release:** validate + test + parity + evaluate scenario check + maturity re-read (this file + `docs/maturity.md`).
- **Quarterly:** external references, legal pointers (LGPD/GDPR age), harness matrix review.
- **On EOL/retirement:** Node major EOL, harness deprecations, action majors — re-pin and re-test (`docs/maintenance-policy.md`).
