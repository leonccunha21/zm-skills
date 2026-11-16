# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| latest minor (`0.8.x`) | ✅ |
| older minors (`0.1.x`–`0.7.x`) | ❌ — update first |

Only the latest minor receives fixes. Updating is a folder copy (see the README); the current version is the latest entry in `CHANGELOG.md`.

## Reporting a vulnerability

This skill is Markdown plus a zero-dependency validator script — the attack surface is small, but issues matter: prompt injection content, misleading guidance with security impact, or bugs in `scripts/validate.mjs`.

1. **Do not open a public issue** for a vulnerability.
2. Use GitHub's **private vulnerability reporting** ("Security" tab → "Report a vulnerability") on `leonccunha21/zm-skills`. If that's unavailable, contact the maintainer through the GitHub profile.
3. Include: affected file/section, impact, reproduction (a prompt or input that triggers it), and suggested fix if any.

We acknowledge within 72 hours and aim to publish a fix or a mitigation note within 14 days. Credit is given unless you decline it.

## What is in scope

- Guidance that could cause secrets/PII leakage, unsafe auth patterns, or license violations when followed
- Validator script vulnerabilities (command injection, path traversal)
- Misleading security checklists (e.g., claiming fail-closed while failing open)

## What is out of scope

- The *project you apply the skill to* — its security is yours to review (this kit teaches the discipline; it doesn't audit your codebase)
- Vulnerabilities in third-party tools the kit mentions by name (report to their maintainers)
- Social engineering of maintainers
