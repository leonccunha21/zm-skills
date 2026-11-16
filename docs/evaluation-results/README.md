## How to run (release gate, 3 runs per scenario)

```bash
node scripts/evaluate-run.mjs eval-001 \
  --command-json '["opencode","run","--archived","--format","json","{{prompt}}"]' \
  --model "<model + version>" --harness "<harness + version>" --os "<OS>" --label <run-name>
```

Windows note: the `["opencode", …]` argv shape fails with `spawnSync opencode ENOENT` on npm `.cmd`/`.ps1` shims (Node `spawn` without a shell cannot resolve them). Point argv at the real binary instead — no shell needed, argv stays literal:

```bash
node scripts/evaluate-run.mjs eval-001 \
  --command-json '["C:/Users/<you>/AppData/Roaming/npm/node_modules/@opencode/cli/bin/opencode.exe","run","--archived","--format","json","{{prompt}}"]' \
  --model "<model + version>" --harness "<harness + version>" --os "Windows" --label <run-name>
```

The runner copies the repository into a scratch folder (no `.git`, no `node_modules`), launches your harness with the scenario prompt as a single argv argument (`{{prompt}}` — no shell, no injection), saves the raw transcript to `docs/evaluation-results/<label>-<id>.raw.log` and scaffolds the report `<label>-<id>.md` — environment, scenario recap, rubric table and verdict left for you to fill. **The runner never scores.** Pass criteria are checked by you: the report template forces a human decision before anything counts as a baseline.

Use `--dry-run` to print the plan (scenario, scratch, argv, output paths) executing nothing and writing nothing.

The runner exits **1** when the harness cannot be spawned, exits non-zero or is killed by a signal — transcript and report are kept on disk for diagnosis. Checking the exit code is enough for gates; reading the transcript is still required for scoring.

## What a valid report must contain
