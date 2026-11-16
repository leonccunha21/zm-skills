// Unit tests for scripts/validate.mjs — zero dependencies, node:test only.
// Fixtures are built in the OS temp directory so the real repository is never touched.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const validateScript = join(repoRoot, "scripts", "validate.mjs")
const VERSION = "1.2.3"

const runValidator = (cwd, args = []) =>
  spawnSync(process.execPath, [join(cwd, "scripts", "validate.mjs"), ...args], { cwd, encoding: "utf8" })

const validSkill = [
  "---",
  "name: zm-pro",
  "description: Fixture description long enough for the validator to accept this body in tests.",
  "---",
  "",
  "Router fixture. zm-pro v1.2.3",
  "",
  "See reference/01-code-rules.md for the rules.",
  "",
].join("\n")

function makeRepo(overrides = {}) {
  const dir = mkdtempSync(join(tmpdir(), "zm-validate-"))
  mkdirSync(join(dir, "scripts"), { recursive: true })
  copyFileSync(validateScript, join(dir, "scripts", "validate.mjs"))
  mkdirSync(join(dir, "zm-pro", "reference"), { recursive: true })
  mkdirSync(join(dir, "zm-pro", "templates"), { recursive: true })
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "zm-pro", version: VERSION }))
  const files = {
    LICENSE: "# License\n",
    "README.md": "# Fixture\n",
    "README.pt-BR.md": "# Fixture\n",
    "CHANGELOG.md": `# Changelog\n\n## [${VERSION}] — 2026-01-01\n\n- fixture\n`,
    "CONTRIBUTING.md": "# Contributing\n",
    "SECURITY.md": "# Security\n\n| Version | Supported |\n|---|---|\n| `1.2.x` | yes |\n",
    ...overrides.files,
  }
  for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content)
  writeFileSync(join(dir, "zm-pro", "SKILL.md"), overrides.skill ?? validSkill)
  writeFileSync(
    join(dir, "zm-pro", "reference", "01-code-rules.md"),
    overrides.reference ?? "# Rules\n\nRouter fixture reference.\n",
  )
  return dir
}

const withRepo = (t, overrides) => {
  const dir = makeRepo(overrides)
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  return dir
}

test("o repositório atual passa na validação", () => {
  const result = runValidator(repoRoot)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /ok - zm-pro íntegro/)
})

test("--json devolve saída estável e parseável", () => {
  const result = runValidator(repoRoot, ["--json"])
  assert.equal(result.status, 0, result.stderr)
  const report = JSON.parse(result.stdout)
  assert.equal(report.ok, true)
  assert.ok(Array.isArray(report.errors))
  assert.ok(report.files > 0)
})

test("aceita um repositório mínimo válido", (t) => {
  const dir = withRepo(t, {})
  const result = runValidator(dir)
  assert.equal(result.status, 0, result.stderr)
})

test("rejeita link relativo quebrado", (t) => {
  const dir = withRepo(t, { files: { "README.md": "# Fixture\n\n[missing](docs/nope.md)\n" } })
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /link quebrado/)
  assert.match(result.stderr, /docs\/nope\.md/)
})

test("ignora links dentro de bloco de código", (t) => {
  const readme = "# Fixture\n\n```bash\n[x](docs/nao-existe.md)\n```\n"
  const dir = withRepo(t, { files: { "README.md": readme } })
  const result = runValidator(dir)
  assert.equal(result.status, 0, result.stderr)
})

test("aceita âncora existente e rejeita âncora inexistente", (t) => {
  const ok = withRepo(t, { files: { "README.md": "# Fixture\n\n[go](#install)\n\n## Install\n" } })
  assert.equal(runValidator(ok).status, 0)

  const bad = withRepo(t, { files: { "README.md": "# Fixture\n\n[go](#nao-existe)\n" } })
  const result = runValidator(bad)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /âncora não encontrada/)
})

test("rejeita imagem quebrada", (t) => {
  const dir = withRepo(t, { files: { "README.md": "# Fixture\n\n![logo](assets/logo.png)\n" } })
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /imagem quebrado/)
})

test("resolve caminho percent-encoded com espaços", (t) => {
  const dir = withRepo(t, {})
  mkdirSync(join(dir, "docs"))
  writeFileSync(join(dir, "docs", "meu doc.md"), "# Meu doc\n\nConteúdo.\n")
  writeFileSync(join(dir, "README.md"), "# Fixture\n\n[doc](docs/meu%20doc.md)\n")
  const result = runValidator(dir)
  assert.equal(result.status, 0, result.stderr)
})

test("aceita CRLF no SKILL.md", (t) => {
  const dir = withRepo(t, { skill: validSkill.replace(/\n/g, "\r\n") })
  const result = runValidator(dir)
  assert.equal(result.status, 0, result.stderr)
})

test("rejeita resíduo específico de projeto dentro da skill", (t) => {
  const dir = withRepo(t, { reference: "# Rules\n\nConteúdo com zm-gestao no meio.\n" })
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /resíduo específico de projeto/)
})

test("rejeita router sem a versão do package.json", (t) => {
  const dir = withRepo(t, { skill: validSkill.replace("zm-pro v1.2.3", "sem versão") })
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /não menciona a versão atual/)
})

test("rejeita changelog fora de sincronia com o package.json", (t) => {
  const dir = withRepo(t, {
    files: { "CHANGELOG.md": `# Changelog\n\n## [9.9.9] — 2026-01-01\n` },
  })
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /CHANGELOG\.md: versão mais recente 9\.9\.9/)
})

test("rejeita badge estático de versão divergente", (t) => {
  const readme = "# Fixture\n\n[![Version](https://img.shields.io/badge/version-9.9.9-blue.svg)](CHANGELOG.md)\n"
  const dir = withRepo(t, { files: { "README.md": readme } })
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /badge estático 9\.9\.9/)
})

test("rejeita guia publicado que não está no índice do router", (t) => {
  const dir = withRepo(t, {})
  writeFileSync(join(dir, "zm-pro", "reference", "02-extra.md"), "# Extra\n\nGuia sem gatilho no router.\n")
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /não indexado no SKILL\.md/)
})

test("rejeita arquivo obrigatório ausente", (t) => {
  const dir = withRepo(t, {})
  rmSync(join(dir, "CONTRIBUTING.md"))
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /CONTRIBUTING\.md ausente/)
})

test("rejeita frontmatter sem description", (t) => {
  const dir = withRepo(t, { skill: "---\nname: zm-pro\n---\n\nzm-pro v1.2.3\n" })
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /description/)
})

test("rejeita frontmatter sem delimitador de fechamento", (t) => {
  const dir = withRepo(t, { skill: "---\nname: zm-pro\ndescription: aberto sem fechar\n\nzm-pro v1.2.3\n" })
  const result = runValidator(dir)
  assert.equal(result.status, 1)
  assert.match(result.stderr, /frontmatter não encontrado/)
})

test("--json carrega severidade, arquivo e linha em cada achado", (t) => {
  const dir = withRepo(t, {
    files: { "README.md": "# Fixture\n\n[quebrado](docs/nope.md)\n" },
  })
  const result = runValidator(dir, ["--json"])
  assert.equal(result.status, 1)
  const report = JSON.parse(result.stdout)
  assert.equal(report.schemaVersion, 1)
  const finding = report.findings.find((f) => f.message.includes("link quebrado"))
  assert.ok(finding, "achado de link quebrado ausente")
  assert.equal(finding.severity, "error")
  assert.equal(finding.file, "README.md")
  assert.equal(finding.line, 3)
  assert.match(finding.suggestion, /corrija o caminho/)
  assert.ok(report.counts.error >= 1)
})

test("saída determinística para a mesma entrada", (t) => {
  const dir = withRepo(t, {
    files: { "README.md": "# Fixture\n\n[quebrado](docs/nope.md)\n" },
  })
  const first = runValidator(dir, ["--json"])
  const second = runValidator(dir, ["--json"])
  assert.equal(first.stdout, second.stdout)
  assert.equal(first.status, second.status)
})

test("auditoria é somente leitura por padrão", (t) => {
  const dir = withRepo(t, {
    files: { "README.md": "# Fixture  \n\n[quebrado](docs/nope.md)   \n" },
  })
  const before = readFileSync(join(dir, "README.md"), "utf8")
  const result = runValidator(dir, ["--json"])
  assert.equal(result.status, 1)
  assert.equal(readFileSync(join(dir, "README.md"), "utf8"), before)
})

test("--fix sem --yes mostra a prévia e não escreve", (t) => {
  const dir = withRepo(t, {
    files: { "README.md": "# Fixture  \n\nsem newline final" },
  })
  const before = readFileSync(join(dir, "README.md"), "utf8")
  const result = runValidator(dir, ["--fix"])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /prévia de 1 arquivo/)
  assert.match(result.stdout, /nada foi escrito/)
  assert.equal(readFileSync(join(dir, "README.md"), "utf8"), before)
})

test("--fix --yes corrige só o que é mecânico e é idempotente", (t) => {
  const dir = withRepo(t, {
    files: { "README.md": "# Fixture  \n\nsem newline final" },
  })
  const fixed = runValidator(dir, ["--fix", "--yes"])
  assert.equal(fixed.status, 0, fixed.stderr)
  assert.equal(readFileSync(join(dir, "README.md"), "utf8"), "# Fixture\n\nsem newline final\n")
  const again = runValidator(dir, ["--fix", "--yes"])
  assert.match(again.stdout, /nada a corrigir/)
  assert.equal(readFileSync(join(dir, "README.md"), "utf8"), "# Fixture\n\nsem newline final\n")
})

test("--fail-on=warning bloqueia avisos sem esconder erros", (t) => {
  const dir = withRepo(t, {})
  const normal = runValidator(dir)
  assert.equal(normal.status, 0, normal.stderr)
  const strict = runValidator(dir, ["--fail-on=warning"])
  assert.equal(strict.status, 1)
  assert.match(strict.stdout, /aviso/)
  const invalid = runValidator(dir, ["--fail-on=banana"])
  assert.equal(invalid.status, 1)
  assert.match(invalid.stderr, /--fail-on precisa de/)
})

test("fixtures adversariais falham sem quebrar a auditoria", (t) => {
  const dir = withRepo(t, {
    files: {
      "README.md": "# Fixture\n\n[js](javascript:alert(1))\n[fora](../../../../../nowhere-exists-abc123.md)\n",
    },
  })
  const result = runValidator(dir, ["--json"])
  assert.equal(result.status, 1)
  const report = JSON.parse(result.stdout)
  assert.ok(report.findings.some((f) => /esquema executável/.test(f.message)))
  assert.ok(report.findings.some((f) => /link quebrado/.test(f.message)))
  assert.ok(report.findings.every((f) => ["error", "warning", "suggestion"].includes(f.severity)))
})
