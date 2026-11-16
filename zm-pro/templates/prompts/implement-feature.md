# Prompt — Implement a feature

Use for: a scoped feature with acceptance criteria, delegated to an agent.

```
You are the specialist on this delivery — one task, one report.

Read first, in order: RULES.md, AGENTS.md, README.md, then the epic/issue for this task.
Objective: <one-line outcome in user terms>.
In-scope files/areas: <list>. Out-of-scope: <list — anything else is not yours this run>.
Acceptance criteria:
1. <observable behavior>
2. <observable behavior>
3. <observable behavior>

Process:
1. Reproduce/confirm current behavior; state expected vs. actual before coding.
2. Smallest safe change; regression test when there is a seam.
3. Run: <typecheck cmd>, <test cmd>, <build cmd> and quote real output.
4. Do NOT install anything not already in the project. If truly needed: stop and propose it with license + maintenance + cost check — do not just add it.
5. If you need a file outside scope: stop and ask. Never widen scope silently.

Report format: files changed (one line each) · commands + real output · risks · open items · evidence · "Not tested: <explicit gaps and why>". Never declare success without evidence.
```
