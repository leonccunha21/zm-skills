# 10 — Operations & observability

After deploy, software is a living system: either you see it, or it surprises you. Use free tiers and OSS first; pay only by explicit decision.

## The three signals (minimum viable)

1. **Structured logs** (JSON): `timestamp`, `level`, `request_id`, actor id (pseudonymized), tenant key, `action`, `result`. Never PII or secrets. Correlate end-to-end with `request_id` (client → API → DB).
2. **Metrics**: error rate, p95 latency, throughput, failed jobs, sync queue depth. With managed Postgres: connection count, slow queries. Dashboards only for things someone will actually look at.
3. **Alerts**: actionable, owned. Error threshold breach, p95 high, job stalled, cert expiring, backup failed. An alert nobody acts on becomes noise and gets silenced — review together and delete liberally.

Reference patterns: OpenTelemetry (vendor-neutral traces/metrics/logs), Sentry (errors; free tier), OpenStatus/Checkly (uptime/public status), self-hosted Grafana+Loki. Instrument the money flows first.

## SLO/SLI, when applicable

For customer-facing services: pick a few **SLIs** (availability, p95 latency, error rate, freshness) and set an **SLO** with an error budget. Alert on budget burn rate, not instantly on every blip. Internal tools and cron jobs: one success-rate metric and one last-run timestamp are enough. No SLO without a named owner and a monthly review — an SLO nobody reads is decoration.

## Backup and continuity

- Automated, encrypted backups (DB + storage); **scheduled restore drills** — a backup never tested is a hypothesis
- Retention per data class (daily 7d / weekly 4w / monthly 12m — tune to your business and legal floors)
- Second environment for homologation; second client machine when offline/sync matters
- One-page disaster runbook: who calls, what's restored, order, acceptable RTO/RPO, customer communication

## Incident runbook (one page)

1. **Detect** (alert or report) → 2. **Contain** (rollback, flag off, isolate, revoke secret) → 3. **Communicate** (product owner; personal data involved → DPO + regulator per severity) → 4. **Diagnose** (logs, metrics, reproduce in homologation) → 5. **Fix** (fix or roll back — stability first) → 6. **Verify** (smoke test) → 7. **Blameless post-mortem** within 3 business days: timeline, impact, root cause, what saved us, what failed, actions with owners and dates.

### Incident severity classification

- **P0 — Critical outage / data breach:** Core customer journey broken (checkout down, login blocked, auth bypass, or active personal data exfiltration). Immediate containment; rollback or kill-switch within minutes; status page update within 15m; post-mortem mandatory.
- **P1 — Major degradation:** High-impact flow impaired (reports failing, elevated p95 latency > SLA, queue processing backlog growing). Containment within 1 hour; diagnosis in staging; hotfix deployed with peer review.
- **P2 — Minor bug / operational flaw:** Edge-case failure with available workaround; single-tenant transient glitch. Scheduled for standard delivery flow with characterization test.

## Observability instrumentation procedure

For every new external service, background job, or HTTP endpoint:

1. **Request tracing:** Propagate `x-request-id` from incoming request headers down to service layers, background jobs, and SQL query comments (`/* req:<id> */`).
2. **Health probes:** Separate liveness (`/healthz` — process is up) from readiness (`/ready` — database and downstream dependencies reachable; fails closed if critical pool exhausted).
3. **Log sanitization:** Route log events through an allowlist or redaction filter that strips keys matching `pass*|token|secret|auth|bearer|cookie|cpf|card`.
4. **Metric telemetry:** Increment counters on outcome (`status=success|failure`), record latency histograms on endpoints, gauge queue backlog sizes.

## Cost and capacity

Review monthly: consumption vs. free-tier quotas, storage growth (logs/backups), email delivery costs. Approaching a quota → written decision before upgrading. End of month without review = surprise invoice or prod quota exhaustion.

## Minimal operational routine

- Weekly: dependency audit, backup verification, alert review, new-error triage
- Monthly: capacity/cost, access review (least privilege), restore drill, uptime recap
- Per release: post-deploy smoke, heightened monitoring for N hours

## When personal data is in the room

Production logs never hold personal data in cleartext. Data access is audited. Any incident involving personal data escalates through `06-data-privacy-lgpd.md` (DPO + notification) **before** product decisions.

## Anti-patterns

- Dumping raw request bodies or stack traces with user input directly into logs (inevitable secret/PII leak)
- Routing alerts to an unowned, muted Slack channel where "everyone is responsible" (meaning no one is)
- Alerting instantly on a single transient spike rather than evaluating a sustained window or error budget burn rate
- Counting on database automated backups without regularly testing the actual restore procedure onto an isolated database
- Running background queues without dead-letter queues (DLQ) or retry caps, causing infinite retry loops under poison-pill payloads
- Operating without an active health/readiness probe, causing load balancers to route live traffic to failing nodes

## Operations checklist

### Operational readiness checklist (before production launch)
- [ ] Structured JSON logging configured with `request_id`, timestamp, and automated credential/PII redaction
- [ ] Liveness and readiness endpoints implemented and hooked into the container or load-balancer supervisor
- [ ] Actionable alerts configured: threshold, notification channel, on-call owner, and linked runbook for each alert
- [ ] SLO and error budget defined for user-facing flows (or documented as "not applicable" with technical justification)
- [ ] Dead-letter queue and backoff strategy in place for asynchronous workers and background jobs

### Routine operational maintenance checklist
- [ ] Restore drill executed on schedule onto an isolated test instance; duration and verify query recorded
- [ ] Alerts audited: noisy or unacted alerts tuned down or decommissioned to prevent alert fatigue
- [ ] Resource quotas and cloud expenditure reviewed against project budgets before invoice surprises
- [ ] Personal-data access audit logs reviewed for anomalous egress or unauthorized exports
- [ ] Disaster recovery runbook updated with current team contact points and credential rotation steps
