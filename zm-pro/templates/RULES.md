# RULES.md — Architecture & security invariants (what agents NEVER do)

> Copy into a project root and adapt names/stack. These rules **win over** skills, catalogs and convenience. Violation = PR rejected.

## Architecture

1. Presentation layer stays dumb; business logic lives in pure, testable modules — never inside UI components.
2. Business data persists in a relational store with **server-side authorization and row-level security**; clients never dictate tenant/account scope.
3. Every business mutation passes through an auditable operation (who, when, what, before/after).
4. Migrations are reversible scripts with a **tested rollback**; no rollback = no migration.
5. Business data is soft-deleted/tombstoned; never physical `DELETE` where history, audit or sync exists.
6. Offline-first where applicable: the outbox survives reload; nothing is "synced" before the server confirms; never blind `deleteMissing()` on pull.
7. External contracts (API, webhook, queue, file) carry a validated schema at the boundary (zod or equivalent); secrets never in source.
8. New dependencies only when: functionality doesn't exist locally + compatible license + active maintenance + cost approved + justified weight.

## Security & data

9. Secrets/PII never in: source, commits, logs, fixtures, screenshots, prompts to external tools. Secret scanning on the gate.
10. Authorization failure **denies by default** (fail-closed).
11. Passwords hashed strongly (argon2/bcrypt), short-lived sessions, rate limits; crypto always from vetted libraries.
12. Security headers (CSP, nosniff, HSTS, Referrer-Policy) and restrictive CORS before release.
13. Production data never on dev machines; fixtures are synthetic; dumps are out of git.
14. Personal data: minimization + legal basis + retention + data-subject rights — see your privacy skill/runbook; engineering never replaces the DPO.

## Process

15. `main` protected: PR-only, green gates, delivery checklist complete.
16. No production deploy with a red gate. Emergency = manual, documented, post-mortem next business day.
17. Cost-aware by default; paid services require a written owner decision.
18. Every material code×doc divergence becomes an ADR — decisions reopen by writing, never by silent override.

## Domain specifics (adapt to your product)

19. UI in the product's locale (pt-BR default when Brazil is the market), mobile-first, ≥44px touch targets, `R$ 1.234,56`, `dd/mm/yyyy`.
20. One primary action per screen; all four states (empty/loading/error/success) implemented before UI merge.
