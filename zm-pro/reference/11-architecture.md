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

## Boundary enforcement and static verification

Do not rely on convention alone to maintain architectural boundaries:

1. **Circular dependency check:** Run a circular reference scan (e.g. `madge --circular` or dependency-cruiser) before merging structural changes. Cycles indicate conflated boundaries.
2. **Layer isolation:** Configure linter rules or path-mapping restrictions so UI layers cannot import database drivers, ORMs, or platform adapters directly. If domain imports infrastructure, fail the build.
3. **Internal vs public exposure:** In monorepos or multi-folder projects, use explicit `index.ts` or package export maps (`package.json#exports`) to export only public ports, keeping implementation files unimported by siblings.

## Contract evolution procedure (additive-only rollout)

When evolving a published API, event payload, or database model:

1. **Phase 1 (Additive):** Add new fields as optional/nullable with safe default values. Consumers update safely without coordination.
2. **Phase 2 (Dual-write / Dual-read):** Producers write both old and new formats; consumers read new format with fallback to old.
3. **Phase 3 (Deprecate):** Announce deprecation window in CHANGELOG and delivery notes; log warnings on deprecated field access.
4. **Phase 4 (Decommission):** Remove old fields only after metrics verify zero consumer traffic over the agreed SLA window.

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
- Bypassing the domain layer to write directly to database tables from UI event handlers
- Cyclic module dependencies resolved with dynamic imports (`require()` or deferred `import()`) to hide architectural tangles

## Delivery checklist

### Module design and boundary checklist
- [ ] Deep module heuristic verified: interface exposes minimal surface while encapsulating complex behavior
- [ ] Dependency direction strictly respected: UI → Domain → Infrastructure (ports); wiring at composition root only
- [ ] No circular dependencies introduced across module or folder boundaries
- [ ] Every external side-effect (clock, network, database, filesystem, environment) isolated behind a testable seam
- [ ] No generic "util" dumping ground created; functions colocated with their specific domain owner

### Architectural change and ADR delivery checklist
- [ ] ADR drafted using `templates/ADR.md` for irreversible decisions (alternatives compared, consequences recorded)
- [ ] Contract changes follow additive-only evolution; executable schema updated and verified with examples
- [ ] Migration strategy defined (strangler / dual-run / feature switch) before first breaking commit lands
- [ ] Deprecation schedule and rollback mechanism documented in PR and CHANGELOG
- [ ] Verification evidence attached showing both new and legacy paths behaving deterministically during transition
