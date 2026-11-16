// Guards the test wiring: every tests/*.test.mjs must be registered in
// package.json#scripts.test — and no stale entries either.
// Motivation: in v0.10.0 some committed test files were missing from the local
// npm test script (CI ran a subset in one-off steps). npm test is now the
// single source of truth and CI runs exactly it — this guard keeps it that way.
import { test } from "node:test"
import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const pkg = JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8"))
const testScript = pkg.scripts?.test ?? ""

const testFiles = readdirSync(join(repoRoot, "tests"))
  .filter((f) => f.endsWith(".test.mjs"))
  .sort()

test("todo tests/*.test.mjs está registrado em package.json#scripts.test", () => {
  assert.ok(testFiles.length > 0, "nenhum test.mjs encontrado")
  const missing = testFiles.filter((f) => !testScript.includes(`tests/${f}`))
  assert.deepEqual(missing, [], `não registrados no npm test: ${missing.join(", ")}`)
})

test("o script de teste não referencia arquivos inexistentes", () => {
  const referenced = [...testScript.matchAll(/tests\/[\w.-]+\.test\.mjs/g)].map((m) => m[0])
  const stale = referenced.filter((p) => !testFiles.includes(p.slice("tests/".length)))
  assert.deepEqual(stale, [], `referências que não existem: ${stale.join(", ")}`)
})
