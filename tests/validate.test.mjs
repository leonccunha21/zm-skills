// Unit tests for scripts/validate.mjs — zero dependencies, node:test only.
// Fixtures are built in the OS temp directory so the real repository is never touched.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const validateScript = join(repoRoot, "scripts", "validate.mjs")

const runValidator = (cwd) =>
  spawnSync(process.execPath, [join(cwd, "scripts", "validate.mjs")], { cwd, encoding: "utf8" })

const validSkill = [
  "---",
  "name: zm-pro",
  "description: Fixture description long enough for the validator to accept this body in tests.",
  "---",
  "",
  "Router fixture. zm-pro v1.2.3",
  "",
].join("\n")

function makeRepo(overrides = {}) {
  const dir = mkdtempSync(join(tmpdir(), "zm-validate-"))
  mkdirSync(join(dir, "scripts"), { recursive: true })
  copyFileSync(validateScript, join(dir, "scripts", "validate.mjs"))
  mkdirSync(join(dir, "zm-pro", "reference"), { recursive: true })
  mkdirSync(join(dir, "zm-pro", "templates"), { recursive: true })
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "zm-pro", version: "1.2.3" }))
  for (const required of ["LICENSE", "README.md", "CHANGELOG.md", "CONTRIBUTING.md"]) {
    writeFileSync(join(dir, required), `# ${required}\n`)
  }
  writeFileSync(join(dir, "zm-pro", "SKILL.md"), overrides.skill ?? validSkill)
  writeFileSync(
    join(dir, "zm-pro", "reference", "01-code-rules.md"),
    overrides.reference ?? "# Rules\n\nRouter fixture reference.\n",
  )
  if (overrides.readme) writeFileSync(join(dir, "README.md"), overrides.readme)
  return dir
}

test("o repositório atual passa na validação", () => {
  const result = runValidator(repoRoot)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /ok - zm-pro íntegro/)
})

test("aceita um repositório mínimo válido", (t) => {
  const dir = makeRepo()
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const result = runValidator(dir)
  assert.equal(result.status, 0, result.stderr)
})

test("rejeita link relativo quebrado", (t) => {
  const dir = makeRepo({ readme: "# Fixture\n\n[missing](docs/nope.md)\n" })
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /link quebrado/)
  assert.match(result.stderr, /docs\/nope\.md/)
})

test("rejeita resíduo específico de projeto dentro da skill", (t) => {
  const dir = makeRepo({ reference: "# Rules\n\nConteúdo com zm-gestao no meio.\n" })
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /resíduo específico de projeto/)
})

test("rejeita router sem a versão do package.json", (t) => {
  const dir = makeRepo({ skill: validSkill.replace("zm-pro v1.2.3", "sem versão") })
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /não menciona a versão atual/)
})

test("rejeita arquivo obrigatório ausente", (t) => {
  const dir = makeRepo()
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  rmSync(join(dir, "CONTRIBUTING.md"))
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /CONTRIBUTING\.md ausente/)
})

test("rejeita frontmatter sem description", (t) => {
  const dir = makeRepo({ skill: "---\nname: zm-pro\n---\n\nzm-pro v1.2.3\n" })
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /description/)
})
