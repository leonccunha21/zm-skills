# Incident report — <incident-id>

> Copy to `docs/incidents/<date>-<slug>.md`. Blameless, evidence first. Fill it during and after the incident — memory decays fast.

## Summary

- **What happened:** <user-visible impact in one sentence>
- **Detected at / resolved at:** <timestamps, timezone>
- **Duration:** <minutes>
- **Severity:** SEV1 (outage/data loss) · SEV2 (degraded) · SEV3 (minor)
- **Status:** ongoing / mitigated / resolved / monitoring

## Impact

- **Affected:** <users, tenants, regions, features>
- **Data:** <none | amount and type — never paste personal data; reference the record id>
- **Financial/contractual:** <if applicable>

## Timeline

| Time | Event | Evidence link |
|---|---|---|
| 00:00 | first alert / report | <dashboard, log query> |
| 00:05 | acknowledged by <role> | |
| 00:20 | mitigation applied: <what> | <deploy id, flag change> |
| 01:10 | resolved | <smoke test output> |

## Root cause and contributing factors

<!-- One paragraph for the cause; list the conditions that let it happen (missing test, silent fallback, alert gap). -->

## What worked / what did not

- Worked: <detection, rollback, runbook step>
- Did not: <missing dashboard, unclear ownership>

## Recovery

- Rollback or restore used: <exact command/path>
- Data reconciliation: <query + result, or "none needed">
- Verification after recovery: <command and real output>

## Actions

| # | Action | Owner | Due | Tracking |
|---|---|---|---|---|
| 1 | <add regression test> | | | |

## Communication

- Internal updates at: <times>
- External status page / customer note: <link or "not needed">
- Regulator/DPO notification considered: <yes/no + reason>

## Lessons

<!-- What the team should remember. Link the runbook/ADR changes this incident caused. -->
