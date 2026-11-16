# 04 — Multi-agent coordination

The working model is not a swarm: it's **one coordinating agent, one task at a time, with a written scope**. Simplicity beats sophistication. When multiple agents/sessions touch the same repository, these are the protocols.

## Roles

- **Coordinator (human or lead session)** decides the single task and defines objective, in-scope files and acceptance criteria. Delegates; verifies. Never "just one more thing" while a specialist works.
- **Specialist (session or subagent)** executes exactly one task, inside its file scope, and reports back: what changed, how it was verified, what couldn't be.
- **Reviewer** cold-reads the diff — flags gaps; never silently rewrites.

## Operating rules

1. **One task per session.** The delegation prompt carries: objective, files/areas in scope, acceptance criteria, at most 3 references (name + link), verification commands. Never "build the whole app".
2. **Scope is declared.** The specialist lists the files it will touch; needing a file outside scope = stop and ask — never silently expand.
3. **One front at a time per working tree.** Parallel sessions split by disjoint file lists (classic A/B split, documented in e.g. `docs/AGENT-COORDINATION.md`). A shared file means an explicit written agreement on who writes first.
4. **Never bury another session's WIP.** The coordinator checks `git status` first; commits are pathspec-scoped (`git add <paths>`), never `git add -A` with other sessions' work in the tree.
5. **Handoff carries state.** When pausing/passing on: what's done, what's missing, what was tested (and how), what's risky. No written handoff = the next session redoes or breaks.
6. **Communication is an artifact.** Decisions become ADRs/logs in the repo — never only in the chat. Chat fades; the repository stays.

## Delegation prompt template

> Read `RULES.md`, `AGENTS.md`, the project guide and this task. Objective: <X>. In-scope files: <list>. Acceptance criteria: <list>. Run <commands> and report real output. Install nothing mentioned in catalogs without an explicit decision; if you need something outside scope, stop and ask. Do not declare success without evidence.

## When to escalate to formal orchestration

Only when the real workflow demands it: handoff pipelines (e.g., Microsoft Agent Framework — human-in-the-loop, checkpoints), stateful graphs with resumption (LangGraph), or deterministic automation (n8n/Temporal). Multi-agent dashboards are **UX references, not dependencies**. Swarm runtimes require explicit decision, license/cost analysis and threat modeling — do not adopt casually.

## Anti-patterns

- Two agents editing the same file "in parallel" without agreement
- Coordinator who also executes (bottleneck; no independent verification)
- Task without acceptance criteria → premature "done"
- Unbounded subagent spawning without merge plan or budget
- Retry/fix loops without iteration limits or stop criteria
- Session summary as the only memory (it goes to the repo: ADR, delivery log, open-items file)

## Closing a multi-agent session

1. `git status` clean, or intentionally-left WIP documented and owned
2. Verification commands actually run; output attached to the delivery record
3. Coordination doc (if any) and delivery log updated
4. The next task is named — or the engagement is explicitly closed
