// Unit tests for scripts/evaluate-run.mjs — real execution with a stub argv.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const runner = join(repoRoot, "scripts", "evaluate-run.mjs")

const run = (args) => spawnSync(process.execPath, [runner, ...args], { cwd: repoRoot, encoding: "utf8" })
const outDir = join(repoRoot, "docs", "evaluation-results")

const countArtifacts = () =>
  readdirSync(outDir).filter((f) => /-eval-\d{3}\.(raw\.log|md)$/.test(f)).length

test("--dry-run não executa nem escreve", () => {
  const before = countArtifacts()
  const result = run(["eval-001", "--command-json", "[\"node\",\"-e\",\"process.exit(0)\"]", "--dry-run"])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /Dry run/)
  assert.match(result.stdout, /argv/)
  assert.equal(countArtifacts(), before)
})

test("cenário desconhecido falha com código 1", () => {
  const result = run(["eval-999", "--command-json", "[\"node\",\"-e\",\"process.exit(0)\"]"])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /cenário não encontrado/)
})

test("--command-json é obrigatório e parseado como argv", () => {
  const missing = run(["eval-001"])
  assert.equal(missing.status, 1)
  assert.match(missing.stderr, /obrigatório/)

  const broken = run(["eval-001", "--command-json", "not-json"])
  assert.equal(broken.status, 1)
  assert.match(broken.stderr, /inválido/)
})

test("prompt viaja como argumento, sem shell (zero interpretação)", (t) => {
  const label = `test-${Date.now()}`
  const tmp = mkdtempSync(join(tmpdir(), "zm-evalrun-"))
  t.after(() => rmSync(tmp, { recursive: true, force: true }))
  const proof = join(tmp, "argv.json")
  const argv = JSON.stringify(["node", "-e", `require('fs').writeFileSync(${JSON.stringify(proof)}, JSON.stringify(process.argv.slice(1)))`, "{{prompt}}"])
  t.after(() => {
    for (const f of readdirSync(outDir)) {
      if (f.startsWith(label)) rmSync(join(outDir, f), { force: true })
    }
  })
  const result = run(["eval-001", "--command-json", argv, "--label", label])
  assert.equal(result.status, 0, result.stderr)
  const got = JSON.parse(readFileSync(proof, "utf8"))
  assert.equal(got.length, 1)
  assert.match(got[0], /cart total|Cart total/)
})

test("executa e gera transcript + scaffold que não se vende como baseline", (t) => {
  const label = `test-${Date.now()}`
  const before = countArtifacts()
  t.after(() => {
    for (const f of readdirSync(outDir)) {
      if (f.startsWith(label)) rmSync(join(outDir, f), { force: true })
    }
  })
  const result = run(["eval-001", "--command-json", "[\"node\",\"-e\",\"console.log('eval-stub-ok')\"]", "--label", label, "--model", "test-model", "--harness", "test harness 1.0"])
  assert.equal(result.status, 0, result.stderr)
  const files = readdirSync(outDir)
  assert.ok(files.includes(`${label}-eval-001.raw.log`))
  assert.ok(files.includes(`${label}-eval-001.md`))
  assert.match(readFileSync(join(outDir, `${label}-eval-001.raw.log`), "utf8"), /eval-stub-ok/)
  const report = readFileSync(join(outDir, `${label}-eval-001.md`), "utf8")
  assert.match(report, /Not a baseline/)
  assert.match(report, /test-model/)
  assert.equal(countArtifacts(), before + 2)
})
