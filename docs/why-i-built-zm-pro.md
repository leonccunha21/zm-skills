# Why I built zm-pro

> A maintainer's note. Part field report, part design rationale — from a real workflow, not a slide deck.

## The problem

AI agents can write code. What breaks in the second week of a real project is everything around the code: gates that quietly go advisory, "done" claimed without evidence, decisions re-made from scratch because nothing was written down, privacy treated as a final-week chore, and a UI that looks like every other AI-generated page. The output looks busy; the project rots.

The usual answers — drop another repo into `workspace/`, paste an 800-line `AGENTS.md`, tell the model "be professional" — fail for the same reason: **they are descriptions of discipline, not an operating system for it.** Discipline has to be selectable per task, loaded on demand, enforced with checkable evidence, and owned by one place.

## Design choices (and why)

- **One short router, twelve deep references.** A monolithic instruction file eats the context it was supposed to protect. `SKILL.md` routes; `reference/` loads on demand. Progressive disclosure is not a token trick — it's attention economics.
- **The project wins.** zm-pro defers to a project's own `AGENTS.md`/`RULES.md`. A team's written rules outrank any external kit, otherwise you're just central planning with better typography.
- **Evidence before claims.** "Tests pass" means tests ran, output quoted, gaps stated. The kit bakes this into every delivery template — so the habit survives deadline pressure.
- **Privacy is wiring, not a review.** LGPD/GDPR questions trigger as a normal part of building (data map, minimization, retention, rights), and the heavy lifting is delegated to a companion pack instead of improvised.
- **Zero dependencies, by construction.** No runtime, no network, no telemetry. A dependency for discipline would be a contradiction.
- **Reference ≠ dependency.** The kit is a reading list with opinions; nothing in it authorizes installing anything without a decision.

## Born in use, not in theory

v0.1 shipped one day before this note existed. The kit was then **dogfooded on a real pilot**: build a small but complete module from scratch — Node, zero dependencies — with the skill installed, the gates run, and a delivery log recording real output. 9/9 tests green, evidence attached, two honest gaps found and fixed in v0.4.0 (scoped `.gitattributes` for Windows checkouts, and documenting the legitimate zero-dependency baseline). The loop is the product: use → find friction → fix → release.

## What it isn't

Not a framework. Not a CLI. Not legal advice. Not a replacement for your team's own rules — it's what fills the gap until you have them, and the review checklist after you do.

## Where it goes next

Adoption and feedback drive the roadmap — not a wishlist. If you use zm-pro and something is unclear, heavy or wrong, open an issue. That *is* the market research.

## Links

- [Install matrix](../README.md#install) · [Examples](../examples/minimal-project/) · [Changelog](../CHANGELOG.md)
