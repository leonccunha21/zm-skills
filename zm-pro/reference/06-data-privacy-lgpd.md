> Scope: engineering guidance for personal-data work, as of 2026-11-16. LGPD (Lei 13.709/2018) and GDPR positions evolve; figures, art. references and companion-pack availability are examples, verified when written and re-reviewed quarterly (`docs/maintenance-policy.md`). This is not legal advice — DPO/counsel sign off.

# 06 - Personal data & LGPD

The kit does not rewrite privacy law, and this chapter is not legal advice. It tells an agent **when privacy obligations attach**, which engineering controls keep them manageable, and — for Brazil — when to reach for the companion LGPD Skills pack. In the EU/UK, map the same checklist onto GDPR (lawful basis, DPIA, DSAR, retention, transfers, art. 30 records); the engineering steps are identical.

## Companion: LGPD Skills (MIT)

For projects subject to LGPD (Lei 13.709/2018), use the companion open pack instead of improvising: [goul4rt/lgpd-skills](https://github.com/goul4rt/lgpd-skills) — a central `lgpd-audit` maestro dispatching 18 specializations: data mapping (ROPA), legal basis, consent, DSAR, retention/erasure, incident response, vendor audits, international transfers, encryption, anonymization, DPIA (RIPD) and the ECA Digital rules for minors. Output is **engineering draft material in `.lgpd/`, never certification**. Validate with your Encarregado/DPO or counsel before legal conclusions.

## When privacy review attaches

Any feature touching **personal data** — directly (name, CPF/CNPJ, email, phone, address, photo, biometrics) or indirectly (IP, device/ads ID, geolocation, account identifiers, health or financial data):

- Signup/authentication, profiles, billing, OCR of documents, public scheduling, analytics, backups/exports, third-party integrations (WhatsApp, payments, transactional email)
- Any new collection, use, sharing or retention
- Incident, leak, deletion request (DSAR), policy/ROPA/RIPD review

## What to do

1. **Install the companion once per project** (`.agents/skills/lgpd-*` or the harness equivalent); keep it versioned with its license. Never paste copies of it elsewhere — drift makes stale law win.
2. **Invoke the maestro** for audits (`lgpd-audit`), or the specific specialist when the topic is clear (`lgpd-data-mapping` → `lgpd-legal-basis`, `lgpd-dsar`, `lgpd-incident-response`).
3. **Drafts go to `.lgpd/`** — typically versioned on purpose with a no-PII test guarding it; `*.rascunho.md` / `draft-*.md` / `.local.md` stay untracked.
4. **Privacy by default in code**: data minimization (collect the minimum that works), explicit legal basis per purpose, retention with automatic erasure (tombstones), encryption in transit and at rest, pseudonymization in logs/fixtures (synthetic data only), least-privilege access.

## Hard limits

- **Drafts ≠ compliance.** Legal bases, ANPD reporting, public policy text and ECA Digital assessments require your DPO/counsel. Engineering produces drafts and controls; legal responsibility stays human.
- **Never** send real personal data of any kind to external tools (LLMs, pastebins, tickets, screenshots). Production dumps stay offline and out of git.
- **Children/teens (LGPD art. 14 / ECA Digital)**: lawful basis = the child's best interests; consent specific and prominent. Treat as blocking whenever the audience is mixed.
- Legal texts cite norms that change — check planalto.gov.br/ANPD (or your regulator) for the current version before deciding on a live case.

## Minimal checklist per feature

1. What personal data does this feature collect, from whom, why? (update the ROPA/records)
2. Legal basis? Consent needed, and how revoked?
3. Minimization — can it work without this field?
4. Retention clock — and how is erasure executed (tombstone)?
5. Leaves the system/country? Vendor contracts with privacy clauses?
6. Logs/errors anonymous? Fixtures synthetic? Backups encrypted?
7. Can data subjects actually exercise access/correction/erasure/portability?
