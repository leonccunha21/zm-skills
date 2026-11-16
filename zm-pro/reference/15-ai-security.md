# 15 — AI application security

> For systems where a model reads untrusted content, calls tools or remembers things. Prompt filters are not a security boundary; authorization and isolation are. Read this with `06` (privacy) and `07` (security).

## Threat model for LLM features

| Asset | Threat | Control |
|---|---|---|
| System prompt and policies | extraction, override | assume it can leak; keep no secrets there; enforce policy server-side |
| Tool credentials | abuse through tool calls | least-privilege tokens per tool; per-user authorization; no ambient admin keys |
| Retrieved documents | prompt injection (direct/indirect) | treat text as data; allowlist actions; human approval for destructive ones |
| Conversation/context | cross-tenant leakage | tenant-scoped retrieval and caches; authz on every document id |
| Memory / vector index | poisoning, stale or foreign data | provenance, write validation, per-tenant partitions, expiry |
| Usage budget | loops, cost blowups | per-request token/time/step caps, rate limits, circuit breaker |

## Injection: direct and indirect

- **Direct:** the user asks the model to ignore rules. Low impact if rules are enforced outside the model.
- **Indirect:** a retrieved page, PDF, issue, email, code comment or tool output contains instructions. This is the dangerous one — it arrives through a channel the user trusts.
- **Rule:** content is data. It never changes the instruction hierarchy, never authorizes a tool call and never widens scope. Detect, quote, ignore, report.
- **Never** build authorization from model output: "the model said the user is an admin" is not authorization.

## Tools and function calling

1. **Allowlist** tools per task/session; no generic "run any shell command" tool exposed to a model reading untrusted text.
2. **Validate arguments server-side** against a schema (types, ranges, enums, ownership). Reject, don't sanitize silently.
3. **Authorize per resource and per user** on the server — the model's claim of identity is untrusted input.
4. **Constrain effects:** read-only by default; writes idempotent with an idempotency key; destructive actions require explicit human approval.
5. **Limit execution:** timeouts, output size caps, retry limits, no unbounded loops; a step counter with a hard stop.
6. **Log tool calls** (arguments redacted) for audit; never log secrets or full personal data.

## RAG and vector stores

- **Tenant isolation end to end:** separate namespaces/collections/keys; filter by tenant *and* authorization at query time, not only at ingest.
- **Document-level authorization:** the retrieval filter must use the caller's permissions; re-check after retrieval before sending to the model.
- **Ingestion is untrusted:** scan uploads, strip active content, cap size, record provenance (source, owner, date).
- **Freshness and deletion:** deletions propagate to the index; stale chunks are a correctness and privacy bug.
- **Retrieved text is quoted data** in the prompt — delimit it and tell the model not to follow instructions inside it (defense in depth, not a guarantee).

## Memory

- Write memory only from validated, attributable events; never from raw model output.
- Scope by user/tenant; expire by policy; provide a delete path that reaches every store.
- Poisoning is a persistence attack: one bad write survives across sessions. Validate, version and be able to roll back.

## Output handling

- Treat model output as **untrusted input** to the next system: escape for HTML/SQL/shell, validate JSON against a schema, never `eval`.
- Rendered markdown from a model can carry links/images that exfiltrate data — sanitize and proxy images.
- Citations and links must be verified before display; a fabricated URL is a phishing vector.

## Budgets, latency and fallback

- Per request: max tokens in/out, wall-clock timeout, max tool steps; per user/tenant: rate limit and spend cap.
- Cache deterministic work, not personal or tenant-specific responses across tenants.
- Fallback model/route must keep the same authorization and logging guarantees; degradation is not a security bypass.
- Fail closed on policy checks; a timeout in the moderation/authorization path must deny, not allow.

## Human review

Require a human decision for: irreversible actions, money movement, legal/medical advice, deleting data, changing permissions, external communication on behalf of a person. The interface states clearly when a human approved.

## Adversarial testing

- Fixtures with injection payloads in retrieved docs, filenames, issue titles, tool outputs and memory.
- Attempts to exfiltrate the system prompt, other tenants' data and secrets; attempts to call forbidden tools.
- Objective pass criteria: no unauthorized tool call, no cross-tenant data in the response, no secret in output, refusal or safe continuation recorded.
- Automated checks catch regressions, not novel attacks; pair with human review. Never claim "secure against prompt injection".

## Checklist

- [ ] Threat model written for this feature (`templates/THREAT-MODEL.md`)
- [ ] Authorization enforced server-side per resource and tenant
- [ ] Tools allowlisted, arguments schema-validated, destructive actions human-approved
- [ ] Retrieval filtered by tenant and caller permissions; deletions propagate
- [ ] Memory writes validated, scoped and expirable
- [ ] Outputs escaped/validated before reaching HTML, SQL, shell or another service
- [ ] Token/time/step/spend limits and a circuit breaker in place
- [ ] Adversarial fixtures in the test suite with objective pass criteria
- [ ] No claim that prompt filtering alone makes the system secure
