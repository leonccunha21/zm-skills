# ADR-0001: Record architecture decisions

- **Status:** accepted
- **Date:** 2026-11-16
- **Authors:** ZM
- **Scope:** whole repository

## Context

This project started on 2026-11-16. Decisions made in the first weeks will shape every later change. Without a record, future maintainers (human or agent) will re-litigate settled questions, or worse, silently reverse them. We need a lightweight mechanism to capture *why* choices were made — before memory fades.

## Options considered

### Option A — No formal records (docs/wiki comments)
- Pros: zero process overhead
- Cons: diaries of *what*, never *why*; contradicts freely; agents cannot consume reliably
- Cost: free, high long-run confusion tax

### Option B — MADR-style Architecture Decision Records in `docs/adr/`
- Pros: one file per decision, versioned with code, cheap to write, agents can diff and supersede
- Cons: slight writing overhead per irreversible decision
- Cost: free; ~15 min per decision

## Decision

Adopt **Option B**: MADR-style ADRs in `docs/adr/`, one file per decision, numbered sequentially. Default decisions stay as inline comments; ADRs are for decisions that are expensive to reverse (architecture, data, security posture, vendor commitments). New ADR supersedes the old one; history is never rewritten.

Explicitly **out of scope** of this decision: *which* architecture to use — each such choice gets its own ADR.

## Consequences

- **Positive:** onboarding (human and agent) starts from *why*; reviews cite ADRs instead of opinions; contradictions surface as explicit supersession.
- **Negative / trade-offs:** a discipline to maintain; small writing cost per decision.
- **Risks and mitigation:** ADR rot → review ADRs quarterly; missing ADRs → reviewer flags "undocumented irreversible change" in PR template.
- **What to watch:** proportion of ADRs vs. inline comments; frequency of "why is X like this?" questions answerable from `docs/adr/`.
- **Reversal criteria:** this process itself superseded if the team adopts a strictly better decision-tracking system and migrates the history.

## References

- [MADR](https://adr.github.io/madr/) · [Michael Nygard's original ADR post](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
