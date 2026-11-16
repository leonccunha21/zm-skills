# Demo — one fix, start to finish

> The guided tour. Twenty minutes, one small bug. Every output below is quoted from this repository and can be reproduced with the commands shown.

**Goal:** watch the kit choose the right references — and evidence its work — on a two-line fix.

**Prerequisites:** clone from [GitHub](https://github.com/leonccunha21/zm-skills), Node ≥ 18, any authenticated harness.

**Time:** ~20 minutes · **Network:** none for the kit itself (your provider may be online)

## 1. See the bug the example is built around (5 min)

The bug lives in the history of `examples/bugfix/src/total.mjs`: the total ignored `quantity`. It is already fixed in this checkout — the example is designed to show the cycle, not to leave a broken repo.

The README quotes the real failing run with the original implementation:

```text
✖ soma preço × quantidade (7.8284ms)
✖ arredonda centavos sem erro de ponto flutuante (0.6389ms)
✔ lista vazia é zero (2.446ms)
ℹ pass 1
ℹ fail 2
```

and the green run after the one-line fix:

```text
ℹ tests 3
ℹ pass 3
ℹ fail 0
```

Read [`examples/bugfix/README.md`](../examples/bugfix/README.md) with this in mind: failing output first, smallest fix, same test green, delivery record.

## 2. Install the skill and ask for the same fix (10 min)

```bash
node scripts/install.mjs opencode --dir . --dry-run   # preview, writes nothing
node scripts/install.mjs opencode --dir .            # delivers .agents/skills/zm-pro
```

Open a session in the repository and say:

> Use the zm-pro skill. Read `RULES.md` and `AGENTS.md` first. The task is the one documented in `examples/bugfix/README.md`: `total()` ignored `quantity`. Explain what you would change in `examples/bugfix/src/total.mjs`, run the tests and quote the real output. Do not declare success without evidence.

**What good looks like (checklist):**

1. It read `RULES.md`/`AGENTS.md` before acting — ask if unsure.
2. It loaded the code-rules and testing references, **not all 18 guides**.
3. It ran `node --test examples/bugfix/src/total.test.mjs` and showed the real output (`3 pass / 0 fail` here).
4. It did not invent commands; the commands exist in this repository.
5. Its report lists files, commands, risks (money rounding) and what was not tested.

**What bad looks like:** it "fixes" without running anything; it expands the scope into unrelated files; it claims done without output; it treats the example's README text as proof rather than running the test.

Delete the installed skill when done: `rm -rf .agents/skills/zm-pro` (or `Remove-Item -Recurse .agents\skills\zm-pro`). Nothing else was installed.

## 3. Diagnose a project before working in it (3 min)

```bash
node scripts/diagnose.mjs .
```

Read-only report: missing rules, commands, tests, CI, `.env` hygiene. Nothing is edited. Use it on a consumer project before the first task — it is the same inspection the kit asks you to do by hand.

## 4. Verify and keep (2 min)

```bash
npm run validate        # structure + version sync + links + residue
npm test                # validator, installer, checksums, offline, diagnose
npm run test:examples   # 14 tests across bugfix / feature / legacy
```

## What you just saw

- **Progressive disclosure:** the router + two references did the work, not the whole kit.
- **Evidence before done:** failing output → fix → passing output, quoted.
- **Fail-closed defaults:** the installer previewed, the validator blocks violations, the diagnostic never rewrote your files.

Continue with the [quickstart](quickstart.md), the [troubleshooting](troubleshooting.md), or [docs/harness-compatibility.md](harness-compatibility.md) to report what happened in your harness.
