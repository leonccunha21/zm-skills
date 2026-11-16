# 07 — Pragmatic security

Not a pentest at the end; discipline in every delivery. References: OWASP Cheat Sheet Series (CC-BY-SA — attribute when quoting), Gitleaks, Cloudflare's security-audit-skill, ZAP for dynamic scans.

## Rule zero — secrets

- Secrets live in env vars / the host secret store — never in source, commits, logs or screenshots. `.env*` stays gitignored.
- A secret scanner runs on the gate (Gitleaks as reference; a small home-grown script is legitimate too). If history shows exposure, rotate — scanning the present is not enough.
- Leaked? Rotate immediately, log an incident, scope the blast radius. Hiding doesn't fix it; rotating does.
- Service tokens, private keys, URLs with embedded credentials: same rule, no "temporary" exceptions.

## OWASP essentials (curated for web apps with a database)

1. **Injection** — parameterized queries/ORM only; never string-concat user input; validate schemas at the boundary
2. **Broken access control / IDOR (BOLA)** — authorization **server-side, per resource**, on every read/write (`WHERE account_id = ?` from the authenticated identity, never from the client); database-level RLS as the second lock. Fail closed: doubt = deny.
3. **Auth & sessions** — strong password hashing (argon2/bcrypt), rate limiting, short-lived sessions + refresh, server-side revocation on logout/reset. Never roll your own crypto — use vetted libraries.
4. **SSRF** — allowlist hosts for server-side fetch; never fetch user-supplied URLs raw.
5. **Insecure configuration** — security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS), restrictive CORS, no debug in production, TLS everywhere.
6. **Vulnerable dependencies** — audit on the gate when deps move; lockfile committed; abandoned dep (>12 months stale + known CVE) is scheduled debt.
7. **Sensitive logging** — never log passwords, tokens, cards, cookies, personal IDs; structured logs with a request-id for tracing.
8. **Uploads** — validate type/size by magic bytes, store outside the web root, random names, no execution.

## Authorization and data

Multi-tenant always with server-scoped `account_id`/tenant key; RLS policies **tested** (reading another account's resource must fail — write that test). Soft-delete + audit trail on business mutations. Least privilege; admin as a separate, audited role.

## Data and backups

Automated, encrypted backups **and a rehearsed restore** — an untested backup is a hypothesis, not a control. Second environment for homologation; production data never on dev machines.

## Incident response (summary)

Detect → contain (revoke, rotate, isolate) → scope → communicate per severity (data subjects/regulator when personal data is involved) → fix root cause → blameless post-mortem (see `10-operations`) → prevent (new gate, rule, alert).

## Cost discipline

Free tiers (Neon/Firebase/Cloudflare/Sentry/OpenStatus) + OSS tools (Gitleaks, ZAP, OWASP). Paid service only with a written owner decision, with a monthly cost estimate.

## Security PR checklist

Input validated? Per-resource authorization tested? Secrets scan clean? Security headers intact? New dep vetted? Log PII? Uploads safe? Failure = deny? Cross-tenant/cross-account test covered?
