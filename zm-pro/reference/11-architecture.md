# 11 — Architecture & module design

Structure decisions are the most expensive to undo; make them deliberately, early, reversibly when possible. Reference lineage: Ousterhout (*A Philosophy of Software Design*), Martin Fowler (dependency direction), GoF (seams), your own ADRs.

## Deep modules (the core heuristic)

A module is deep when its **interface is small relative to the implementation it hides** — callers learn little, get much. Shallow modules (big interface, thin logic) multiply call-site knowledge and leak change. Test: can callers use this without knowing what's inside? If not, the boundary is wrong.

Corollaries: no "util" junk-drawers (each dumping ground is an unreviewed architecture); no getters/setters-in-disguise that leak internals; no abstraction invented for its first call site — first duplication informs abstraction, it doesn't demand it.

## Dependency direction

- **UI → domain → infrastructure.** Never the reverse. Domain modules know nothing about HTTP, SQL, React or vendor SDKs.
- Infrastructure depends on the domain's ports (interfaces); wiring happens at the composition root (`main`, `server.ts`, `index.tsx`).
- When a feature needs a new dependency direction, you found either a missing port or a module with the wrong home — fix the boundary, don't invert the arrow.

## Seams & testability

Design every external-effectful edge as a seam: system clock, RNG, network, database, filesystem, env vars. Production code uses real adapters; tests inject fakes. A seam is small (one function/one interface); 10 is a smell.

## When to split (and when not)

Split a module when: two **reasons to change** collide inside it, its name needs "and", or it's so coupled that a change in one direction breaks the other. Stay monolithic while: one team, one product, one deploy — premature service boundaries are premature abstraction at infrastructure scale (network calls, distributed transactions, deploy coordination) for problems a folder solves.

## Contracts across boundaries

- Version everything public: HTTP APIs, events, files, CLI flags, DB schemas your consumers see.
- **Additive-only evolution**; deprecate with a written window; breaking changes = MAJOR version.
- Write the contract down (schema + example); the schema is the code's documentation of last resort — keep it executable (zod/protobuf/JSON Schema).

## Technical debt

Tracked like bugs, not whispered about: an item in the open-items file with owner and trigger ("when we next touch X"). Pay opportunistically in code you already touch. "Later" without a trigger never happens.

## Architecture Decision Records

IRREVERSIBLE choices go in an ADR (see `templates/ADR.md`) — context, options, decision, consequences, reversal criteria. Default decisions stay inline comments with the reason. Reopening a decision? New ADR supersedes; the old one keeps its status history.

## Migrating structure (strangler, not big bang)

Structural migrations ship in reversible steps: coverage first, route behavior behind a switch, redirect one consumer at a time, compare outputs (dual-run), decommission the old path with its usage at zero. Each step is a release. If the migration touches published contracts, additive-only evolution applies and the changelog states both paths during the window (see `16-domain-playbooks.md` — legacy).

## Anti-patterns

- God module (does HTTP + SQL + business rules + formatting)
- Shared `utils` with 40 unrelated exports
- Abstractions built "for flexibility" before two concrete cases exist
- Domain types imported by DB migrations/queue schemas (leaky coupling)
- "Rewrite from scratch" as first response to debt — strangler pattern first
- Architecture by folder copy-paste: deciding module boundaries by aesthetics, not change forces
