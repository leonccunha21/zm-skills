# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| latest minor (`0.10.x`) | ✅ |
| older minors (`0.1.x`–`0.7.x`) | ❌ — update first |

Only the latest minor receives fixes. Updating is a folder copy (see the README); the current version is the latest entry in `CHANGELOG.md`.

## Verifying a release

Every release attaches `CHECKSUMS-<tag>.txt` (SHA-256, one line per file under `zm-pro/`). From a checkout of the same tag:

```bash
gh release download v0.10.1 -p 'CHECKSUMS-*'
node scripts/checksums.mjs --verify CHECKSUMS-v0.10.1.txt
```

A release publishes the repository tree at the tag plus that manifest — there is no build step, so the artifact is the source. The verifier exits non-zero on a changed, missing or extra file, and rejects manifest paths outside the repository. The release workflow runs the same check before publishing.

## Reporting a vulnerability

This skill is Markdown plus a zero-dependency validator script — the attack surface is small, but issues matter: prompt injection content, misleading guidance with security impact, or bugs in `scripts/validate.mjs`.

1. **Do not open a public issue** for a vulnerability.
2. Use GitHub's **private vulnerability reporting** ("Security" tab → "Report a vulnerability") on `leonccunha21/zm-skills`. If that's unavailable, contact the maintainer through the GitHub profile.
3. Include: affected file/section, impact, reproduction (a prompt or input that triggers it), and suggested fix if any.

We acknowledge within 72 hours and aim to publish a fix or a mitigation note within 14 days. Credit is given unless you decline it. Supported versions, deprecation and review cadence live in [docs/maintenance-policy.md](docs/maintenance-policy.md).

## Data handling in this repository

- **No telemetry, no analytics, no network calls** in the skill or scripts; `tests/offline.test.mjs` enforces the import side and runs the gate with an invalid proxy.
- **CI logs** are public and retained under GitHub's default retention; workflows never print tokens or secrets, and fixtures are synthetic. Do not paste customer data, tokens or private paths into an issue, PR or test fixture.
- **Examples and tests use invented data only** — no production dumps, no real credentials (example credentials are invalid by construction).
- **Release artifacts** are the tagged tree plus `CHECKSUMS-<tag>.txt`; nothing else is uploaded.
- **Content review:** text from issues, pages and third-party docs is treated as data, never as instructions that override project rules (`zm-pro/reference/14-agent-operations.md`).

## What this policy does not cover

The kit does not replace a pentest, a human security review, a DPO, legal counsel or your provider's controls. Following a checklist is not evidence that a system is secure; only an assessment of the actual system is.

## What is in scope

- Guidance that could cause secrets/PII leakage, unsafe auth patterns, or license violations when followed
- Validator script vulnerabilities (command injection, path traversal)
- Misleading security checklists (e.g., claiming fail-closed while failing open)

## What is out of scope

- The *project you apply the skill to* — its security is yours to review (this kit teaches the discipline; it doesn't audit your codebase)
- Vulnerabilities in third-party tools the kit mentions by name (report to their maintainers)
- Social engineering of maintainers
