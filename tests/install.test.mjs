// Unit tests for scripts/install.mjs — zero dependencies, node:test only.
// Every install goes to a temp directory (or a temp XDG_CONFIG_HOME), never the real home.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const installScript = join(repoRoot, "scripts", "install.mjs")

const runInstall = (args, env = {}, cwd = repoRoot) =>
  spawnSync(process.execPath, [installScript, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...env },
  })

test("instala no projeto e cria .agents/skills/zm-pro", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm install "))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  const result = runInstall(["opencode", "--dir", project])
  assert.equal(result.status, 0, result.stderr)
  assert.ok(existsSync(join(project, ".agents", "skills", "zm-pro", "SKILL.md")))
  assert.deepEqual(readdirSync(project), [".agents"])
})

test("recusa sobrescrever destino existente sem --force", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  assert.equal(runInstall(["opencode", "--dir", project]).status, 0)
  const second = runInstall(["opencode", "--dir", project])
  assert.equal(second.status, 1)
  assert.match(second.stderr, /already exists/)
})

test("sobrescreve com --force", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  assert.equal(runInstall(["opencode", "--dir", project]).status, 0)
  const forced = runInstall(["opencode", "--dir", project, "--force"])
  assert.equal(forced.status, 0, forced.stderr)
  assert.ok(existsSync(join(project, ".agents", "skills", "zm-pro", "SKILL.md")))
})

test("sem harness: falha com o formato npm documentado", () => {
  const result = runInstall([])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /harness required/)
  assert.match(result.stderr, /npm run install-skill -- opencode/)
})

test("harness desconhecido: falha", () => {
  const result = runInstall(["nao-existe"])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /unknown harness/)
})

test("harness sem cópia automática imprime a rota manual", () => {
  const result = runInstall(["codex"])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Manual route/)
})

test("--global do opencode respeita XDG_CONFIG_HOME", (t) => {
  const configHome = mkdtempSync(join(tmpdir(), "zm-xdg-"))
  t.after(() => rmSync(configHome, { recursive: true, force: true }))
  const result = runInstall(["opencode", "--global"], { XDG_CONFIG_HOME: configHome })
  assert.equal(result.status, 0, result.stderr)
  assert.ok(existsSync(join(configHome, "opencode", "skills", "zm-pro", "SKILL.md")))
})

test("não altera o diretório atual durante a instalação", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  const before = readdirSync(repoRoot).sort()
  const result = runInstall(["claude", "--dir", project])
  assert.equal(result.status, 0, result.stderr)
  assert.ok(existsSync(join(project, ".claude", "skills", "zm-pro", "SKILL.md")))
  assert.deepEqual(readdirSync(repoRoot).sort(), before)
})

test("--dir relativo resolve a partir do diretório de execução", (t) => {
  const base = mkdtempSync(join(tmpdir(), "zm-relative-"))
  const project = join(base, "app")
  mkdirSync(project)
  t.after(() => rmSync(base, { recursive: true, force: true }))
  const result = runInstall(["opencode", "--dir", "."], {}, project)
  assert.equal(result.status, 0, result.stderr)
  assert.ok(existsSync(join(project, ".agents", "skills", "zm-pro", "SKILL.md")))
})
