# 17 — Working profiles and modes

> Two dials, not one. A **profile** says how much rigor the project needs; a **mode** says what kind of work this task is. Neither one grants permission for destructive or external actions.

## Profiles

Declared in the project's `RULES.md`/`AGENTS.md` (or a short `PROFILE.md` copied from `templates/PROJECT-PROFILE.md`). Default when nothing is declared: **professional**.

| Dimension | Essential | Professional (default) | Critical | Audit |
|---|---|---|---|---|
| Planning | one line | short plan for multi-file work | plan + risks + rollback | report scope and method |
| Tests | the seam touched | unit + regression on the seam | unit, integration, contract, E2E where risk justifies | evidence that tests exist and pass, not new tests |
| Security review | checklist for auth/data changes | per-feature review using `07` | threat model + adversarial tests | independent review, findings first |
| Privacy | data touched? check `06` | data map + retention for new fields | DPIA-style review, DPO sign-off | verify controls and documents |
| Documentation | changelog line | changelog + README/ADR when behavior changes | ADR + runbook + release notes | findings and evidence |
| Evidence | output of the command run | output + risks + open items | + rollback rehearsal | + reproducibility steps |
| Human approval | destructive actions | destructive actions, deploys | all production changes | none granted: audit is read-only |

Rules:

- A profile **never** disables authentication, authorization, privacy minimums, secret handling or fail-closed gates. "Essential" means less ceremony, not less safety.
- Escalation is one-way within a task: if the work turns out to touch personal data, production or money, step up the profile and say so.
- The project declares its profile once; individual tasks may raise it, never silently lower it.

## Modes

| Mode | Goal | Allowed | Deliverable | Stop when |
|---|---|---|---|---|
| **Discovery** | map the project: stack, architecture, commands, risks, gaps | read, inspect, run read-only commands | map + prioritized gaps | a decision needs the owner |
| **Implementation** | deliver one bounded change | edit inside scope, run tests | diff + test + delivery record | scope grows or a gate stays red |
| **Audit** | find and rank problems | read, run checks, write the report | findings with severity, evidence, fix | you catch yourself editing code |
| **Remediation** | fix approved findings, one risk group at a time | edit, tests | per-group diff + regression proof | an unapproved finding appears |
| **Modernization** | plan and stage upgrades/migrations | branch, compatibility shims | staged plan with rollback per step | compatibility with supported versions is unproven |
| **Incident** | contain, preserve evidence, restore, communicate | approved mitigations only | timeline, mitigation, post-mortem | root cause needs a risky production change |
| **PR review** | judge correctness, security, tests, maintenance, impact | read, run tests, comment | review with blocking/non-blocking findings | approval would require unavailable context |

Rules:

- A mode describes behavior, not authority. Deploy, publish, spend and delete still need explicit approval (`14-agent-operations.md`).
- Announce the mode when it changes what you will do: "audit only, no edits".
- Do not mix modes silently: fixing during an audit destroys the evidence trail; auditing during an incident delays containment.

## Minimal declaration

```markdown
<!-- PROFILE.md / section of RULES.md -->
Profile: professional
Escalate to critical when: personal data, payments, production access
Commands: npm run typecheck · npm test · npm run build
Gates: both must be green before a PR
```

## Examples by project type

**Personal project (essential)**

```markdown
Profile: essential
Escalate: when it stores personal data or goes to production
Commands: npm run dev · npm test
Gates: tests green before pushing to main
```

**SaaS (professional → critical)**

```markdown
Profile: professional
Escalate to critical when: billing, authentication, multi-tenant data, migrations
Commands: pnpm typecheck · pnpm test · pnpm build · pnpm e2e
Gates: all green; staging smoke before production; rollback documented per release
Data: personal data map in docs/privacy; deletion path tested
```

**Open-source library (professional)**

```markdown
Profile: professional
Escalate: when a change breaks the public API (major, migration notes)
Commands: npm run lint · npm test · npm run build
Gates: tests + typecheck on the supported Node matrix; changelog entry
Support: latest minor only
```

**Critical system (critical)**

```markdown
Profile: critical
Escalate to audit mode: any change touching money, identity or regulated data
Commands: make check · make test · make security-scan · make e2e
Gates: threat model updated; adversarial tests; restore drill current
Approvals: two reviewers; deploy window; rollback rehearsed in staging
```

## Checklist

- [ ] Profile declared (or default professional stated)
- [ ] Mode named before the first edit
- [ ] Escalation triggered by data/production/money, not by convenience
- [ ] No profile disables a fundamental control
- [ ] Deliverable matches the mode (audit ≠ fix)
