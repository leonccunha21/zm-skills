# Maintenance policy

> What is supported, for how long, and how changes are retired. Kept short on purpose: promises we cannot keep are not written here.

## Supported versions

- **Latest minor only.** Fixes land on the current `0.x` minor; older minors are unsupported and should update (a folder copy — see the README).
- **Security reports:** acknowledged within 72 hours; a fix or mitigation note targeted within 14 days (`SECURITY.md`).
- **No fixed release cadence and no promised dates.** Releases happen when there is a change worth shipping, with evidence.

## Deprecation

1. Announce the deprecation in `CHANGELOG.md` under `[Unreleased]` with the replacement and a migration note.
2. When feasible, keep the old path for one minor before removal; breaking removals are MAJOR.
3. Removed references, templates and harness routes are recorded with their migration instructions — never deleted silently.

## Review cadence

- **Quarterly:** external references, license/maintenance status of cited tools, and legal pointers (LGPD/GDPR sections age badly).
- **On CVE/disclosure:** unscheduled triage within 72h; release a fix or mitigation note.
- **On EOL/retirement:** Node majors, harness deprecations, action majors — re-pin, re-test, record in the changelog.
- **Every release:** version sync (`npm run validate` enforces it), changelog accuracy, checksums, and a re-read of `docs/maturity.md` — a level without evidence gets downgraded, not waived.
- **After structural changes:** re-evaluate the supported Node line and the harness matrix.

## Harness compatibility

A harness/OS/version combination is marked **tested** only with a reproducible report (commands, observed behavior, limitations). Everything else stays explicitly **unverified** in `docs/harness-compatibility.md`. "It accepts Markdown" is not evidence.

## Node and platforms

`engines.node` is the source of truth (`>= 18` today). CI covers Node 18/20/22 on Ubuntu and Windows; the matrix is re-evaluated against official Node EOL dates and dropped in a MAJOR when a line stops receiving security fixes.

## Contributing and triage

- Bugs, broken rules and contradictions: issue templates in `.github/ISSUE_TEMPLATE/`.
- Proposals for new references: issue first (`feature_request.md`); evidence and a maintenance owner are required.
- Pull requests follow `.github/PULL_REQUEST_TEMPLATE.md`; the gate is `npm run validate` + `npm test`.
- Decisions that change the contract of the kit are recorded as ADRs in `docs/decisions/`.

## What this policy does not include

- Paid services, telemetry or hidden data collection — the kit is local Markdown and scripts.
- Legal advice: privacy material is engineering guidance; sign-off belongs to the consumer's DPO/counsel.
- Guarantees about your harness, model or provider — see the compatibility matrix for what was actually tested.
