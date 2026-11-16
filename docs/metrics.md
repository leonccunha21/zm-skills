# Metrics — definitions, method and honest status

> What we measure, how, from where, and what we refuse to measure. No hidden telemetry, ever: everything below comes from local runs, CI artifacts or voluntary reports. `node scripts/metrics.mjs` prints the deterministic repository facts.

## Rules

1. **No telemetry in the skill or scripts.** Counting users requires data collection; we do not do it.
2. **A metric needs an owner, a cadence and a method** before it is quoted. Otherwise it is an anecdote.
3. **Unknown is a valid value.** "No baseline yet" is stated; invented baselines are worse than none.
4. **Behavior beats structure.** Test counts and file counts are health signals, not proof of quality.

## Metric table

| Metric | Definition | Method / source | Cadence | Owner | Status today |
|---|---|---|---|---|---|
| Evaluation success rate, by category and severity | % scenarios passing per `category` with no critical failure | `docs/evaluation-results/*.md` produced by `templates/EVALUATION-REPORT.md` | every release that touches the kit | maintainer | **no baseline** — no run yet |
| Reference selection accuracy | % runs loading the minimal correct reference set | evaluation runs; dimension "Reference selection" (0–2) | every release | maintainer | no baseline |
| Irrelevant context share | median extra references loaded beyond `expectedReferences` | evaluation runs | every release | maintainer | no baseline |
| Constraint violations | critical failures per scenario (destructive actions, scope widening, red lines) | evaluation runs | every release | maintainer | no baseline |
| Documented commands that work in a clean environment | number of documented commands executed and green in CI | CI matrix (validate, test, examples, checksums) | every PR/release | maintainer | **4/4** CI-run commands green at this audit (validate, test, examples, checksums) |
| Critical-path coverage of installer and validator | % of critical paths with ≥1 automated test | `tests/install.test.mjs`, `tests/validate.test.mjs`, `tests/offline.test.mjs`, `tests/diagnose.test.mjs` | every release | maintainer | 8/8 installer paths, 8/8 validator paths covered (dry-run, force, backup, symlink, idempotent, shebang, residue, adversarial) |
| Contradictions between guides | number of known contradictions open at release | `docs/instruction-audit.md`, re-run per release | every release | maintainer | 0 known open; sampled, not exhaustive |
| Time to first validated task | median minutes from clone to one delivered, evidence-backed change | voluntary harness reports (`harness_report` template), survey-style | quarterly, when reports exist | maintainer | no baseline — no reports yet |
| Verified harness/version/OS combinations | count of cells with dated evidence | `docs/harness-compatibility.md` | every release | maintainer | 1 (OpenCode 2.3.0, Windows 11) — dated |
| Regressions per release and mean time to fix | count of release-caused defects; days from report to fix | changelog, issue labels `bug` | every release | maintainer | tracked from the first public release; none so far |
| Evaluation cost and latency | tokens/time per evaluation session | manual measurement when runs happen; optional, never collected automatically | when behavioral runs happen | maintainer | not measured |
| Telemetry (of users) | any collection of user behavior | none — forbidden | — | — | **not collected, by design** |

## Baselines

`docs/maturity.md` records the current level. When the first behavioral evaluation runs, its results become the baseline and this file links the report. Repository facts (test count, reference count) come from `node scripts/metrics.mjs --json` and are quoted in release notes only as context.

## What we deliberately do not measure

Stars, downloads, forks, page views — vanity; if useful, quoted verbatim from public GitHub stats with date, never estimated. NPS/surveys only if someone volunteers to run one. No analytics in the kit, ever.

## Review

This file is reviewed at every release together with `docs/maturity.md` and `docs/maintenance-policy.md`. Adding a metric without a method is a review failure.
