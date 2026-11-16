# 04 — Multi-agent coordination

The working model is not an unconstrained swarm: it is **coordinated agents working in clear file boundaries, one task at a time, with written scope and verifiable handoffs**. Simplicity beats sophistication.

When multiple agents or platforms (such as OpenCode, Antigravity, Claude Code, Cursor, Codex, or Gemini CLI) touch the same repository simultaneously, this guide establishes the cross-platform communication and collision-prevention protocol.

## Roles

- **Coordinator (human or lead session):** decides the single task and defines objective, in-scope files and acceptance criteria. Delegates; verifies. Never adds "just one more thing" while a specialist works.
- **Specialist (session or subagent):** executes exactly one task inside its declared file scope, and reports back: what changed, how it was verified, and what could not be tested.
- **Reviewer:** cold-reads the diff against acceptance criteria — flags gaps, regressions or scope creep; never silently rewrites.

## The Cross-Platform Shared Medium

Proprietary agent chats, browser panels and vendor memory are siloed: an OpenCode process in a terminal cannot read an Antigravity IDE chat or a Claude Code prompt history.

The universal, vendor-agnostic shared medium across all AI tools is the **repository filesystem and git**.

Multi-agent coordination operates across two layers:

1. **Transient Coordination (Runtime presence, locks and blackboard):**
   Lives in `.agents/coordination/` (ignored by git). Tracks active sessions, claimed files, heartbeats and inter-agent messages.
2. **Durable Coordination (Workstream boundaries, handoffs and ADRs):**
   Lives in `COORDINATION.md` and `docs/adr/` (committed to git). Tracks permanent responsibilities, architectural decisions and milestone handoffs.

## Operating Rules

1. **One task per session.** The delegation prompt carries: objective, in-scope files/areas, acceptance criteria, at most 3 references (name + link), and verification commands.
2. **Announce and claim before editing.** Before writing files, a session registers its presence and claims its targets:
   ```bash
   node scripts/coordinate.mjs register --id <session-id> --platform <platform> --task "<task>" --files "<file1,file2>"
   ```
3. **Check before write (Collision Prevention):** An agent checks that target files are not claimed by another active session:
   ```bash
   node scripts/coordinate.mjs check <path> --id <session-id>
   ```
   If claimed by another active agent, the check exits non-zero: **stop immediately** and do not overwrite.
4. **Disjoint file scopes per working tree.** Parallel sessions must operate on disjoint file paths (e.g., Session A owns `src/api/`, Session B owns `src/ui/`). Shared files require written handoff or an explicit sequence order.
5. **Never bury another session's WIP.** Check `git status` before writing. Commit using explicit pathspecs (`git add <path1> <path2>`), never blanket commands (`git add -A` or `git add .`) that capture another active session's unfinished changes.
6. **Asynchronous blackboard messaging.** When an agent completes a milestone, detects a blocker, or needs another platform to take over, it posts to the shared message log:
   ```bash
   node scripts/coordinate.mjs post --from <session-id> --to <target|all> --msg "<message>" --type <handoff|info|alert>
   ```
   Other active agents read pending notices with `node scripts/coordinate.mjs read`.
7. **Release upon completion.** When finished or paused, release file claims so other agents can proceed:
   ```bash
   node scripts/coordinate.mjs release --id <session-id>
   ```
8. **Handoff carries state and evidence.** Every handoff between sessions must be written down with commit SHA, modified files, quoted test output, open risks and explicit next steps.
9. **Communication is an artifact.** Decisions become ADRs or entries in `COORDINATION.md` — never only ephemeral chat. Chat fades; the repository stays.

## Coordination Protocol Commands

The zero-dependency `scripts/coordinate.mjs` tool coordinates agents across arbitrary harnesses without network calls:

| Action | Command | Purpose |
|---|---|---|
| Register / Heartbeat | `node scripts/coordinate.mjs register --id <id> --platform <name> --task "<task>" [--files <a,b>]` | Announce presence and claim working files |
| Check Conflict | `node scripts/coordinate.mjs check <file> [--id <id>]` | Verify file is safe to edit (exits 0 if safe, 1 if claimed) |
| Inspect Status | `node scripts/coordinate.mjs status [--json]` | View active sessions, heartbeats, claims and conflicts |
| Post Message | `node scripts/coordinate.mjs post --from <id> --to <target|all> --msg "<text>"` | Post notice or handoff to blackboard |
| Read Messages | `node scripts/coordinate.mjs read [--from <id>] [--limit <n>]` | Read recent messages from other agents |
| Release Claims | `node scripts/coordinate.mjs release --id <id> [--files <a,b>]` | Release claimed files or mark session finished |
| Purge Stale | `node scripts/coordinate.mjs clean [--stale-minutes <m>]` | Remove released or dead sessions (> 15m default) |

## Delegation Prompt Template

```markdown
Read RULES.md, AGENTS.md, the project guide and this task.
Objective: <X>.
In-scope files: <list>.
Acceptance criteria: <list>.
Run: node scripts/coordinate.mjs register --id <id> --platform <platform> --task "<X>" --files "<in-scope-files>"
Check safety: node scripts/coordinate.mjs check <file>
Run verification commands <commands> and report real output.
Install nothing from catalogs without an explicit decision; if you need files outside scope, stop and ask.
Do not declare success without evidence.
Release claims: node scripts/coordinate.mjs release --id <id>
```

## Formal Handoff Contract

When a session finishes its task and hands over to another agent (e.g. OpenCode backend → Antigravity frontend), record the handoff in `COORDINATION.md` or via `node scripts/coordinate.mjs post --type handoff`:

```markdown
### Handoff: [timestamp] · [from-session] → [to-session]
- Objective: [what was built or fixed]
- State: branch [branch-name] @ [commit-sha], [N] files modified
- Files: [exact list of touched paths]
- Verification: [commands run and real output quoted]
- Open items: [what this session intentionally did NOT do]
- Risks: [edge cases or dependencies to watch]
- Next step: [clear actionable task for the receiving agent]
```

## Conflict and Stop Protocol

- **Concurrent Claim Collision:** If two agents attempt to claim the same file, the earliest active registered claim wins. The second agent must yield, select an alternative unblocked workstream, or request human intervention.
- **Stale Sessions:** Sessions with no heartbeat for > 15 minutes are flagged `[STALE]`. Confirm process inactivity before purging with `node scripts/coordinate.mjs clean`.
- **Architectural Divergence:** If agents propose conflicting interfaces or schemas, write an ADR under `docs/adr/` and pause for human review. Never engage in edit wars.

## Anti-patterns

- Two agents editing the same file in parallel without mutual agreement.
- Blanket staging (`git add .` or `git add -A`) in a shared working tree.
- Coordinator who also executes (bottleneck; no independent verification).
- Silent scope expansion: modifying files outside declared in-scope paths.
- Unbounded subagent spawning without file budget, exit criteria or merge plan.
- Retrying failing steps in an infinite loop without stopping to ask.
- Passing work to the next agent with only "done!" and no commit SHA, modified files or test evidence.

## Closing a Multi-Agent Session

1. Run `node scripts/coordinate.mjs release --id <id>` to unblock claimed files.
2. Ensure `git status` is clean or remaining WIP is documented and owned.
3. Verification commands quoted with real output in the delivery record.
4. `COORDINATION.md` handoff log updated if work continues in another session.
5. The next task is named — or the engagement is explicitly closed.
