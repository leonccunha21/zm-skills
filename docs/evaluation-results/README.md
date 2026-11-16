# Evaluation results

> This directory holds dated behavioral reports produced by `templates/EVALUATION-REPORT.md` after running the scenarios in `tests/evaluations/scenarios/` with a real model and harness.

## Current status — 2026-11-16

**No behavioral result has been published yet.** The suite is defined and schema-checked (`node scripts/evaluate.mjs`), but nobody has executed the scenarios in a reproducible session for a baseline. Structure validation is not a result — see `EVALUATIONS.md` and `docs/maturity.md`.

## Why the folder exists

- To keep the discipline visible: an empty, honestly-maintained folder beats a fabricated report.
- To give the maintainer a defined landing spot before the first baseline run.

## What a valid report must contain

The full template is in `zm-pro/templates/EVALUATION-REPORT.md`. One environment per file, machine-readable environment table, per-scenario runs (≥3), median/dispersion, failures, known limitations, reviewer, previous report.

## When this folder stops being "empty"

1. Run the minimum release gate (`EVALUATIONS.md`): small scenarios + the two safety red lines.
2. Write the report with `templates/EVALUATION-REPORT.md`.
3. Commit it here as `docs/evaluation-results/<yyyy-mm-dd>-<model>-<harness>.md`.
4. Update `docs/maturity.md` level 3 with the linked evidence.
