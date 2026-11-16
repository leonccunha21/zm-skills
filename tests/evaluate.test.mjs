// Unit tests for scripts/evaluate.mjs — zero dependencies, node:test only.
// The real scenario set must always pass; fixtures in the temp dir prove rejections.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const evalScript = join(repoRoot, "scripts", "evaluate.mjs")

const makeRepo = (t, mutate) => {
  const dir = mkdtempSync(join(tmpdir(), "zm-eval-"))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  mkdirSync(join(dir, "scripts"), { recursive: true })
  mkdirSync(join(dir, "zm-pro", "reference"), { recursive: true })
  mkdirSync(join(dir, "tests", "evaluations", "scenarios"), { recursive: true })
  copyFileSync(evalScript, join(dir, "scripts", "evaluate.mjs"))
  writeFileSync(join(dir, "zm-pro", "reference", "01-code-rules.md"), "# Rules\n")
  writeFileSync(join(dir, "tests", "evaluations", "scenarios", "eval-001-x.json"), JSON.stringify({
    id: "eval-001", title: "fixture", level: "small", category: "bug",
    task: "do a safe thing", constraints: ["scope"],
    expectedContextFiles: ["AGENTS.md"], expectedReferences: ["01-code-rules.md"],
    forbidden: ["invent commands"], passCriteria: ["done"], criticalFailures: ["lie"],
  }))
  if (mutate) mutate(dir)
  return dir
}

const runEval = (cwd, args = []) =>
  spawnSync(process.execPath, [join(cwd, "scripts", "evaluate.mjs"), ...args], { cwd, encoding: "utf8" })

test("conjunto real de cenários do repositório é válido", () => {
  const result = spawnSync(process.execPath, [evalScript], { cwd: repoRoot, encoding: "utf8" })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout, /15 válido\(s\), 0 inválido\(s\)/)
})

test("cenário válido passa", (t) => {
  const dir = makeRepo(t)
  const result = runEval(dir)
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout, /1 válido\(s\)/)
})

test("id duplicado é rejeitado", (t) => {
  const dir = makeRepo(t, (d) => {
    writeFileSync(join(d, "tests", "evaluations", "scenarios", "eval-dup.json"), JSON.stringify({
      id: "eval-001", title: "dup", level: "small", category: "bug", task: "t",
      constraints: [], expectedContextFiles: [], expectedReferences: [],
      forbidden: ["x"], passCriteria: ["y"], criticalFailures: ["z"],
    }))
  })
  const result = runEval(dir)
  assert.equal(result.status, 1)
  assert.match(result.stdout, /id duplicado/)
})

test("referência esperada inexistente é rejeitada", (t) => {
  const dir = makeRepo(t, (d) => {
    writeFileSync(join(d, "tests", "evaluations", "scenarios", "eval-002-x.json"), JSON.stringify({
      id: "eval-002", title: "bad ref", level: "small", category: "bug", task: "t",
      constraints: [], expectedContextFiles: [], expectedReferences: ["99-nope.md"],
      forbidden: ["x"], passCriteria: ["y"], criticalFailures: ["z"],
    }))
  })
  const result = runEval(dir)
  assert.equal(result.status, 1)
  assert.match(result.stdout, /referência esperada não existe/)
})

test("segredo em cenário é rejeitado", (t) => {
  const dir = makeRepo(t, (d) => {
    writeFileSync(join(d, "tests", "evaluations", "scenarios", "eval-003-x.json"), JSON.stringify({
      id: "eval-003", title: "s", level: "small", category: "bug",
      task: "use AKIAIOSFODNN7EXAMPLE in the test", constraints: [], expectedContextFiles: [],
      expectedReferences: [], forbidden: ["x"], passCriteria: ["y"], criticalFailures: ["z"],
    }))
  })
  const result = runEval(dir)
  assert.equal(result.status, 1)
  assert.match(result.stdout, /possível segredo/)
})

test("--json é determinístico e declara que não é resultado comportamental", (t) => {
  const dir = makeRepo(t)
  const first = runEval(dir, ["--json"])
  const second = runEval(dir, ["--json"])
  assert.equal(first.stdout, second.stdout)
  const report = JSON.parse(first.stdout)
  assert.equal(report.kind, "scenario-check")
  assert.equal(report.behavioralResult, false)
  assert.equal(report.counts.valid, 1)
})
