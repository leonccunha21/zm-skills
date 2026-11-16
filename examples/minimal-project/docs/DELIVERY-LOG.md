# Delivery log

One entry per delivery: date, scope, commands executed with real output, evidence, open items. Newest first.

---

## 2026-11-16 — Project bootstrap with zm-pro

**Scope:** `git init` + README, AGENTS.md, RULES.md, CI (typecheck+test+build), first deploy pipeline (placeholder).

**Comandos (saída real):**
- `npm install` → ok, 0 vulnerabilities (`npm audit`)
- `npm run typecheck` → tsc clean
- `npm test` → 12/12 passing
- `npm run build` → built in 4.2s; bundle 132 KB gzipped

**Evidence:** CI run #12 green · tag `v0.1.0` · preview URL envs configured (not yet populated)

**Open items:**
- [ ] Real preview environment on first release (owner: ZM, blocks: no)
- [ ] E2E harness not wired yet (owner: ZM, blocks: no — add with first commercial flow)

**Not tested:** actual deploy (awaiting first release approval)

---

## 2026-11-17 — Login screen with RLS-scoped queries

**Scope:** `src/features/auth/LoginForm.tsx`, `src/server/session.ts`, migration `0002_sessions.sql`.

**Comandos (saída real):**
- `npm run typecheck` → clean
- `npm test` → 21/21 passing (incl. cross-account denial test)
- `npm run build` → ok
- migration rollback rehearsed locally: `down.sql` validated on scratch DB

**Evidence:** diff review notes in PR #3 · EXPLAIN on new query added to PR #3 · regression test `session.test.ts` red→green

**Open items:**
- [ ] Rate-limit thresholds to be tuned after first week of real traffic (owner: ZM)
- [ ] Session cookie name undecided (decided as of 2026-11-19: `__Host-sess`)

**Not tested:** real-device password managers autocomplete; SSO (out of scope this release)
