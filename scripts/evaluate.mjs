#!/usr/bin/env node
// Scenario checker for the evaluation suite — zero dependencies, read-only.
// It validates the *shape* of tests/evaluations/scenarios/*.json against this
// repository (unique ids, required fields, referenced files exist, no secret-like
// content). It does **not** run a model and must never be presented as a
// behavioral result — see EVALUATIONS.md for how scenarios are executed.
//
// Usage:
//   node scripts/evaluate.mjs            # human summary; exits non-zero on invalid scenarios
//   node scripts/evaluate.mjs --json      # deterministic machine-readable report
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const scenariosDir = join(root, "tests", "evaluations", "scenarios")
const referenceDir = join(root, "zm-pro", "reference")

const LEVELS = new Set(["small", "medium", "complex"])
const CATEGORIES = new Set([
  "bug", "feature", "legacy", "migration", "auth", "upload", "privacy",
  "incident", "deploy", "conflict", "security",
])
// Catching a few obvious ways a fixture leaks secrets by mistake.
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk-[A-Za-z0-9]{20,}\b/,
  /password\s*[:=]\s*["'][^"']{8,}["']/i,
  /Bearer\s+[A-Za-z0-9._-]{20,}/i,
]

const results = []
const fail = (id, message) => results.push({ id, ok: false, message })
const pass = (id, scenario) => results.push({ id, ok: true, level: scenario.level, category: scenario.category })

const files = existsSync(scenariosDir)
  ? readdirSync(scenariosDir).filter((f) => f.endsWith(".json")).sort()
  : []

if (files.length === 0) {
  console.error("evaluate.mjs: nenhuma referência de cenário em tests/evaluations/scenarios")
  process.exit(1)
}

const seen = new Map()
for (const file of files) {
  const path = join(scenariosDir, file)
  let scenario
  try {
    scenario = JSON.parse(readFileSync(path, "utf8"))
  } catch {
    fail(file, "JSON inválido")
    continue
  }
  const id = scenario.id ?? file.replace(/\.json$/, "")

  if (typeof scenario.id !== "string" || !/^eval-\d{3}$/.test(scenario.id)) fail(id, `id inválido: ${scenario.id}`)
  if (seen.has(scenario.id)) fail(id, `id duplicado também usado por ${seen.get(scenario.id)}`)
  else seen.set(scenario.id, file)

  for (const key of ["id", "title", "level", "category", "task"]) {
    if (!scenario[key] || typeof scenario[key] !== "string") fail(id, `campo obrigatório ausente ou inválido: ${key}`)
  }
  if (scenario.level && !LEVELS.has(scenario.level)) fail(id, `level inválido: ${scenario.level}`)
  if (scenario.category && !CATEGORIES.has(scenario.category)) fail(id, `category inválida: ${scenario.category}`)

  for (const key of ["constraints", "expectedContextFiles", "expectedReferences", "forbidden", "passCriteria", "criticalFailures"]) {
    if (!Array.isArray(scenario[key])) fail(id, `${key} precisa ser um array`)
  }
  if (Array.isArray(scenario.passCriteria) && scenario.passCriteria.length === 0) fail(id, "passCriteria vazio")
  if (Array.isArray(scenario.criticalFailures) && scenario.criticalFailures.length === 0) fail(id, "criticalFailures vazio")
  if (Array.isArray(scenario.forbidden) && scenario.forbidden.length === 0) fail(id, "forbidden vazio")

  for (const ref of scenario.expectedReferences ?? []) {
    if (!existsSync(join(referenceDir, ref))) fail(id, `referência esperada não existe: ${ref}`)
  }

  const text = JSON.stringify(scenario)
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(text)) fail(id, `possível segredo no cenário: ${pattern}`)
  }

  if (!results.some((r) => r.id === id && !r.ok)) pass(id, scenario)
}

const ok = results.filter((r) => r.ok)
const broken = results.filter((r) => !r.ok)

if (process.argv.includes("--json")) {
  const report = {
    schemaVersion: 1,
    kind: "scenario-check",
    behavioralResult: false,
    scenarios: results.map((r) => ({ id: r.id, ok: r.ok, ...(r.ok ? { level: r.level, category: r.category } : { message: r.message }) })),
    counts: { total: results.length, valid: ok.length, invalid: broken.length },
  }
  console.log(JSON.stringify(report, null, 2))
} else {
  console.log(`Avaliação — ${results.length} cenários definidos em tests/evaluations/scenarios`)
  for (const r of [...results].sort((a, b) => a.id.localeCompare(b.id))) {
    console.log(r.ok ? `  ok   ${r.id} (${r.level}/${r.category})` : `  ERRO ${r.id} — ${r.message}`)
  }
  console.log(`${ok.length} válido(s), ${broken.length} inválido(s)`)
  console.log("Isto verifica o formato dos cenários, não um comportamento real — veja EVALUATIONS.md.")
}
process.exit(broken.length === 0 ? 0 : 1)
