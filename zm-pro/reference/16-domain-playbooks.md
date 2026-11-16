# 16 — Domain playbooks

> One page per engineering domain: the failure modes that actually bite, and the checks worth doing. Load only the section the task needs — this is a set of playbooks, not a curriculum.

## APIs and integrations

- **Contract first:** schema (OpenAPI/async contract), version in the path or header, additive changes only within a major.
- **Idempotency:** writes accept an idempotency key; retries never duplicate money or side effects.
- **Retries with backoff + jitter**, bounded attempts, only for retryable errors; a timeout on every call.
- **Rate limits and quotas:** document them, surface `Retry-After`, fail predictably.
- **Pagination:** stable ordering with a cursor; no offset drift under writes.
- **Validation:** reject unknown fields or ignore them explicitly; validate types, ranges, sizes and encoding.
- **Webhooks:** verify signature, timestamp window and replay protection; process idempotently; return 2xx fast and work async.
- **Errors:** one shape, actionable message, correlation id; never leak stack traces or secrets.

## Database

- **Model from invariants:** constraints (unique, FK, check) in the database, not only in app code.
- **Indexes** follow real query patterns; measure with `EXPLAIN`, watch write cost.
- **Transactions:** know the isolation level; short transactions; no network calls inside them.
- **Concurrency:** explicit locking or version columns for read-modify-write; test the race.
- **Migrations:** forward + tested rollback (or documented irreversibility), expand/migrate/contract for zero-downtime; never edit an applied migration.
- **Backups:** automated, encrypted, with a restore drill and a stated RPO/RTO; a backup never restored is a hope.
- **Data lifecycle:** retention, deletion and anonymization implemented, not just documented.

## Frontend

- **State:** single source per concern; server state vs. UI state separated; no duplicated derived state.
- **Hydration:** render deterministic markup; guard `window` access; test the first paint.
- **Forms:** labels, validation messages tied to fields, disabled-while-submitting, server-side validation always.
- **Navigation:** deep-linkable state, back/forward works, focus managed on route change.
- **Accessibility:** see `03` — keyboard, focus, semantics, contrast, zoom, reduced motion.
- **Client security:** no secrets in bundles; escape output; CSP; treat URL/localStorage input as hostile.
- **Performance:** budgets for LCP/CLS/INP, images sized, code split by route; measure on a mid-range device.

## Backend

- **Boundaries:** one module owns one domain; cross-domain calls through a contract, not shared tables.
- **Queues/jobs:** idempotent consumers, dead-letter queue, retry policy, visibility timeout, poison-message handling.
- **Concurrency:** bounded worker pools, backpressure, cancellation propagation.
- **Cache:** explicit key + TTL + invalidation; never cache authorization decisions without scope.
- **Consistency:** state where partial failure is possible (saga/outbox), reconciliation job.
- **Observability:** structured logs with correlation id, metrics with SLO, traces across boundaries; alerts actionable.

## Mobile

- **Lifecycle:** background/foreground, process death, deep links, permission changes.
- **Storage:** platform secure storage for tokens; no secrets in plain files; encrypted local data when sensitive.
- **Intermittent connectivity:** offline queue, conflict resolution, optimistic UI with rollback.
- **Accessibility:** dynamic type, screen reader labels, touch targets, contrast, reduced motion.
- **Release:** signing keys in a safe store, staged rollout, crash monitoring, remote kill switch.

## Infrastructure and cloud

- **IaC only:** no console changes that are not reflected in code; plans reviewed before apply.
- **Environments separated:** accounts/projects/subscriptions per environment; no production credentials in dev.
- **IAM:** least privilege, no wildcard admin, workload identity over long-lived keys.
- **Network:** private by default, explicit ingress, egress rules and egress logging for sensitive workloads.
- **Secrets:** managed store, rotation, per-environment values, no secrets in images or logs.
- **Cost and scale:** budget alarms, autoscaling limits, capacity review before launch.
- **Recovery:** backups, multi-AZ/region decision, restore drill documented.

## AI and LLM features

See `15-ai-security.md` for the threat model. Minimum: grounding with citations, evaluation of prompt changes, injection-resistant tool use, budget caps, fallback, human approval for irreversible actions.

## Legacy systems

- **Characterize before changing:** capture current behavior with tests (characterization tests), log real inputs/outputs with synthetic replay.
- **Incremental migration:** strangler pattern, dual-write/read comparison, feature flag and rollback.
- **Compatibility:** versioned adapters; a documented "known differences" list.
- **Reversal:** every step carries a rollback path; never a big-bang cutover without a tested way back.

## Data and analytics

- **Quality:** schema + freshness + volume checks; quarantine bad rows instead of dropping silently.
- **Lineage:** source → transform → destination documented; owners per dataset.
- **Minimization:** collect only fields with a purpose; aggregate or pseudonymize before analytics.
- **Access:** row/column policies, audit of queries on sensitive data.
- **Retention:** enforced by jobs, including derived tables and exports.

## Technical documentation

- **ADRs** for decisions that are expensive to reverse; **contracts** for interfaces; **runbooks** for operations.
- **Diagrams** as code when possible; date and owner on each page.
- **Examples** kept executable or clearly marked as pseudocode; stale examples are defects.
- **Traceability:** issue → PR → test → changelog entry → release.
