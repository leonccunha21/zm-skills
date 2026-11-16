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

## Memory models (how the agent should store things)

Project memory has three layers (above). Inside those layers, keep three **kinds** of memory straight — confusing them is why agents re-ask settled questions or drown in stale notes:

| Model | What it holds | Lives in | Written when | Read when |
|---|---|---|---|---|
| **Procedural** | How we do things here: commands, gates, conventions, pitfalls | `RULES.md`, `AGENTS.md`, `SKILL.md`, runbooks | A delivery lands or a convention changes | Every task, at kickoff |
| **Semantic** | Facts of the project: decisions, ADRs, entity names, integrations, boundaries | `docs/adr/`, registries, READMEs | A fact was discovered or changed | Before deciding anything that depends on it |
| **Episodic** | What happened, when: deliveries, incidents, handoffs | delivery logs, coordination docs | After each delivery/incident | Before repeating similar work |

Working rules:

1. **Write at the source of the fact.** One copy; everything else points. Copies drift.
2. **Episodic memory decays.** Prune, or mark `superseded` as its contents stop being true. Recurring lessons **graduate** to procedural or semantic form — that is how the project learns.
3. **Semantic memory wins conflicts.** When code and doc diverge, the ADR is reopened by writing a new one, never by silent override.
4. **Procedural memory is re-read, not recalled.** Rules are consulted at kickoff; they don't live in the agent's context by habit.
5. **Model discipline saves tokens.** An agent that knows "this is episodic → check the log, this is procedural → read RULES.md" loads the right file and 100 fewer it didn't need (see `13-token-economy.md`).

## Task context model (kickoff block)

Before acting, the working context is explicit and short — it is the difference between an agent that decides and one that improvises:

| Field | What it captures | Source |
|---|---|---|
| Objective | the outcome in user-visible terms | the task |
| Constraints | scope, red lines, approvals needed | `RULES.md`, project files |
| Relevant architecture | modules, contracts, seams | `README`, ADRs, code |
| Current state | branch, status, findings, prior evidence | `git status`, delivery log |
| Decisions in force | ADRs that constrain this task | `docs/adr/` |
| Evidencias at hand | outputs already run | tests, CI, logs |
| Open items | what this task does not solve | pending file |

Working rules:

1. **Technical claims about the project cite a source** — `path:line`, a command output or a decision record. "I believe the code does X" is not a claim.
2. **Separate fact from inference.** Label: *confirmed* (with source) · *inference* (reasoned, verifiable) · *hypothesis* (untested) · *approved decision* (ADR/owner). Never blend them in the same sentence.
3. **Do not inline whole files.** Path + resummed section is enough; the file is the source of truth. Copying creates staleness and bloats context.
4. **Prefer the executable.** If the claim can be verified by running the code or tests, run it instead of trusting any document, including memory.
5. **Freshness wins.** Newer verified evidence outranks older documentation; note the divergence and fix the doc in the same delivery (see Layer 1).

## Keeping memory true

- **Precedence when sources disagree:** project `RULES.md` → code/config as actually running → current docs (with date) → ADRs → delivery logs → old memory. Record the divergence, never silently pick one.
- **Expire the temporary.** Versions, endpoints, deploy targets, sprint priorities: stamp them with a review date. On expiry they are re-verified or removed, not trusted.
- **Detect and repair staleness:** before trusting a memory fact in a decision, re-read its source. When code and memory contradict, the memory is stale — open it, verify, update or mark `superseded`.
- **Update memory on milestones:** after an architectural change, an important decision, and the end of a long task — one entry, with date, SHA and the next owner.
- **Memory is never a secret store.** No tokens, passwords, personal data or customer content in any memory file — not even marked "temporary". If a secret was committed, treat it as compromised and rotate it (see `07-security.md`).
- **Handoff between sessions/agents** closes a task boundary. A handoff states: objective, current state, files touched, commands run with real output, open items, next step — and nothing invented. Example:

```markdown
<!-- handoff: 2026-11-16 · session A → session B -->
Objective: fix order total bug (#123)
State: branch fix/order-total @ a1b2c3d, 2 files modified, tests green (quoted)
Files: src/order/total.ts, src/order/total.spec.ts
Open items: tax rounding needs owner decision (ask before shipping)
Next step: review PR; do not merge without finance sign-off
```

## Memory hygiene

1. **One source of truth per fact.** Copies point at it; they never duplicate. Duplication drifts; drift confuses agents; confusion destroys trust in the record.
2. **Prune regularly.** Lost relevance (completed migration, superseded decision) → remove or mark `superseded`.
3. **Sediment is the enemy.** Every delivery deletes what it invalidated; adding is easy, pruning is discipline.
4. **Date and SHA on everything.** Without them, the log becomes folklore.
5. **Agent memory ≠ product memory.** Prompt/session context is volatile; git isn't. A decision written only in a prompt is already lost.
