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

## Cost and capacity

Review monthly: consumption vs. free-tier quotas, storage growth (logs/backups), email delivery costs. Approaching a quota → written decision before upgrading. End of month without review = surprise invoice or prod quota exhaustion.

## Minimal operational routine

- Weekly: dependency audit, backup verification, alert review, new-error triage
- Monthly: capacity/cost, access review (least privilege), restore drill, uptime recap
- Per release: post-deploy smoke, heightened monitoring for N hours

## When personal data is in the room

Production logs never hold personal data in cleartext. Data access is audited. Any incident involving personal data escalates through `06-data-privacy-lgpd.md` (DPO + notification) **before** product decisions.
