# Instruction audit — contradictions, duplicates and vague rules

> Audit of this repository's instructions themselves: what we checked, with what, what we found and what we fixed. Methodology is reproducible; findings are dated. Not a substitute for reviewing your own project's instructions.

**Date:** 2026-11-16 · **Scope:** `zm-pro/SKILL.md`, `zm-pro/reference/`, `zm-pro/templates/`, `RULES.md`, `AGENTS.md`, `README*.md`, `CONTRIBUTING.md`, `docs/` · **Instruments:** validator (structure + residue), `evaluate.mjs`-style scenario set, `git grep` patterns.

## Method

1. **Structure gate** — `npm run validate`: required files, frontmatter, index coverage, relative links/images/anchors, project residue, version sync. Already green at the time of writing.
2. **Absolute-language scan** — `\b(always|never|every)\b` (case-insensitive) across the skill. Result: **105 occurrences**. Sample reviewed by hand: they are overwhelmingly safety red lines where absolute is the correct term (`never trust external data`, `never force-push main`, `never report a gate green`) or are explicitly conditioned (`never mix by accident` after a market-specific default). **No context-dependent rule was found using an absolute without a condition**, but 105 is a high count: the policy is now documented in `14-agent-operations.md` ("avoid absolutes unless genuinely absolute; state the exception").
3. **Duplicate headings across references** — `^## ` grouped: `## Checklist` ×4 (different files, checklists are per-reference — allowed; each has distinct items), `## Anti-patterns` ×3 (same, allowed), `## Mobile` ×2/`## Mobile-first…` (different scopes, one playbook one UI; renamed in the playbook? no — both retained, scopes stated in the file headers).
4. **Same fact in two places** — reference ↔ router index ↔ READMEs ↔ trees. Result: four stale count copies found (13/14 guides in READMEs, `for-humans`, `para-leigos`, `architecture`, `13-token-economy`) and fixed in the same commit; `npm run validate` does not catch prose counts, which is why this audit exists.
5. **Secrets in instructions** — none; `tests/evaluate.test.mjs` rejects secret-like scenario content and the validator forbids project residue.
6. **Contradiction check (sampled)** — installation paths, update semantics, harness support claims, checksum command: checked against `docs/migration.md`, `SECURITY.md`, `docs/troubleshooting.md` — consistent at audit time.

## Findings and actions

| # | Finding | Type | Action |
|---|---|---|---|
| 1 | Stale guide counts in READMEs/docs after references were added | stale duplicated copy | fixed; counts now normalized to 18 (router/READMEs/architecture) |
| 2 | `## Checklist`/`## Anti-patterns` repeat across references | allowed duplication | none — headers carry scope information |
| 3 | `docs/architecture.md` cited a "14-guide preload" after the 18-guide change | stale copy | fixed in this audit |
| 4 | Absolute terms frequent (105), conditioned by policy | review, not a defect | policy documented in `14-agent-operations.md`; periodic re-scan at releases |
| 5 | `## Mobile` appears in `03-layout-ui.md` and `16-domain-playbooks.md` | overlap | retained: UI vs. engineering playbook scopes differ; both linked from router |

## What this audit cannot prove

- That an agent *obeys* these rules — only the evaluation suite tests that, and no behavioral baseline has been run (`EVALUATIONS.md`).
- That no contradiction exists — a keyword audit samples; it does not prove absence.
- That the wording is complete for every scenario in the kit.

## Repeating

At each release: re-run step 1, step 2 (check count does not creep), step 4. Before a structural change (new reference, renamed guide): grep the counts across READMEs/docs — the drift pattern is always a missed count copy.
