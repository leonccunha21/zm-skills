# Threat model (simplified) — <system/feature>

> Copy to `docs/security/threat-model-<slug>.md`. One page beats a shelf of unused diagrams.
> This is engineering input, not a penetration test or a compliance certificate.

## Scope

- **System/feature:** <what>
- **Entry points:** <UI, API, webhook, upload, admin, job>
- **Trust boundaries:** <browser → API, API → DB, service → third party, LLM → tools>

## Assets

| Asset | Why it matters | Where it lives |
|---|---|---|
| <credentials, personal data, money, availability> | <impact if lost> | <store/service> |

## Actors and capabilities

- Anonymous internet user, authenticated user, tenant admin, internal operator, compromised dependency, malicious document/LLM output.

## Threats

| # | Threat | Path | Likelihood | Impact | Control | Residual |
|---|---|---|---|---|---|---|
| 1 | <e.g. IDOR on invoice id> | <request> | medium | high | <server-side authorization per resource + test> | low |
| 2 | <secrets in logs> | <log sink> | high | high | <redaction + secret scan in CI> | low |
| 3 | <prompt injection via retrieved doc> | <RAG → tool call> | medium | high | <treat retrieved text as data; allowlist tools; human approval> | medium |

## Controls already in place

<!-- AuthN/AuthZ, validation, rate limits, encryption, backups, monitoring. Cite files/config. -->

## Open risks

<!-- Accepted risks need owner + review date. Unknowns are listed as unknown, not omitted. -->

## Out of scope

<!-- Provider internals, physical security, legal adequacy. -->
