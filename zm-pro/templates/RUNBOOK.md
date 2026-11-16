# Runbook — <service>

> Copy to `docs/ops/runbook-<service>.md`. Written for the person woken at 03:00 who did not build it.

## Service

- **What it does:** <one line>
- **Owner / escalation:** <team, channel, rotation>
- **Dashboards:** <links> · **Logs:** <query> · **Alerts:** <names and thresholds>
- **Dependencies:** <database, queue, third-party APIs>

## Symptoms → first checks

| Symptom | Check | Likely cause |
|---|---|---|
| 5xx spike | error rate panel, recent deploys | bad release, dependency down |
| latency | p95 panel, DB slow queries | saturation, missing index, N+1 |
| queue backlog | consumer lag, retry rate | poison message, consumer crash |
| auth failures | identity provider status, clock skew | expired keys, misconfig |

## Mitigate

1. Confirm the blast radius (who/what is affected) before changing anything.
2. Prefer the reversible lever: roll back the deploy, disable the flag, scale out.
3. Never debug by mutating production data. If unavoidable: backup first, one row/record at a time, record the command.
4. Communicate a short status: impact, workaround, next update time.

## Rollback

```
<exact commands: deploy rollback, migration down, flag off>
```

- [ ] Rollback rehearsed in a non-production environment
- [ ] Data written by the bad version is identified (and handled or accepted)

## Restore

```
<backup location, restore command, verification query>
```

- [ ] Restore drill date: <yyyy-mm-dd> — result: <restored in X min, verified by>

## After

- Preserve evidence (logs, timelines) before cleanup.
- Blameless post-mortem within 5 working days: timeline, contributing factors, actions with owners.
- Turn every repeated manual step into automation or a checklist item.
