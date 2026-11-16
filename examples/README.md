# Examples — see zm-pro in action

Copying files blindly teaches little; seeing a filled project teaches the pattern. This folder contains a small but complete example of a project using zm-pro from day one — **not** a template to stamp out, but a reference to derive your own from.

## `minimal-project/`

A fresh React+TypeScript-style web app on the day after `git init`, showing:

- `AGENTS.md` — the agent protocol **filled in with real commands** (compare with `templates/AGENTS.md`, which is the blank version)
- `docs/adr/0001-record-architecture-decisions.md` — a real ADR written with `templates/ADR.md`, showing Context → Options → Decision → Consequences filled in
- `docs/DELIVERY-LOG.md` — two delivery entries with evidence, showing what "done" looks like in practice

To use it as a starting point: copy `zm-pro/` into your project (see the root README), copy the files you need from here, then **adapt** — commands, names, risks and scopes differ per project. The point is the shape: rules first, evidence always, one source of truth.
