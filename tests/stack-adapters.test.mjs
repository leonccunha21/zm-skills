// Editorial-model guard for the stack adapters reference.
// It does not run real builds; it enforces that every adapter follows the
// agreed shape: detection list, conditional ("only if present") commands,
// monorepo guidance and no install-without-need instructions.
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const adapter = readFileSync(join(repoRoot, "zm-pro", "reference", "18-stack-adapters.md"), "utf8")

const REQUIRED_SECTIONS = [
  "## Universal rule",
  "## JavaScript / TypeScript",
  "## Python",
  "## Java / Kotlin (JVM)",
  "## .NET",
  "## PHP",
  "## Go",
  "## Rust",
  "## Mobile",
  "## Universal rule",
]

test("todos os ecossistemas prometidos estão presentes", () => {
  for (const section of REQUIRED_SECTIONS) {
    assert.ok(adapter.includes(section), `seção ausente: ${section}`)
  }
})

test("a regra universal manda detectar antes de recomendar", () => {
  assert.match(adapter, /Read the manifests/i)
  assert.match(adapter, /CI config is the best source/i)
  assert.match(adapter, /never install or migrate without a stated need|nunca instalar/i)
})

test("cada seção de ecossistema tem orientação de detecção", () => {
  const sections = adapter.split(/^## /m).slice(1)
  const skipped = ["Universal rule", "Keeping adapters honest", "Checklist"]
  const eco = sections.filter((s) => !skipped.some((skip) => s.startsWith(skip)))
  assert.ok(eco.length >= 8)
  for (const section of eco) {
    assert.match(section, /lock|toolchain|scoped|workspace|global\.json|toml|\.gradle|wrapper|manifesto/i,
      `seção sem orientação de detecção: ${section.split("\n")[0]}`)
  }
})

test("comandos aparecem como condicionais ao repositório, não como dogma", () => {
  assert.match(adapter, /only if present|if present|when present|se presente|if configured/i)
  assert.match(adapter, /Discover scripts\/tasks from the project/i)
  assert.match(adapter, /repo, not this page, is the source of truth/i)
})

test("monorepos têm orientação própria", () => {
  assert.match(adapter, /monorepo|workspaces|-p <crate>|work\b/i)
  assert.match(adapter, /scope to the affected package/i)
})

test("nenhuma seção promete comando universal sem ferramenta", () => {
  // each ecosystem section must not instruct installing tools outright
  assert.ok(!/\brun npm install\b/i.test(adapter) || adapter.includes("packageManager"))
})
