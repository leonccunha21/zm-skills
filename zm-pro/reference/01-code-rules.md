# 01 — Code rules and gates

How to write code that survives production. Language-agnostic; examples assume TypeScript/Node as the recommended baseline — adapt, never relax.

## Principles

1. **Smallest safe change.** Fix the problem, nothing more. "Drive-by refactors" raise risk and ruin reviews. Spot something off-scope: record it as an open item, don't smuggle the fix.
2. **No over-engineering.** Reference families: Ponytail (anti-overengineering agent rules), GSTACK (plan/test/review discipline), superpowers, Matt Pocock's skills, Vercel's React Best Practices recommendations. No layers, abstractions or dependencies "for the future". YAGNI, with two exceptions: a seam for testing, and a published contract.
3. **Explicit contracts.** Schemas at every boundary — HTTP input, DB read/write, queue messages, env vars — validated on entry (zod or equivalent), typed inside, never trust external data.
4. **Failure is designed, not caught.** Every error path has a defined state: actionable message for the user (in the product's language), contextual structured log, and a caller that decides retry/rollback. No empty `catch`.
5. **Reversible changes.** Migrations ship with script + rollback + test; soft-delete/tombstone for business data; audit trail (who/when/what) for mutations; never physical `DELETE` where history exists.

## Recommended baseline (not mandatory)

React + strict TypeScript + Vite + Tailwind; modest animation; a single icon set. Relational DB with server-side authorization and row level security (Postgres or equivalent — e.g., Neon) via the platform's identity token. Mutations through auditable operations. Schema validation with zod. Two builds when the product ships both cloud and local editions — one green proves nothing about the other.

A legitimate lightweight baseline for small utilities/libraries: plain ESM JavaScript + `node --test` + `node --check` (zero dependencies, no build step; optionally JSDoc + `tsc --noEmit` for light typing). The gates adapt — the discipline doesn't.

## Required gates before delivering

| Gate | When | Typical command |
|---|---|---|
| Strict typecheck | every change | `npm run typecheck` (or `tsc --noEmit`) |
| Full test suite | every change | `npm test` / `npm run test:all` |
| Build of the affected edition(s) | code/deps/assets changed | `npm run build` (or the project's `build:*`) |
| Quality gate | deps or baseline touched | `npm run quality:gate` (if defined) |
| Security gate | deps/auth/schema touched | `npm run security:gate` (if defined) |
| E2E | UI, commercial flow, sync, licensing, offline | `npm run e2e` (if applicable) |

A red gate **blocks delivery**. If a gate can't be executed (needs real hardware, a second account, manual homologation), say so explicitly and file it as an open item — never report it green.

## Dependencies

Before adding one: (1) does the stdlib or existing code already do this? (2) license compatible? (typical allow-list: MIT/Apache-2.0/BSD/ISC; avoid AGPL/GPL code inside closed commercial products; watch CC-BY-SA attribution) (3) maintained — commits and issue responses in the last ~12 months? (4) cost-zero or approved budget? (5) acceptable bundle/install weight? Any "no"/"unknown" → don't add. Pin versions and commit the lockfile; run the secret/vulnerability scanner on the gate when deps move.

## Definition of done (see `templates/DEFINITION-OF-DONE.md`)

Typecheck + tests + build green with output quoted · no secrets/PII introduced · migration with tested rollback · registry/CHANGELOG/docs updated in the same delivery · evidence attached.

## Review anti-patterns (reject these)

- Unjustified `any`; `@ts-ignore` without a commented reason + link/issue
- Duplication acknowledged but not registrable (write an ADR)
- A dependency added "because it was in a catalog"
- Business logic inside UI components; secrets or prod URLs in source
- Pushing with a red test; "works on my machine" as verification
- Silencing a failing gate (`catch {}`, `|| true`, commenting out the test)
