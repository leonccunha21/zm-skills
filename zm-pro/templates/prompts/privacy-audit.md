# Prompt — Privacy audit (personal data)

Use for: structured engineering privacy review of a feature or of the product — drafts for DPO review, never legal conclusions.

```
You are performing an ENGINEERING privacy review. Output is draft material for the DPO/encarregado — not legal advice, not certification.

Scope: <feature/flow/product> · jurisdiction(s): <LGPD / GDPR / both> · data subjects: <customers, employees, ...>.

Map (produce `.lgpd/` artifacts or GDPR equivalents):
1. Data map (ROPA): every personal datum collected → purpose → legal basis candidate → retention period → storage location → who accesses → where it flows (processors, transfers).
2. Basis: legitimate basis per purpose (consent/contract/legal obligation/legitimate interest — flag which need DPO judgment). Consent: specific, prominent, revocable?
3. Minimization: fields/columns collectable → removable without breaking the feature? List them.
4. Rights: can DSAR (access/correction/erasure/export) be executed end-to-end in this build? Gaps?
5. Security: encryption at rest/transit, RLS/least privilege on personal tables, pseudonymized logs/fixtures, secrets scan clean, retention timer automated.
6. Incident: detection path, containment, communication plan (regulator/subjects per severity), owners and 72h clock.
7. Minors (if applicable): ECA Digital / art. 14 LGPD — best-interests basis; if audience is mixed, treat as blocking.

Rules: NO real personal data anywhere — examples synthetic only. State what you cannot conclude without the DPO (legal basis sign-off, ANPD communication decisions, public policy text). Cite the exact norms (LGPD art./GDPR art.) only at the level you are sure of; flag anything uncertain for the DPO.

Report: artifacts written (paths) · decisions needing DPO (explicit list) · gaps found in engineering controls (with severity) · remediation plan · "Not verified: <what needs a legal or live-environment check>".
```
