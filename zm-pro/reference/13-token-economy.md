# 13 — Token economy

Context is money: every file read costs tokens now **and** degrades every decision after it. The cheapest token is the one you never read; the most expensive one is a plausible answer grounded in a stale dump. Budget the context like you budget a build's minutes.

## The three rules

1. **Read on demand, never "to be safe".** The router exists so you load by track. Finishing with 10 references when 1 sufficed is a process failure, not thoroughness.
2. **Stop at sufficiency.** Enough evidence to act safely > more evidence. If another file won't change the decision, don't open it.
3. **Output is a budget line too.** Long outputs are context spent and memory rented. Demand terse answers; ask for limits.

## Budget checklist (per task)

- [ ] Task states what it needs to know, what done looks like, what files are in scope — before any file is read
- [ ] Router read; track identified; **only that track's references** loaded (never all 18)
- [ ] Files located via `rg`/`grep`/glob first; you opened the ones whose paths you saw, not the ones that looked plausible
- [ ] Expected size of each read is known (a schema beats a 400-line file; a signature beats a module)
- [ ] Session plan: one task, one track, one pass; restart/split if scope drifts (see `04-multi-agent.md`)
- [ ] Verification command and its output quoted at the end — not narrated

## Practical mechanics

| Lever | Do | Don't |
|---|---|---|
| **Index first** | `rg -l`, outline, `git ls-files \| Select-String` | open directories to figure out what's in them |
| **Surgical reads** | `Get-Content -TotalCount` / line ranges / headings only | cat entire files "for context" |
| **Cache hits** | re-read only files that changed since last session (git diff / mtime) | assume context still matches disk after hours |
| **Subagents** | narrow scope: file list, goal, return cap (e.g. "paths + 5-line evidence, nothing else") | delegate "investigate the repo" |
| **Output caps** | `rg --max-count`, `git diff --stat`, filter pipes | dump 2000-line logs into a chat |
| **Model routing** | cheap/fast for mechanical edits & summaries; strong model for design, review, security | run every turn on the strongest model |
| **Handoffs** | end-of-session summary ≤ ~40 lines: done / missing / verified / risks | carry the whole transcript into the next task |
| **Format discipline** | tables and short lines for recurring data; one fact per line | prose walls in planning docs |

## Rules of thumb

- 4 characters ≈ 1 token. A 400-line file ≈ 6–8k tokens — that's a real budget line, not "a read".
- If you're about to read more than ~3 files before doing anything, you're probably doing the wrong task or wrong shape of it — stop and re-scope.
- Repetition inside one session usually marks missing project memory: write it down once (`reference/05-project-memory.md`), refer to it thereafter.
- A long session that "almost works" usually means drift, not capability: split the task, not the patience.

## When to spend more

Security and privacy tracks are allowed to read more: a missed auth path costs more than tokens. Evidence rules still apply — read precisely, just more broadly.

## Protecting context from loss (compaction)

When a long session risks being summarized mid-task, do not rely on vibes: write the state to disk before the summary happens. Symptoms of loss: re-asking settled questions, rereading files already read, restating constraints mis-remembered. Protocol: (1) at natural boundaries, write a ≤40-line handoff to `*.local.md` or the coordination doc — objective, state, files, commands with output, open items; (2) pin non-negotiables in the first lines of any fresh session; (3) after compaction, re-read `RULES.md`/`AGENTS.md` and the handoff before acting; (4) verify nothing was dropped by re-checking the active task's constraints. If compaction is imminent, split the task instead of summarizing it.

## Diagnostics

| Symptom | Likely cause | Fix |
|---|---|---|
| Agent re-asks settled questions | memory not written/read | project memory write (`05`), kickoff reads RULES.md |
| Agent reads same docs every session | no handoff; no caching discipline | end-of-session summary; session budget |
| Answers get vaguer as session grows | context saturation | fresh session; write notes to disk; split task |
| Verification feels like ceremony | protocol treated as ritual | assertions with real output, or say "not tested" |

## The one-line version

> Spend the smallest context that gets the task done *correctly*; spend the rest honestly.
