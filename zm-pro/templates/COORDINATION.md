# Project Coordination Board

> Operational blackboard for multi-agent and cross-platform collaboration (OpenCode, Antigravity, Claude Code, Cursor, Codex, Gemini CLI).
> Adapt this template for your project. Keep it updated at task boundaries.

## Active Agent Sessions

| Session ID | Platform / Harness | Role | Current Task | Claimed Files | Last Heartbeat | Status |
|---|---|---|---|---|---|---|
| `session-01` | OpenCode | Specialist | Backend API migration | `src/api/*` | 2026-11-16 10:30 | Active |
| `session-02` | Antigravity | Specialist | Frontend UI client | `src/ui/*` | 2026-11-16 10:35 | Active |

## Workstream & File Partitioning

To avoid concurrent write collisions, sessions partition the tree into disjoint paths. Never edit across another active session's boundary without written handoff.

| Workstream | Owner Session | Primary Paths | Allowed Shared Reads | Status |
|---|---|---|---|---|
| Core Engine | `session-01` | `src/core/`, `tests/core/` | `src/shared/types.ts` | In Progress |
| Web Client | `session-02` | `src/web/`, `tests/web/` | `src/shared/types.ts` | In Progress |

## Coordination Protocol (CLI)

Agents announce presence and verify file availability before editing:

```bash
# 1. Announce session and claim files
node scripts/coordinate.mjs register --id <my-id> --platform <platform> --task "<task>" --files "<file1,file2>"

# 2. Check if a target file is safe to edit (fails if claimed by another active session)
node scripts/coordinate.mjs check path/to/file.js --id <my-id>

# 3. View status and active claims across all sessions
node scripts/coordinate.mjs status

# 4. Post an asynchronous message or handoff notice to the blackboard
node scripts/coordinate.mjs post --from <my-id> --to <target-id|all> --msg "<message>" --type handoff

# 5. Read recent messages from other agents
node scripts/coordinate.mjs read

# 6. Release claims and finish session
node scripts/coordinate.mjs release --id <my-id>
```

## Handoff Log

When passing work from one agent or session to another, append a record here:

### [2026-11-16 10:45] `session-01` → `session-02`
- **Objective:** Deliver order processing API
- **Commit / State:** `git checkout branch-feature` @ `abc1234`
- **Files Touched:** `src/api/orders.ts`, `src/api/orders.spec.ts`
- **Verification Evidence:** `node --test src/api/orders.spec.ts` → 5/5 passing
- **Open Items:** Client retry behavior not implemented (owned by `session-02`)
- **Risks:** Idempotency key required in payload header
- **Next Step:** Implement frontend submission form in `src/web/checkout.tsx`

## Conflict Escalation Protocol

1. **Overlap detected:** If two agents need the same file, the earliest registered non-stale claim wins. The second agent stops and posts to the blackboard or requests human coordinator intervention.
2. **Stale claims:** Sessions with no heartbeat for > 15 minutes are treated as stale. Reclaim only after confirming process termination with `node scripts/coordinate.mjs clean`.
3. **Architectural divergence:** If agents disagree on a shared contract or schema, write a candidate ADR in `docs/adr/` and pause for coordinator/human review.
