// Unit tests for scripts/install.mjs — zero dependencies, node:test only.
// Every install goes to a temp directory (or a temp XDG_CONFIG_HOME), never the real home.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, utimesSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const installScript = join(repoRoot, "scripts", "install.mjs")

const runInstall = (args, env = {}, cwd = repoRoot) =>
  spawnSync(process.execPath, [installScript, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, ...env },
  })

const filesUnder = (dir) => {
  const out = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...filesUnder(p))
    else out.push(p)
  }
  return out
}

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

test("sobrescreve com --force e mantém backup da instalação anterior", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  assert.equal(runInstall(["opencode", "--dir", project]).status, 0)
  const dest = join(project, ".agents", "skills", "zm-pro")
  writeFileSync(join(dest, "LOCAL.md"), "customização local\n")
  const forced = runInstall(["opencode", "--dir", project, "--force"])
  assert.equal(forced.status, 0, forced.stderr)
  assert.ok(existsSync(join(dest, "SKILL.md")))
  assert.ok(!existsSync(join(dest, "LOCAL.md")))
  const skillsDir = join(project, ".agents", "skills")
  const backup = readdirSync(skillsDir).find((name) => name.startsWith("zm-pro.backup-"))
  assert.ok(backup, "backup ausente")
  assert.equal(readFileSync(join(skillsDir, backup, "LOCAL.md"), "utf8"), "customização local\n")
  assert.match(forced.stdout, /Previous install kept at/)
  assert.match(forced.stdout, /local-only/)
})

test("--dry-run não escreve nada em destino novo", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  const result = runInstall(["opencode", "--dir", project, "--dry-run"])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Dry run — would install/)
  assert.ok(!existsSync(join(project, ".agents")))
})

test("--dry-run mostra o plano sem alterar a instalação existente", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  assert.equal(runInstall(["opencode", "--dir", project]).status, 0)
  const marker = join(project, ".agents", "skills", "zm-pro", "SKILL.md")
  const before = readFileSync(marker, "utf8")
  const result = runInstall(["opencode", "--dir", project, "--dry-run"])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Existing install: v0\.8\.1 → incoming v0\.8\.1/)
  assert.match(result.stdout, /0 changed/)
  assert.match(result.stdout, /nothing written/)
  assert.equal(readFileSync(marker, "utf8"), before)
})

test("detecta upgrade e downgrade pela versão instalada", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  assert.equal(runInstall(["opencode", "--dir", project]).status, 0)
  const skill = join(project, ".agents", "skills", "zm-pro", "SKILL.md")
  const original = readFileSync(skill, "utf8")

  writeFileSync(skill, original.replace("zm-pro v0.8.1", "zm-pro v0.7.0"))
  const upgrade = runInstall(["opencode", "--dir", project, "--dry-run"])
  assert.match(upgrade.stdout, /Existing install: v0\.7\.0 → incoming v0\.8\.1/)

  writeFileSync(skill, original.replace("zm-pro v0.8.1", "zm-pro v9.9.9"))
  const downgrade = runInstall(["opencode", "--dir", project, "--dry-run"])
  assert.match(downgrade.stdout, /Existing install: v9\.9\.9 → incoming v0\.8\.1/)
  assert.match(downgrade.stderr, /downgrade/)
})

test("recusa destino que existe mas não é diretório", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  mkdirSync(join(project, ".agents", "skills"), { recursive: true })
  writeFileSync(join(project, ".agents", "skills", "zm-pro"), "não sou uma pasta\n")
  const result = runInstall(["opencode", "--dir", project])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /not a directory/)
  assert.equal(readFileSync(join(project, ".agents", "skills", "zm-pro"), "utf8"), "não sou uma pasta\n")
})

test("instala em caminho com espaços e Unicode", (t) => {
  const base = mkdtempSync(join(tmpdir(), "zm-install-"))
  const project = join(base, "projeto ação ção")
  mkdirSync(project)
  t.after(() => rmSync(base, { recursive: true, force: true }))
  const result = runInstall(["opencode", "--dir", project])
  assert.equal(result.status, 0, result.stderr)
  assert.ok(existsSync(join(project, ".agents", "skills", "zm-pro", "SKILL.md")))
})

test("reinstalar o mesmo conteúdo é idempotente", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  assert.equal(runInstall(["opencode", "--dir", project]).status, 0)
  const dest = join(project, ".agents", "skills", "zm-pro")
  const snapshot = () =>
    Object.fromEntries(filesUnder(dest).map((f) => [f, readFileSync(f, "utf8")]))
  const before = snapshot()
  const second = runInstall(["opencode", "--dir", project, "--force"])
  assert.equal(second.status, 0, second.stderr)
  assert.match(second.stdout, /0 changed, 0 new, 0 local-only/)
  assert.deepEqual(snapshot(), before)
})

test("remove pasta temporária antiga de instalação interrompida", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  const skillsDir = join(project, ".agents", "skills")
  const stale = join(skillsDir, "zm-pro.tmp-2020-01-01T00-00-00-000Z")
  mkdirSync(stale, { recursive: true })
  writeFileSync(join(stale, "SKILL.md"), "meia cópia\n")
  utimesSync(stale, new Date("2020-01-01"), new Date("2020-01-01"))
  const result = runInstall(["opencode", "--dir", project])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Removed stale temp folder/)
  assert.ok(!existsSync(stale))
  assert.ok(existsSync(join(project, ".agents", "skills", "zm-pro", "SKILL.md")))
})

test("não segue link simbólico dentro do destino", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  assert.equal(runInstall(["opencode", "--dir", project]).status, 0)
  const outside = join(project, "segredo.txt")
  writeFileSync(outside, "conteúdo fora do destino\n")
  const link = join(project, ".agents", "skills", "zm-pro", "LINK.md")
  try {
    symlinkSync(outside, link, "file")
  } catch {
    t.skip("criação de link simbólico não permitida neste sistema")
    return
  }
  const result = runInstall(["opencode", "--dir", project, "--dry-run"])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /symbolic link/)
})

test("upgrade a partir de instalação sintética antiga restaura o estado exato do repositório", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  assert.equal(runInstall(["opencode", "--dir", project]).status, 0)
  const dest = join(project, ".agents", "skills", "zm-pro")
  // synthetic old install: version marker 0.6.0 (this exact release line does not exist in history)
  const skillFile = join(dest, "SKILL.md")
  writeFileSync(skillFile, readFileSync(skillFile, "utf8").replace("zm-pro v0.8.1", "zm-pro v0.6.0"))
  const plan = runInstall(["opencode", "--dir", project, "--dry-run"])
  assert.equal(plan.status, 0, plan.stderr)
  assert.match(plan.stdout, /Existing install: v0\.6\.0 → incoming v0\.8\.1/)

  const upgrade = runInstall(["opencode", "--dir", project, "--force"])
  assert.equal(upgrade.status, 0, upgrade.stderr)
  const rel = (base, file) => relative(base, file).replaceAll("\\", "/")
  const source = join(repoRoot, "zm-pro")
  const sourceFiles = filesUnder(source).map((f) => rel(source, f)).sort()
  const destFiles = filesUnder(dest).map((f) => rel(dest, f)).sort()
  assert.deepEqual(destFiles, sourceFiles)
  for (const file of sourceFiles) {
    assert.equal(
      readFileSync(join(dest, file)).equals(readFileSync(join(source, file))),
      true,
      `${file} não corresponde à fonte`,
    )
  }
})

test("aceita --dir antes do harness", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-install-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  const result = runInstall(["--dir", project, "opencode"])
  assert.equal(result.status, 0, result.stderr)
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

test("desinstalar é apagar a pasta: nada fora do destino é tocado", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-uninstall-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  assert.equal(runInstall(["opencode", "--dir", project]).status, 0)
  const installed = filesUnder(project)
  const dest = join(project, ".agents", "skills", "zm-pro")
  assert.ok(installed.length > 0)
  assert.ok(installed.every((p) => p.startsWith(dest)))
  rmSync(dest, { recursive: true, force: true })
  assert.deepEqual(filesUnder(project), [])
})

test("--with-tools instala scripts/coordinate.mjs no projeto consumidor", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-tools-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  const res = runInstall(["opencode", "--dir", project, "--with-tools"])
  assert.equal(res.status, 0, res.stderr)
  assert.ok(existsSync(join(project, ".agents", "skills", "zm-pro", "SKILL.md")))
  assert.ok(existsSync(join(project, "scripts", "coordinate.mjs")))
  assert.match(res.stdout, /Installed tool:.*coordinate\.mjs/)
})

test("--with-tools com --dry-run não cria pastas nem copia scripts", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-tools-dry-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  const res = runInstall(["opencode", "--dir", project, "--with-tools", "--dry-run"])
  assert.equal(res.status, 0, res.stderr)
  assert.match(res.stdout, /Dry run — would also copy scripts\/coordinate\.mjs/)
  assert.equal(existsSync(join(project, "scripts")), false)
})
