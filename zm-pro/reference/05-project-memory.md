# 05 — Project memory

Symmetric failures kill projects: (a) deciding without memory — re-deciding what was settled; (b) remembering without discipline — context piles up until nobody finds anything. Three layers, in descending order of authority.

## Layer 1 — Institutional memory (versioned; the source of truth)

Survives every session/model/machine. Lives in the repository:

- `README.md` — what the project is and how to run it
- `RULES.md` / `AGENTS.md` — what may never happen here
- `docs/adr/NNNN-*.md` — why each relevant decision was made
- **Delivery log** — per delivery: date, SHA, evidence, open items
- **Open-items/pending file** — what awaits what (environment, homologation, business call)
- **Reference triage log** — what from catalogs is adopted/observing/discarded in this project

Rule: if an agent doubts something about the project, the answer is here — not in a chat. Code and docs diverge? Code describes the present; the doc describes intent. Record the divergence and fix the doc in the same delivery.

## Layer 2 — Session & coordination memory (versioned; ephemeral)

- Coordination doc: fronts, file ownership per session, write order
- End-of-session handoff: done / missing / verified / risky (see `04-multi-agent`)
- Loose notes only in `*.local.md` / `draft-*.md` — **never committed**

Layer 1 is for the future; Layer 2 is for the week. Both live in the repo. None lives in the chat.

## Layer 3 — Structural memory (optional, on demand)

Maps the *code* — what calls what — so agents navigate without rereading everything:

- **Graphify** / **Codebase Memory MCP** — dependency graph over code↔docs, incremental reindex on diff
- **OpenViking** — folder-tree knowledge base with on-demand retrieval (long-context projects)
- **Obsidian** as the conceptual reference (links + graph for human knowledge)

Before adopting any of them: license, local/offline operation, what data leaves the machine (never customer data, tokens or production dumps without explicit, anonymized, written approval), and cost-zero or approved budget. They are **references and optional tooling — never required dependencies**, and never destinations for real data.

## Memory hygiene

1. **One source of truth per fact.** Copies point at it; they never duplicate. Duplication drifts; drift confuses agents; confusion destroys trust in the record.
2. **Prune regularly.** Lost relevance (completed migration, superseded decision) → remove or mark `superseded`.
3. **Sediment is the enemy.** Every delivery deletes what it invalidated; adding is easy, pruning is discipline.
4. **Date and SHA on everything.** Without them, the log becomes folklore.
5. **Agent memory ≠ product memory.** Prompt/session context is volatile; git isn't. A decision written only in a prompt is already lost.
