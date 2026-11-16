# Project profile

> Copy to your project root as `PROFILE.md` (or paste the block into `RULES.md`). One screen, no proprietary format. Delete lines that do not apply — an explicit "not applicable" beats a guess.

```markdown
Profile: essential | professional | critical | audit

Escalate to a stricter profile when the task touches:
- personal data / regulated data
- payments, billing or money movement
- production infrastructure or customer-facing deploy
- irreversible data changes

Commands
- install:  <command>
- dev:      <command>
- typecheck:<command>
- lint:     <command>
- test:     <command>
- build:    <command>
- e2e:      <command or "none">

Gates before PR
- <command> must be green
- secrets scan / dependency audit: <command or "manual review">
- accessibility check: <manual | tool + scope>

Data and privacy
- personal data stored: <none | fields + purpose + retention>
- third parties that receive data: <none | names + DPA status>
- deletion path: <how a user's data is removed>

Operations
- deploy: <command/pipeline + who approves>
- rollback: <command/path>
- on-call/runbook: <link or "none">

Constraints
- stack/version: <e.g., Node 20, Postgres 16>
- forbidden patterns: <e.g., no new dependencies without ADR>
- review owner: <role/person>
```

## How the agent uses it

1. Reads `RULES.md` → `AGENTS.md` → `PROFILE.md` before acting.
2. Chooses the profile's rigor for planning, tests, security and evidence (`reference/17-working-modes.md`).
3. Raises the profile when the trigger list matches; never lowers it silently.
4. If a command is missing, asks once or states a reversible assumption instead of inventing one.

## Rules

- A profile never disables authentication, authorization, secret handling, privacy minimums or fail-closed gates.
- Keep the file short and current; a stale command is worse than no command.
- The project's rules outrank the kit; the kit outranks external catalogs.
