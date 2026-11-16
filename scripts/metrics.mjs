#!/usr/bin/env node
// Repository facts, not opinions: counts the kit can state deterministically.
// Zero dependencies, read-only, deterministic output for the same tree.
//
// Usage:
//   node scripts/metrics.mjs          # human-readable facts
//   node scripts/metrics.mjs --json   # machine-readable (schemaVersion: 1)
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))

const countMatches = (file, pattern) => {
  if (!existsSync(file)) return 0
  const text = readFileSync(file, "utf8")
  return (text.match(pattern) ?? []).length
}
const walk = (dir, acc = []) => {
  if (!existsSync(dir)) return acc
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(join(dir, e.name), acc)
    else acc.push(join(dir, e.name))
  }
  return acc
}
const testsDir = join(root, "tests")
const testFiles = walk(testsDir).filter((f) => f.endsWith(".test.mjs")).sort()
const testCases = testFiles.reduce((sum, f) => sum + countMatches(f, /^\s*test\(/gm), 0)
const scenariosDir = join(testsDir, "evaluations", "scenarios")
const scenarioFiles = existsSync(scenariosDir)
  ? readdirSync(scenariosDir).filter((f) => f.endsWith(".json")).sort()
  : []
const references = existsSync(join(root, "zm-pro", "reference"))
  ? readdirSync(join(root, "zm-pro", "reference")).filter((f) => f.endsWith(".md")).sort()
  : []
const templates = existsSync(join(root, "zm-pro", "templates"))
  ? readdirSync(join(root, "zm-pro", "templates")).filter((f) => f.endsWith(".md")).sort()
  : []

// --- Coordination metrics ---------------------------------------------------
const coordSessionsDir = join(root, ".agents", "coordination", "sessions")
const coordMessagesFile = join(root, ".agents", "coordination", "messages.ndjson")
let coordActiveSessions = 0
let coordStaleSessions = 0
let coordConflicts = 0
let coordMessageCount = 0

if (existsSync(coordSessionsDir)) {
  const now = Date.now()
  const staleMs = 15 * 60 * 1000
  const claimMap = new Map()
  for (const entry of readdirSync(coordSessionsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue
    try {
      const session = JSON.parse(readFileSync(join(coordSessionsDir, entry.name), "utf8"))
      if (session.status !== "active") continue
      const elapsed = now - Date.parse(session.updatedAt || session.startedAt || 0)
      if (elapsed > staleMs) { coordStaleSessions++; continue }
      coordActiveSessions++
      for (const f of session.claimedFiles || []) {
        if (!claimMap.has(f)) claimMap.set(f, 0)
        claimMap.set(f, claimMap.get(f) + 1)
      }
    } catch {}
  }
  coordConflicts = [...claimMap.values()].filter((n) => n > 1).length
}
if (existsSync(coordMessagesFile)) {
  const raw = readFileSync(coordMessagesFile, "utf8")
  coordMessageCount = raw.split(/\r?\n/).filter((l) => l.trim()).length
}

// ---------------------------------------------------------------------------

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))

const facts = {
  schemaVersion: 1,
  packageVersion: pkg.version,
  references: references.length,
  templates: templates.length,
  testFiles: testFiles.length,
  testCases,
  evaluationScenarios: scenarioFiles.length,
  scripts: readdirSync(join(root, "scripts")).filter((f) => f.endsWith(".mjs")).sort(),
  checksumVerified: existsSync(join(root, "scripts", "checksums.mjs")),
  coordination: {
    activeSessions: coordActiveSessions,
    staleSessions: coordStaleSessions,
    conflicts: coordConflicts,
    blackboardMessages: coordMessageCount,
  },
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(facts, null, 2))
} else {
  console.log(`zm-pro ${facts.packageVersion} — repository facts`)
  console.log(`references:         ${facts.references}`)
  console.log(`templates:          ${facts.templates}`)
  console.log(`test files:         ${facts.testFiles}`)
  console.log(`test cases:         ${facts.testCases}`)
  console.log(`evaluation scenarios: ${facts.evaluationScenarios}`)
  console.log(`scripts:            ${facts.scripts.join(", ")}`)
  console.log(`coordination:       sessions active=${facts.coordination.activeSessions} stale=${facts.coordination.staleSessions} conflicts=${facts.coordination.conflicts} messages=${facts.coordination.blackboardMessages}`)
  console.log("This counts files and cases, not behavior. Behavior is measured by EVALUATIONS.md, not here.")
}
