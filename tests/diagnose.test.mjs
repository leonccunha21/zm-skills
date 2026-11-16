// Unit tests for scripts/diagnose.mjs — zero dependencies, node:test only.
// Every fixture lives in the OS temp directory; no repository is read.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const diagnoseScript = join(repoRoot, "scripts", "diagnose.mjs")

const runDiagnose = (target, args = []) =>
  spawnSync(process.execPath, [diagnoseScript, target, ...args], { encoding: "utf8" })

const snapshot = (dir) => {
  const acc = {}
  const walk = (d, prefix = "") => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, entry.name)
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name
      if (entry.isDirectory()) walk(p, rel)
      else acc[rel] = String(entry.isFile())
    }
  }
  walk(dir)
  return acc
}

const makeFixture = (t, options = {}) => {
  const dir = mkdtempSync(join(tmpdir(), "zm-diagnose-"))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  if (options.complete) {
    writeFileSync(join(dir, "AGENTS.md"), "# Agents\n")
    writeFileSync(join(dir, "RULES.md"), "# Rules\n")
    writeFileSync(join(dir, "README.md"), "# Fixture\n")
    writeFileSync(join(dir, "SECURITY.md"), "# Security\n")
    writeFileSync(join(dir, "package.json"), JSON.stringify({
      name: "fixture", version: "1.0.0", private: true,
      scripts: { test: "node --test", lint: "true", build: "true" },
      dependencies: { leftpad: "1.0.0" },
    }))
    writeFileSync(join(dir, "package-lock.json"), "{}\n")
    writeFileSync(join(dir, "app.test.mjs"), "import { test } from 'node:test'\ntest('ok', () => {})\n")
    mkdirSync(join(dir, ".github", "workflows"), { recursive: true })
    writeFileSync(join(dir, ".github", "workflows", "ci.yml"), "name: ci\n")
  }
  return dir
}

test("projeto completo não gera achados", (t) => {
  const dir = makeFixture(t, { complete: true })
  const result = runDiagnose(dir)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Achados: 0/)
})

test("projeto vazio reporta avisos sem falhar", (t) => {
  const dir = makeFixture(t)
  const result = runDiagnose(dir)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /AGENTS\.md ausente/)
  assert.match(result.stdout, /README\.md ausente/)
  assert.match(result.stdout, /nenhum arquivo de teste encontrado/)
  assert.match(result.stdout, /CI/)
})

test("sem lockfile com dependências vira aviso", (t) => {
  const dir = makeFixture(t)
  writeFileSync(join(dir, "package.json"), JSON.stringify({
    name: "fixture", version: "1.0.0", private: true,
    scripts: { test: "true", lint: "true", build: "true" },
    dependencies: { leftpad: "1.0.0" },
  }))
  const result = runDiagnose(dir)
  assert.match(result.stdout, /nenhum lockfile/)
})

test(".env sem regra no .gitignore é erro", (t) => {
  const dir = makeFixture(t, { complete: true })
  rmSync(join(dir, "package-lock.json"))
  writeFileSync(join(dir, ".env"), "SECRET=fixture\n")
  const result = runDiagnose(dir)
  assert.match(result.stdout, /ERROR/)
  assert.match(result.stdout, /arquivo de ambiente sem regra no \.gitignore/)
})

test("é somente leitura", (t) => {
  const dir = makeFixture(t)
  writeFileSync(join(dir, "NOTES.md"), "notes\n")
  const before = snapshot(dir)
  runDiagnose(dir)
  assert.deepEqual(snapshot(dir), before)
})

test("--json devolve relatório estável", (t) => {
  const dir = makeFixture(t, { complete: true })
  const first = runDiagnose(dir, ["--json"])
  const second = runDiagnose(dir, ["--json"])
  assert.equal(first.stdout, second.stdout)
  const report = JSON.parse(first.stdout)
  assert.equal(report.schemaVersion, 1)
  assert.equal(report.readOnly, true)
  assert.deepEqual(report.findings, [])
})

test("caminho inválido falha com código 1", () => {
  const dir = join(tmpdir(), `zm-diagnose-missing-${Date.now()}`)
  const result = runDiagnose(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /not a directory/)
})
