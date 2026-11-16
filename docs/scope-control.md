# Scope control — rules for not bloating the kit

> The kit fails two ways: too little guidance, and guidance nobody can navigate. This page is the brake. It applies to content, dependencies and process — anything added must justify its existence.

## Before adding any new artifact

Ask, in this order:

1. **Does it already exist here?** Search the router, `reference/`, `templates/` and `docs/`. Duplication is the most common bloat.
2. **Can an existing reference hold it without losing its shape?** If yes, put it there (one source of truth). If the addition would make the file bloat past its useful scope, a new reference may be justified.
3. **What tasks load it?** A new reference needs a named router trigger ("Read when the task touches… X"), a maintenance owner, quality criteria, and at least one scenario in `tests/evaluations/scenarios/` that exercises it.
4. **What does it cost in context?** See `docs/context-cost.md` — justification in bytes.
5. **What does it cost in decisions?** Every rule added constrains future edits. If it cannot state a verification method, it is not a rule, it is advice — label it as such.

## What gets removed, not appended

- Content superseded by a newer reference (delete it; `git` remembers).
- A "TODO" section that ships forever (implement, move, or delete).
- Guides whose trigger exists nowhere in the kit's own delivery evidence ("who loaded this last release?").
- Duplicated checklists across files — keep one, link it.

## Stability of the core

- The core (`SKILL.md` router contract, fail-closed installer, validator gate, zero dependencies) changes rarely and only via ADR (see `docs/decisions/`).
- Experimental material lives outside the shipped skill until evaluated: proposals land in issues/PRs, never in the release tree as "temporary".

## Dependency rule

No new dependency, service, telemetry, paid integration or network requirement enters the skill, `scripts/` or the installable artifact without:

- an ADR with license, maintenance status, data-residency and cost analysis;
- an explicit owner decision;
- a migration/rollback plan.

`npm` is for contributors' convenience only (`private: true`, zero dependencies) — it is not a distribution channel.

## Marking scope and review dates

Recommendations that depend on stack, vendor, jurisdiction or law (LGPD/GDPR pointers, version-specific commands, third-party names) carry **scope and a review date**. Example:

> LGPD guidance is engineering input as of 2026-11-16; Brazilian administrative/judicial positions evolve — re-review quarterly (`docs/maintenance-policy.md`).

Anything the kit cannot verify stays labeled unverified.

## Justification for expansion

A PR that expands the kit states: **value** (what failure it prevents), **risk** (what it complicates), **maintenance** (who reviews it and how often). Reviewers reject "because we can".

## How drift is caught

- Release-time re-audit: `docs/instruction-audit.md` (duplicates/contradictions) and `docs/context-cost.md` (budget).
- `EVALUATIONS.md` gates whether the router/references are loaded correctly at all.
- `CHANGELOG.md` discipline: user-visible growth is called out with justification.

## Escalation

If scope-control decisions need an owner (new domain, new dependency, breaking core change), stop and ask instead of importing a "solution" into the kit.
