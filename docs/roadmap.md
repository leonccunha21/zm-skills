# Roadmap

Direction, not promises. Dates live on released versions — see [`CHANGELOG.md`](../CHANGELOG.md).

## 0.4.x — Hardening (current cycle)

The kit teaches "your project wins over the kit" — so this cycle starts by making the repository itself obey that rule:

- [x] Root `AGENTS.md` / `RULES.md` for this repo (it was the one project not following its own template)
- [x] `docs/harness-compatibility.md` — tested/unverified matrix with evidence, never a marketing claim
- [x] `docs/demo.md` — the real 0.4.0 pilot, walkthrough with commands and output
- [x] `scripts/install.mjs` — zero-dependency installer (`opencode` / `claude` copy; `codex` / `cursor` / `gemini` print the manual route)
- [x] `scripts/checksums.mjs` — `CHECKSUMS.txt` for releases, via `npm run checksums`
- [x] Router version sync enforced by the validator (`SKILL.md` ↔ `package.json`)

## 0.5.0 — Candidates (in discussion)

No order implied; contributions welcome:

- Publish the pilot as a public example repository (pending its author's decision)
- Fill the harness matrix from real community reports (Claude Code / Cursor first)
- Native Cursor rule generation (`.cursor/rules/`) alongside the manual "point at SKILL.md" route
- `checksums` attached to GitHub releases via CI on tags

## Not on the roadmap — by design

- Runtime dependencies, telemetry, network calls inside the skill
- Vendor lock-in to a single harness
- Silent auto-updates — the kit is copied, never fetched on your machine behind your back
