// Unit test for scripts/parity-check.mjs — the repo must stay bilingual and in sync.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const parityScript = join(repoRoot, "scripts", "parity-check.mjs")

test("READMEs EN/pt-BR estão em paridade estrutural", () => {
  const result = spawnSync(process.execPath, [parityScript], { cwd: repoRoot, encoding: "utf8" })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  assert.match(result.stdout, /READMEs equivalent/)
})

test("--json declara equivalência e diferenças", () => {
  const result = spawnSync(process.execPath, [parityScript, "--json"], { cwd: repoRoot, encoding: "utf8" })
  assert.equal(result.status, 0)
  const report = JSON.parse(result.stdout)
  assert.equal(report.schemaVersion, 1)
  assert.equal(report.ok, true)
  assert.deepEqual(report.differences, [])
})
