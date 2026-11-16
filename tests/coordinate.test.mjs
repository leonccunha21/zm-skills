// Unit tests for scripts/coordinate.mjs — zero dependencies, node:test only.
// Runs inside an isolated temporary directory.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const coordScript = join(repoRoot, "scripts", "coordinate.mjs")

const runCoord = (cwd, args = []) =>
  spawnSync(process.execPath, [coordScript, ...args], { cwd, encoding: "utf8" })

const makeFixture = (t) => {
  const dir = mkdtempSync(join(tmpdir(), "zm-coord-"))
  writeFileSync(join(dir, "package.json"), JSON.stringify({ name: "test-proj", private: true }, null, 2))
  writeFileSync(join(dir, "AGENTS.md"), "# Project Rules\n")
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  return dir
}

test("register cria sessão ativa e mensagem de registro", (t) => {
  const dir = makeFixture(t)
  const res = runCoord(dir, [
    "register",
    "--id", "agent-1",
    "--platform", "opencode",
    "--task", "implement cart",
    "--files", "src/cart.js,src/cart.test.js",
  ])
  assert.equal(res.status, 0)
  assert.match(res.stdout, /ok - session registered/)

  const sessionFile = join(dir, ".agents", "coordination", "sessions", "agent-1.json")
  assert.ok(existsSync(sessionFile))
  const data = JSON.parse(readFileSync(sessionFile, "utf8"))
  assert.equal(data.id, "agent-1")
  assert.equal(data.platform, "opencode")
  assert.equal(data.status, "active")
  assert.deepEqual(data.claimedFiles, ["src/cart.js", "src/cart.test.js"])
})

test("status lista sessões e devolve JSON estruturado", (t) => {
  const dir = makeFixture(t)
  runCoord(dir, ["register", "--id", "agent-a", "--platform", "opencode", "--task", "task a", "--files", "src/a.js"])
  runCoord(dir, ["register", "--id", "agent-b", "--platform", "antigravity", "--task", "task b", "--files", "src/b.js"])

  const res = runCoord(dir, ["status", "--json"])
  assert.equal(res.status, 0)
  const report = JSON.parse(res.stdout)
  assert.equal(report.totalSessions, 2)
  assert.equal(report.conflicts.length, 0)
})

test("check autoriza arquivo desimpedido e bloqueia arquivo reclamado", (t) => {
  const dir = makeFixture(t)
  runCoord(dir, ["register", "--id", "agent-a", "--platform", "opencode", "--task", "task a", "--files", "src/auth.js"])

  // Arquivo livre
  const okRes = runCoord(dir, ["check", "src/user.js", "--id", "agent-b"])
  assert.equal(okRes.status, 0)
  assert.match(okRes.stdout, /is clear to edit/)

  // Arquivo do próprio agente (permitido)
  const selfRes = runCoord(dir, ["check", "src/auth.js", "--id", "agent-a"])
  assert.equal(selfRes.status, 0)

  // Arquivo reclamado por outro agente ativo (bloqueado)
  const blockedRes = runCoord(dir, ["check", "src/auth.js", "--id", "agent-b"])
  assert.equal(blockedRes.status, 1)
  assert.match(blockedRes.stderr, /COLLISION PREVENTED/)
})

test("claim e release atualizam lista de arquivos e encerram sessão", (t) => {
  const dir = makeFixture(t)
  runCoord(dir, ["register", "--id", "agent-a", "--platform", "opencode", "--task", "task a", "--files", "src/a.js"])

  // Claim extra file
  const claimRes = runCoord(dir, ["claim", "--id", "agent-a", "--files", "src/extra.js"])
  assert.equal(claimRes.status, 0)

  // Partial release
  const relFileRes = runCoord(dir, ["release", "--id", "agent-a", "--files", "src/a.js"])
  assert.equal(relFileRes.status, 0)

  // Full release
  const fullRelRes = runCoord(dir, ["release", "--id", "agent-a"])
  assert.equal(fullRelRes.status, 0)

  const sessionFile = join(dir, ".agents", "coordination", "sessions", "agent-a.json")
  const data = JSON.parse(readFileSync(sessionFile, "utf8"))
  assert.equal(data.status, "released")
  assert.equal(data.claimedFiles.length, 0)
})

test("post e read gravam e consultam mensagens no quadro compartilhado", (t) => {
  const dir = makeFixture(t)
  const postRes = runCoord(dir, [
    "post",
    "--from", "antigravity",
    "--to", "opencode",
    "--type", "handoff",
    "--msg", "backend API pronto, iniciando integração",
  ])
  assert.equal(postRes.status, 0)

  const readRes = runCoord(dir, ["read", "--json"])
  assert.equal(readRes.status, 0)
  const msgs = JSON.parse(readRes.stdout)
  assert.equal(msgs.length, 1)
  assert.equal(msgs[0].from, "antigravity")
  assert.equal(msgs[0].to, "opencode")
  assert.match(msgs[0].message, /backend API pronto/)
})

test("clean remove sessões liberadas ou expiradas mediante autorização ou --force", (t) => {
  const dir = makeFixture(t)
  runCoord(dir, ["register", "--id", "temp-agent", "--platform", "claude", "--task", "temp"])
  runCoord(dir, ["release", "--id", "temp-agent"])

  // Invocação sem autorização falha
  const unauth = runCoord(dir, ["clean", "--stale-minutes", "0"])
  assert.equal(unauth.status, 1)
  assert.match(unauth.stderr, /requires coordinator authority/)

  // Invocação com --role coordinator tem sucesso
  const cleanRes = runCoord(dir, ["clean", "--stale-minutes", "0", "--role", "coordinator"])
  assert.equal(cleanRes.status, 0)
  assert.match(cleanRes.stdout, /cleaned 1 stale\/released session/)
})

test("claim de arquivo já reclamado exige autorização de coordinator e --force para sobrepor", (t) => {
  const dir = makeFixture(t)
  runCoord(dir, ["register", "--id", "worker-1", "--platform", "opencode", "--task", "work", "--files", "src/file.js"])
  runCoord(dir, ["register", "--id", "worker-2", "--platform", "claude", "--task", "work"])

  // worker-2 tenta reivindicar arquivo que worker-1 já possui: falha
  const blocked = runCoord(dir, ["claim", "--id", "worker-2", "--files", "src/file.js"])
  assert.equal(blocked.status, 1)
  assert.match(blocked.stderr, /COLLISION PREVENTED/)

  // worker-2 passa --force mas não é coordinator: falha
  const blockedForce = runCoord(dir, ["claim", "--id", "worker-2", "--files", "src/file.js", "--force"])
  assert.equal(blockedForce.status, 1)
  assert.match(blockedForce.stderr, /COLLISION PREVENTED/)

  // coordinator registrado com --role coordinator e --force: override tem sucesso
  runCoord(dir, ["register", "--id", "coord-1", "--platform", "antigravity", "--role", "coordinator", "--task", "supervise"])
  const okClaim = runCoord(dir, ["claim", "--id", "coord-1", "--files", "src/file.js", "--force"])
  assert.equal(okClaim.status, 0)
  assert.match(okClaim.stdout, /ok - claimed for coord-1/)
})

test("colisão com 3 agentes disputando o mesmo arquivo é detectada em status e diff", (t) => {
  const dir = makeFixture(t)

  // Três agentes em três plataformas diferentes reivindicam o mesmo arquivo
  runCoord(dir, ["register", "--id", "agent-alpha", "--platform", "opencode", "--task", "feature A", "--files", "src/shared.js"])
  runCoord(dir, ["register", "--id", "agent-beta", "--platform", "antigravity", "--task", "feature B", "--files", "src/shared.js,src/other.js"])
  runCoord(dir, ["register", "--id", "agent-gamma", "--platform", "claude", "--task", "feature C", "--files", "src/shared.js"])

  // status --json deve reportar 1 conflito (src/shared.js com 3 claimants)
  const statusRes = runCoord(dir, ["status", "--json"])
  assert.equal(statusRes.status, 0)
  const report = JSON.parse(statusRes.stdout)
  assert.equal(report.totalSessions, 3)
  assert.equal(report.conflicts.length, 1)
  assert.equal(report.conflicts[0].file, "src/shared.js")
  assert.equal(report.conflicts[0].claimants.length, 3)

  // diff deve listar o arquivo em conflito e sair com código 1
  const diffRes = runCoord(dir, ["diff", "--json"])
  assert.equal(diffRes.status, 1)
  const diffReport = JSON.parse(diffRes.stdout)
  assert.equal(diffReport.conflictCount, 1)
  assert.equal(diffReport.conflicts[0].file, "src/shared.js")
  assert.equal(diffReport.conflicts[0].claimants.length, 3)

  // check do arquivo conflitado por agente externo deve bloquear
  const checkRes = runCoord(dir, ["check", "src/shared.js", "--id", "agent-delta"])
  assert.equal(checkRes.status, 1)
  assert.match(checkRes.stderr, /COLLISION PREVENTED/)

  // Liberar um dos agentes não resolve o conflito (ainda 2 reivindicam)
  runCoord(dir, ["release", "--id", "agent-gamma"])
  const afterRelease = runCoord(dir, ["diff", "--json"])
  assert.equal(afterRelease.status, 1)
  const afterReport = JSON.parse(afterRelease.stdout)
  assert.equal(afterReport.conflicts[0].claimants.length, 2)

  // Liberar o segundo resolve o conflito
  runCoord(dir, ["release", "--id", "agent-beta"])
  const resolved = runCoord(dir, ["diff", "--json"])
  assert.equal(resolved.status, 0)
  const resolvedReport = JSON.parse(resolved.stdout)
  assert.equal(resolvedReport.conflictCount, 0)
})
