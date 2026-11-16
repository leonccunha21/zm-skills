// Hygiene test: the kit's Markdown must not carry live instruction-injection
// payloads aimed at an agent. Descriptive/defensive mentions are expected and
// are allowlisted by path below.
import { test } from "node:test"
import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const SKIP_DIRS = new Set([".git", "node_modules"])

// Files whose subject *is* injection defense or evaluation payloads may quote them.
const ALLOWED = [
  "EVALUATIONS.md",
  "docs/instruction-audit.md",
  "docs/instruction-hierarchy.md",
  "docs/tool-safety.md",
  "zm-pro/reference/14-agent-operations.md",
  "zm-pro/reference/15-ai-security.md",
  "zm-pro/templates/THREAT-MODEL.md",
  "tests/evaluations/scenarios",
]

const PATTERNS = [
  /ignore (all|any|previous|prior|the) (instructions|rules|restrictions|directions)/i,
  /disregard (all|any|previous|the) (instructions|rules|restrictions)/i,
  /you are (now|free to) /i,
  /new instructions\s*:/i,
  /(exfiltrat|steal)[^.\n]{0,40}(secret|token|password|api key|credential)/i,
]

const walk = (dir, acc = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name), acc)
    } else acc.push(join(dir, entry.name))
  }
  return acc
}

test("kit Markdown carries no unquoted injection payloads", () => {
  const files = walk(repoRoot).filter((f) => f.endsWith(".md"))
  const offenders = []
  for (const file of files) {
    const rel = relative(repoRoot, file).replaceAll("\\", "/")
    if (ALLOWED.some((allowed) => rel === allowed || rel.startsWith(`${allowed}/`))) continue
    const text = readFileSync(file, "utf8")
    for (const pattern of PATTERNS) {
      const m = text.match(pattern)
      if (m) offenders.push(`${rel}: "${m[0]}"`)
    }
  }
  assert.deepEqual(offenders, [])
})
