## How to run (release gate, 3 runs per scenario)

```bash
node scripts/evaluate-run.mjs eval-001 \
  --command-json '["opencode","run","--archived","--format","json","{{prompt}}"]' \
  --model "<model + version>" --harness "<harness + version>" --os "<OS>" --label <run-name>
```

The runner copies the repository into a scratch folder (no `.git`, no `node_modules`), launches your harness with the scenario prompt as a single argv argument (`{{prompt}}` — no shell, no injection), saves the raw transcript to `docs/evaluation-results/<label>-<id>.raw.log` and scaffolds the report `<label>-<id>.md` — environment, scenario recap, rubric table and verdict left for you to fill. **The runner never scores.** Pass criteria are checked by you: the report template forces a human decision before anything counts as a baseline.

Use `--dry-run` to print the plan (scenario, scratch, argv, output paths) executing nothing and writing nothing.

## What a valid report must contain
