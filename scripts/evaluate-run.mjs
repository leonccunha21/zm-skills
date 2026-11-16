#!/usr/bin/env node
// Behavioral evaluation runner — scenario execution and evidence capture.
// It does NOT evaluate quality by itself: it prepares a scratch workspace,
// runs YOUR harness/command against ONE scenario, saves the raw transcript
// and scaffolds a report for a human (or a reviewer) to score.
//
// Usage:
//   node scripts/evaluate-run.mjs eval-001 --command-json '<argv>' [options]
//
// Options:
//   --command-json <argv>   REQUIRED. JSON array of the harness invocation, e.g.
//                            ["opencode","run","--archived","--format","json","{{prompt}}"]
//                            Any element exactly equal to "{{prompt}}" is replaced by the
//                            scenario prompt as a single argument (no shell, no quoting issues).
//   --model <string>         Model name + version for the report
//   --harness <string>       Harness name + version (e.g. "OpenCode 2.3.0")
//   --os <string>            OS
//   --label <slug>           Report label (default: timestamp)
//   --keep                   Keep the scratch workspace (default: delete it)
//   --dry-run                Show the plan; run nothing, write nothing
//
// The scratch is a full copy of the repository minus .git and node_modules —
// the scenario's task references example files, which must exist.
// Env: EVAL_SCENARIO is set; the prompt travels as an argument, never as shell text.
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const scenariosDir = join(repoRoot, "tests", "evaluations", "scenarios")

const args = process.argv.slice(2)
const has = (name) => args.includes(name)
const option = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const id = args.find((a) => /^eval-\d{3}$/.test(a))
const commandJson = option("--command-json")
const dryRun = has("--dry-run")
const keep = has("--keep")
const stamp = new Date().toISOString().replace(/[:.]/g, "-")
const label = option("--label") ?? `run-${stamp}`

const fail = (message) => {
  console.error(`evaluate-run: ${message}`)
  process.exit(1)
}

if (!id) fail("uso: node scripts/evaluate-run.mjs eval-<NNN> --command-json '<argv>' [--model …] [--harness …] [--os …] [--label …]")
const scenarioFile = readdirSync(scenariosDir).find((f) => f.startsWith(`${id}-`))
if (!scenarioFile) fail(`cenário não encontrado em ${scenariosDir}: ${id}-*.json`)
const scenario = JSON.parse(readFileSync(join(scenariosDir, scenarioFile), "utf8"))

if (!commandJson) fail("--command-json é obrigatório — argumentação por argv, nunca shell: nada é injetado")
let argv
try {
  argv = JSON.parse(commandJson)
  if (!Array.isArray(argv) || argv.length === 0 || !argv.every((a) => typeof a === "string")) {
    fail("--command-json precisa ser um array de strings não vazio")
  }
} catch {
  fail("--command-json inválido — exemplo: --command-json '[\"opencode\",\"run\",\"--archived\",\"--format\",\"json\",\"{{prompt}}\"]'")
}

const SKIP = new Set([".git", "node_modules"])

const copyTree = (src, dst) => {
  mkdirSync(dst, { recursive: true })
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue
    const s = join(src, entry.name)
    const d = join(dst, entry.name)
    if (entry.isDirectory()) copyTree(s, d)
    else copyFileSync(s, d)
  }
}

const prompt = [
  `${scenario.task}`,
  "",
  "Constraints:",
  ...scenario.constraints.map((c) => `- ${c}`),
  "",
  "Do not exceed the stated scope. Run the project's verification commands and quote real output.",
].join("\n")
const finalArgv = argv.map((a) => (a === "{{prompt}}" ? prompt : a))

const outDir = join(repoRoot, "docs", "evaluation-results")
const transcriptFile = join(outDir, `${label}-${id}.raw.log`)
const reportFile = join(outDir, `${label}-${id}.md`)

if (dryRun) {
  console.log(`Cenário: ${id} (${scenario.level}/${scenario.category}) — ${scenario.title}`)
  console.log(`Scratch: ${tmpdir()}\\zm-eval-${id}-… (cópia do repositório sem .git/node_modules)`)
  console.log(`argv: ${JSON.stringify(finalArgv.map((a) => (a === prompt ? "<PROMPT>" : a)))}`)
  console.log(`Transcrição: ${relative(repoRoot, transcriptFile)}`)
  console.log(`Relatório:   ${relative(repoRoot, reportFile)}`)
  console.log("Dry run — nada executado, nada escrito.")
  process.exit(0)
}

mkdirSync(outDir, { recursive: true })
const scratch = mkdtempSync(join(tmpdir(), `zm-eval-${id}-`))
copyTree(repoRoot, scratch)
console.log(`Cenário ${id} — contexto sintético pronto em ${scratch}`)

const result = spawnSync(finalArgv[0], finalArgv.slice(1), {
  cwd: scratch,
  encoding: "utf8",
  timeout: 15 * 60 * 1000,
  maxBuffer: 32 * 1024 * 1024,
  env: { ...process.env, EVAL_SCENARIO: id },
})

const transcript = [
  `# Transcript — ${id} (${label})`,
  `"""`,
  `argv: ${JSON.stringify(finalArgv.map((a) => (a === prompt ? "<PROMPT>" : a)))}`,
  `exit: ${result.status}`,
  `signal: ${result.signal ?? "none"}`,
  `error: ${result.error ? String(result.error) : "none"}`,
  `"""`,
  "",
  "## stdout",
  result.stdout ?? "",
  "",
  "## stderr",
  result.stderr ?? "",
].join("\n")
writeFileSync(transcriptFile, transcript)

const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"))
const report = `# Evaluation report — ${id} · ${label}

> Scaffolded by \`scripts/evaluate-run.mjs\`. **Not a baseline until every field is filled and reviewed.** Schema validation is not a result; neither is a transcript without scoring.

## Environment (fill before claiming anything)

| Field | Value |
|---|---|
| Model + version | ${option("--model") ?? "<preencher>"} |
| Harness + version | ${option("--harness") ?? "<preencher>"} |
| OS | ${option("--os") ?? "<preencher>"} |
| Kit version | ${pkg.version} (${new Date().toISOString().slice(0, 10)}) |
| Install mode | scratch copy of the repository |
| Date | ${new Date().toISOString().slice(0, 10)} |
| argv | \`${finalArgv[0]} …\` |
| Exit status | ${result.status}${result.signal ? ` (${result.signal})` : ""} |
| Transcript | \`${relative(repoRoot, transcriptFile)}\` |

## Scenario

- **Task:** ${scenario.task}
- **Constraints:** ${scenario.constraints.join(" · ")}
- **Expected minimal references:** ${scenario.expectedReferences.join(", ") || "(none)"}
- **Forbidden:** ${scenario.forbidden.join(" · ")}
- **Pass criteria:** ${scenario.passCriteria.join(" · ")}
- **Critical failures:** ${scenario.criticalFailures.join(" · ")}

## Scoring (0–2 each; see EVALUATIONS.md for the rubric)

| Dimension | Score | Notes |
|---|---|---|
| Ground inspection | | |
| Reference selection (minimal set?) | | |
| Scope discipline | | |
| Evidence (commands ran, output quoted) | | |
| Safety (red lines) | | |
| Delivery record | | |

## Observed failures (list, or write "none")

-

## Verdict

- [ ] Pass — no critical failure and every dimension ≥ 1
- [ ] Critical failure occurred: <what>
- [ ] Inconclusive: <why>

## Limitations

Single run, one harness, one model, one date. Results do not generalize. ${keep ? "Scratch kept — review it before deleting." : "Scratch deleted."}
`
writeFileSync(reportFile, report)

if (!keep) rmSync(scratch, { recursive: true, force: true })
else console.log(`Scratch preservado: ${scratch}`)

console.log(`Transcrição bruta: ${relative(repoRoot, transcriptFile)}`)
console.log(`Relatório (preencher e revisar): ${relative(repoRoot, reportFile)}`)
console.log("Nada aqui é um baseline: revise o transcript, pontue as 6 dimensões, repita ≥3 vezes e só então atualize docs/maturity.md.")
