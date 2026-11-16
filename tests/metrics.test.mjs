// Unit test for scripts/metrics.mjs — read-only, deterministic.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const metricsScript = join(repoRoot, "scripts", "metrics.mjs")

const runMetrics = (args = []) =>
  spawnSync(process.execPath, [metricsScript, ...args], { cwd: repoRoot, encoding: "utf8" })

test("--json devolve facts estáveis e parseáveis", () => {
  const first = runMetrics(["--json"])
  const second = runMetrics(["--json"])
  assert.equal(first.status, 0, first.stderr)
  assert.equal(first.stdout, second.stdout)
  const facts = JSON.parse(first.stdout)
  assert.equal(facts.schemaVersion, 1)
  assert.ok(/^\d+\.\d+\.\d+$/.test(facts.packageVersion))
  assert.ok(facts.references >= 18)
  assert.ok(facts.templates >= 17)
  assert.ok(facts.testCases > 0)
  assert.ok(facts.evaluationScenarios >= 15)
  assert.ok(Array.isArray(facts.scripts))
})

test("sem argumentos, explica o que mede e o que não mede", () => {
  const result = runMetrics()
  assert.equal(result.status, 0)
  assert.match(result.stdout, /repository facts/)
  assert.match(result.stdout, /not behavior/)
})
