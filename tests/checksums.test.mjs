// Unit tests for scripts/checksums.mjs — zero dependencies, node:test only.
// Fixtures live in the OS temp directory; the real repository is never touched.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const checksumsScript = join(repoRoot, "scripts", "checksums.mjs")
const ZERO = "0".repeat(64)

const runChecksums = (cwd, args = []) =>
  spawnSync(process.execPath, [join(cwd, "scripts", "checksums.mjs"), ...args], { cwd, encoding: "utf8" })

function makeRepo(t) {
  const dir = mkdtempSync(join(tmpdir(), "zm-checksums-"))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  mkdirSync(join(dir, "scripts"), { recursive: true })
  mkdirSync(join(dir, "zm-pro"), { recursive: true })
  copyFileSync(checksumsScript, join(dir, "scripts", "checksums.mjs"))
  writeFileSync(join(dir, "zm-pro", "SKILL.md"), "---\nname: zm-pro\n---\n\nfixture v1.0.0\n")
  return dir
}

const generate = (dir) => {
  const result = runChecksums(dir)
  assert.equal(result.status, 0, result.stderr)
  return result.stdout
}

test("gera manifesto SHA-256 por arquivo", (t) => {
  const dir = makeRepo(t)
  const output = generate(dir)
  assert.match(output, /^[a-f0-9]{64} {2}zm-pro\/SKILL\.md\n$/)
})

test("verifica manifesto íntegro", (t) => {
  const dir = makeRepo(t)
  writeFileSync(join(dir, "CHECKSUMS.txt"), generate(dir))
  const result = runChecksums(dir, ["--verify", "CHECKSUMS.txt"])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /ok - manifesto íntegro/)
})

test("detecta arquivo alterado", (t) => {
  const dir = makeRepo(t)
  writeFileSync(join(dir, "CHECKSUMS.txt"), generate(dir))
  writeFileSync(join(dir, "zm-pro", "SKILL.md"), "conteúdo trocado\n")
  const result = runChecksums(dir, ["--verify", "CHECKSUMS.txt"])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /checksum mismatch/)
})

test("detecta arquivo ausente", (t) => {
  const dir = makeRepo(t)
  writeFileSync(join(dir, "CHECKSUMS.txt"), `${ZERO}  zm-pro/GONE.md\n${generate(dir)}`)
  const result = runChecksums(dir, ["--verify", "CHECKSUMS.txt"])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /missing file/)
})

test("detecta arquivo não coberto pelo manifesto", (t) => {
  const dir = makeRepo(t)
  writeFileSync(join(dir, "CHECKSUMS.txt"), generate(dir))
  writeFileSync(join(dir, "zm-pro", "extra.md"), "# extra\n")
  const result = runChecksums(dir, ["--verify", "CHECKSUMS.txt"])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /not covered by the manifest/)
})

test("rejeita caminho fora do repositório", (t) => {
  const dir = makeRepo(t)
  writeFileSync(join(dir, "CHECKSUMS.txt"), `${ZERO}  ../outside.txt\n`)
  const result = runChecksums(dir, ["--verify", "CHECKSUMS.txt"])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /outside the repository/)
})

test("rejeita linha malformada", (t) => {
  const dir = makeRepo(t)
  writeFileSync(join(dir, "CHECKSUMS.txt"), "not-a-manifest-line\n")
  const result = runChecksums(dir, ["--verify", "CHECKSUMS.txt"])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /invalid manifest entry/)
})

test("--verify sem caminho falha com uso", (t) => {
  const dir = makeRepo(t)
  const result = runChecksums(dir, ["--verify"])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /needs a manifest path/)
})
