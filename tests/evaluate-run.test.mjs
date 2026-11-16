// Unit tests for scripts/evaluate-run.mjs — real execution with a stub argv.
// Every test redirects output to a temp --out-dir: nothing is written into
// the repository tree, so this file parallelizes safely with other suites.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const runner = join(repoRoot, "scripts", "evaluate-run.mjs")

const makeOut = (t) => {
  const out = mkdtempSync(join(tmpdir(), "zm-evalrun-out-"))
  t.after(() => rmSync(out, { recursive: true, force: true }))
  return out
}

const run = (args) => spawnSync(process.execPath, [runner, ...args], { cwd: repoRoot, encoding: "utf8" })

const artifacts = (outDir) =>
  existsSync(outDir) ? readdirSync(outDir).filter((f) => /-eval-\d{3}\.(raw\.log|md)$/.test(f)) : []

test("--dry-run não executa nem escreve", (t) => {
  const out = makeOut(t)
  const result = run(["eval-001", "--command-json", "[\"node\",\"-e\",\"process.exit(0)\"]", "--out-dir", out, "--dry-run"])
  assert.equal(result.status, 0)
  assert.match(result.stdout, /Dry run/)
  assert.match(result.stdout, /argv/)
  assert.equal(artifacts(out).length, 0)
})

test("cenário desconhecido falha com código 1", (t) => {
  const out = makeOut(t)
  const result = run(["eval-999", "--command-json", "[\"node\",\"-e\",\"process.exit(0)\"]", "--out-dir", out])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /cenário não encontrado/)
  assert.equal(artifacts(out).length, 0)
})

test("--command-json é obrigatório e parseado como argv", (t) => {
  const out = makeOut(t)
  const missing = run(["eval-001", "--out-dir", out])
  assert.equal(missing.status, 1)
  assert.match(missing.stderr, /obrigatório/)

  const broken = run(["eval-001", "--command-json", "not-json", "--out-dir", out])
  assert.equal(broken.status, 1)
  assert.match(broken.stderr, /inválido/)
  assert.equal(artifacts(out).length, 0)
})

test("prompt viaja como argumento, sem shell (zero interpretação)", (t) => {
  const out = makeOut(t)
  const label = `test-${Date.now()}`
  const tmp = mkdtempSync(join(tmpdir(), "zm-evalrun-"))
  t.after(() => rmSync(tmp, { recursive: true, force: true }))
  const proof = join(tmp, "argv.json")
  const argv = JSON.stringify(["node", "-e", `require('fs').writeFileSync(${JSON.stringify(proof)}, JSON.stringify(process.argv.slice(1)))`, "{{prompt}}"])
  const result = run(["eval-001", "--command-json", argv, "--label", label, "--out-dir", out])
  assert.equal(result.status, 0, result.stderr)
  const got = JSON.parse(readFileSync(proof, "utf8"))
  assert.equal(got.length, 1)
  assert.match(got[0], /cart total|Cart total/)
  assert.deepEqual(artifacts(out).sort(), [`${label}-eval-001.md`, `${label}-eval-001.raw.log`])
})

test("executa e gera transcript + scaffold que não se vende como baseline", (t) => {
  const out = makeOut(t)
  const label = `test-${Date.now()}`
  const result = run(["eval-001", "--command-json", "[\"node\",\"-e\",\"console.log('eval-stub-ok')\"]", "--label", label, "--out-dir", out, "--model", "test-model", "--harness", "test harness 1.0"])
  assert.equal(result.status, 0, result.stderr)
  const files = readdirSync(out)
  assert.ok(files.includes(`${label}-eval-001.raw.log`))
  assert.ok(files.includes(`${label}-eval-001.md`))
  assert.match(readFileSync(join(out, `${label}-eval-001.raw.log`), "utf8"), /eval-stub-ok/)
  const report = readFileSync(join(out, `${label}-eval-001.md`), "utf8")
  assert.match(report, /Not a baseline/)
  assert.match(report, /test-model/)
  assert.equal(artifacts(out).length, 2)
})

test("harness inexistente sai com código 1 e mantém transcript para diagnóstico", (t) => {
  const out = makeOut(t)
  const label = `test-${Date.now()}`
  const result = run(["eval-001", "--command-json", JSON.stringify(["zm-notareal-binary-9f8e7d6c5b4a31"]), "--label", label, "--out-dir", out])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /falha ao iniciar o harness/)
  const transcript = readFileSync(join(out, `${label}-eval-001.raw.log`), "utf8")
  assert.match(transcript, /error: Error/)
  const report = readFileSync(join(out, `${label}-eval-001.md`), "utf8")
  assert.ok(report.length > 0, "relatório scaffold deve existir para diagnóstico")
})

test("harness com exit ≠ 0 sai com código 1 e o transcript registra o código", (t) => {
  const out = makeOut(t)
  const label = `test-${Date.now()}`
  const result = run(["eval-001", "--command-json", JSON.stringify([process.execPath, "-e", "process.exit(3)"]), "--label", label, "--out-dir", out])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /harness saiu com código 3/)
  const transcript = readFileSync(join(out, `${label}-eval-001.raw.log`), "utf8")
  assert.match(transcript, /exit: 3/)
})
