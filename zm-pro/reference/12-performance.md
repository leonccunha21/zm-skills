# 12 — Performance discipline

Performance work is engineering under measurement constraints: profile first, optimize what the profiler names, verify with before/after numbers, budget so it stays won. Never "it feels faster".

## Measure first

- **Lab**: Lighthouse/DevTools traces for reproducible diagnosis; **field**: Core Web Vitals from real users (CrUX/RUM) when traffic exists — lab lies politely about real devices and networks.
- Establish the baseline **before** changing anything; keep the same scenario before/after. Attach both numbers to the delivery (see the delivery template).
- Profile to find the hot path; Pareto rules — optimize the 5% that is 95% of the time; leave the rest alone.

## Budgets (examples — per product, never universal; tune to your market, device mix and margin, enforce in CI)

Budgets are product decisions, not commandments: a POS on a mid-range Android and a desktop CRM legitimately carry different targets. Set them explicitly, record who set them, and review annually. Track cost as a budget too: infra per active user, bytes egress per task, and vendor fees for the top-3 operations — performance spend you cannot see will meet a bill you cannot refuse.

| Budget | Suggested start | Enforced by |
|---|---|---|
| LCP | ≤ 2.5s (p75) | Lighthouse CI threshold |
| INP | ≤ 200ms | RUM / web-vitals |
| CLS | ≤ 0.1 | Lighthouse CI |
| Route JS (gzip) | ≤ 170 KB initial | bundlesize/size-limit check |
| Images per route | format = AVIF/WebP, LCP image ≤ 200 KB | review checklist |
| p95 API | project SLO (e.g., ≤ 300ms) | APM/metrics alert |
| Cost | infra + vendor spend per active user ≤ project ceiling | monthly cost review |

## Frontend loading

- Code-split per route; lazy-load below-the-fold and non-critical chunks
- Critical CSS inline where it matters; `font-display: swap` + preconnect to font/CDN origins
- Images: right-sized, responsive, lazy (except the LCP one — `fetchpriority="high"`)
- Cache headers: hashed assets `immutable` 1y; HTML short/no-cache with revalidation
- Prefetch next likely navigation sparingly — bandwidth is also a budget

## Data layer

- **N+1 is the default failure** — batch, join, or DataLoader; count queries per request in tests for hot endpoints
- Index every WHERE/ORDER BY you actually ship (`EXPLAIN` before and after new query shapes)
- Pagination or virtualization for unbounded lists; cap payload sizes with contracts
- Connection pooling configured (not default); statements prepared; no `SELECT *` in hot paths

## Performance investigation and profiling procedure

Never optimize by intuition. Follow this four-step scientific loop:

1. **Reproduce with synthetic scenario:** Build a repeatable benchmark or test fixture matching production scale (e.g. 50k rows or 20 concurrent requests). Document the exact hardware, environment, and dataset size.
2. **Profile the hot path:**
   - *Backend/Database:* Run `EXPLAIN (ANALYZE, BUFFERS)` to spot index misses, sequential scans, or nested loops. Profile CPU with flamegraphs (e.g. `0x`, Node inspector).
   - *Frontend:* Record a DevTools Performance trace; locate long tasks (> 50ms) and evaluate rendering/layout thrashing.
3. **Isolate and modify:** Apply the single highest-impact change (add covering index, batch N+1 calls, stream large payloads, or code-split bundle). Avoid bundling multiple speculative tweaks simultaneously.
4. **Benchmark and verify:** Re-run the exact initial benchmark under identical parameters. If the delta is within noise (< 5%) or creates maintenance friction without measurable win, revert the change.

## Memory and streaming discipline

- **Stream large payloads:** Process file imports, exports, and large query sets via streams or chunked async iterators. Buffering 50MB of CSV in memory exhausts worker heap and triggers OOM crashes.
- **Bounded caches:** Always use LRU caches with maximum element caps and explicit TTLs. Unbounded Map/Object caches in persistent Node processes leak memory until restart.
- **Connection pooling:** Size connection pools conservatively (often 10–20 connections per service instance); use pooled proxies (PgBouncer/Supavisor) in serverless environments to prevent database connection exhaustion.

## Runtime and backend

- No premature memoization; memoize only measured expensive work, with a measured win (and a test, if the memo can go stale)
- Caching strategy written down: what, where, TTL, invalidation rule (write path beats cron sweep)
- Compression on (`br`/gzip), HTTP/2+, TLS resumption
- Async by default for non-interactive work (jobs/queues) — checkout shouldn't wait for email

## Delivery practice

- Releases touching perf-sensitive paths run a before/after benchmark in the delivery evidence
- Track regressions in CI (diff bundle size vs. `main`); alert thresholds set, not just recorded
- Blameless performance retros when a release regresses — find the gate that missed it

## Anti-patterns

- Optimizing without a baseline ("let's add cache everywhere")
- Micro-optimizing cold paths (1% of executions)
- Cache without an invalidation story — stale-data bugs are worse than slow ones
- Rendering cost fixes on server: memoizing values that change anyway
- "We'll profile later" — later is a deadline-free word; profile is part of done
- Buffering entire database tables or files into Node memory arrays before filtering
- Running queries inside UI loops or template mappers without query-count assertions in automated tests

## Delivery checklist

### Data layer and backend performance checklist
- [ ] Database query count asserted in automated tests for high-frequency or customer-facing endpoints (zero N+1)
- [ ] `EXPLAIN ANALYZE` executed for all new or modified query shapes; index coverage confirmed
- [ ] Large result sets paginated, virtualized, or processed via streams instead of whole-table memory buffers
- [ ] Caches bounded with LRU limits, TTL expiration, and deterministic invalidation on mutation paths
- [ ] Pool limits, timeouts, and backoff configured for database and third-party API connections

### Frontend and release performance checklist
- [ ] Baseline vs after-change numbers attached to delivery evidence using identical test scenario and network profile
- [ ] Route JS bundle size verified against threshold (`bundlesize` or CI limit check; diff vs `main`)
- [ ] Images formatted as WebP/AVIF with explicit dimensions (`width`/`height`) and appropriate priority (`fetchpriority="high"` for LCP only)
- [ ] Performance budget updated or validated with named owner and review schedule
- [ ] Cost and egress implications reviewed for the top-3 highest throughput operations
