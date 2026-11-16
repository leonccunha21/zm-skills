// Offline and environment guarantees — zero dependencies, node:test only.
// The kit is local Markdown plus three Node scripts; nothing may reach the network.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const scriptsDir = join(repoRoot, "scripts")

const networkPatterns = [
  /\bfetch\s*\(/,
  /from\s+["']node:(https?|net|tls|dns|dgram)["']/,
  /require\(["'](https?|net|tls|dns|dgram)["']\)/,
  /\bhttps?\.request\s*\(/,
  /\bnet\.connect\s*\(/,
]

test("nenhum script do kit importa ou usa rede", () => {
  const offenders = []
  for (const name of readdirSync(scriptsDir)) {
    if (!name.endsWith(".mjs")) continue
    const source = readFileSync(join(scriptsDir, name), "utf8")
    for (const pattern of networkPatterns) {
      if (pattern.test(source)) offenders.push(`${name}: ${pattern}`)
    }
  }
  assert.deepEqual(offenders, [])
})

test("validação e instalação funcionam com proxy inválido (nada acessa a rede)", (t) => {
  const project = mkdtempSync(join(tmpdir(), "zm-offline-"))
  t.after(() => rmSync(project, { recursive: true, force: true }))
  const env = {
    ...process.env,
    HTTP_PROXY: "http://127.0.0.1:9",
    HTTPS_PROXY: "http://127.0.0.1:9",
    NO_PROXY: "",
    http_proxy: "http://127.0.0.1:9",
    https_proxy: "http://127.0.0.1:9",
  }
  const validate = spawnSync(process.execPath, [join(scriptsDir, "validate.mjs")], {
    cwd: repoRoot,
    encoding: "utf8",
    env,
  })
  assert.equal(validate.status, 0, validate.stderr)
  assert.match(validate.stdout, /ok - zm-pro íntegro/)

  const install = spawnSync(process.execPath, [join(scriptsDir, "install.mjs"), "opencode", "--dir", project], {
    cwd: repoRoot,
    encoding: "utf8",
    env,
  })
  assert.equal(install.status, 0, install.stderr)
  assert.match(install.stdout, /Installed zm-pro/)
})
