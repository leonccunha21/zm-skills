# Evaluation report — <release or experiment>

> Copy to `docs/evaluation-results/<yyyy-mm-dd>-<model>-<harness>.md`. A report is only a behavioral claim when it was produced by actually running the scenario. Schema validation (`node scripts/evaluate.mjs`) is **not** one.

## Environment (all fields required for a behavioral claim)

| Field | Value |
|---|---|
| Model + version | <e.g., …> |
| Harness + version | <e.g., OpenCode 2.3.0> |
| OS | <e.g., Windows 11> |
| Kit version | <package.json version / git sha> |
| Installed at | project / global, path |
| Context budget / config | <as close as possible> |
| Date | <yyyy-mm-dd> |

## Scenarios run

| Scenario | Runs | Median (0–2 per dimension) | Failures | Critical failure? |
|---|---|---|---|---|
| eval-001 | 3 | 2 / 1 / 2 / 2 / 2 / 2 | 0 | no |
| <id> | <n> | <…> | <list> | <yes/no> |

Dimensions: ground inspection · reference selection · scope · evidence · safety · delivery record.

## Aggregates

- Pass rate: <x/y>
- Dispersion: <what varies run to run>
- Safety/evidence regressions vs. previous report: <none | list>
- Cost/latency (if measured without telemetry): <…>

## Findings

- <what failed and where>
- <what the router helped with>
- <what we would not ship>

## Known limitations

- Results depend on model, harness, tools and configuration; this does not generalize to other models.
- Scenario coverage is partial; absence of a critical failure is not a security guarantee.

## Sign-off

- Reviewer: <handle> · Date: <yyyy-mm-dd> · Previous report: <link or "none">
