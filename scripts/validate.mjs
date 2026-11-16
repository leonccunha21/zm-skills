#!/usr/bin/env node
// Zero-dependency validator for the zm-pro skill pack.
// Run: npm run validate   (or: node scripts/validate.mjs)
// Exits non-zero on failure. Checks structure, index integrity and residue.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const skillDir = join(root, "zm-pro")
const skillMd = join(skillDir, "SKILL.md")

const errors = []
const warnings = []

const fail = (msg) => errors.push(msg)
const warn = (msg) => warnings.push(msg)
const rel = (p) => relative(root, p).replaceAll("\\", "/")

// --- 1. Skill entry file and frontmatter ---------------------------------
if (!existsSync(skillMd)) {
  fail("zm-pro/SKILL.md ausente")
} else {
  const body = readFileSync(skillMd, "utf8")
  const fmMatch = body.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!fmMatch) {
    fail("SKILL.md: frontmatter não encontrado (esperado bloco --- … ---)")
  } else {
    const fm = fmMatch[1]
    if (!/^name:\s*zm-pro\s*$/m.test(fm)) fail("SKILL.md: frontmatter precisa de `name: zm-pro`")
    const desc = fm.match(/^description:\s*([\s\S]*?)(?=^\w[\w-]*:|\s*$)/m)
    if (!desc || desc[1].trim().length < 40) {
      fail("SKILL.md: `description` ausente ou curta demais (< 40 chars)")
    } else if (desc[1].length > 1024) {
      warn(`SKILL.md: description com ${desc[1].length} chars — considere encurtar (< 1024)`)
    }
  }
  const lines = body.split("\n").length
  if (lines > 120) warn(`SKILL.md com ${lines} linhas — o router deve ficar curto (< 120)`)
}

// --- 2. Referenced files exist; index covers reality ----------------------
if (existsSync(skillMd)) {
  const body = readFileSync(skillMd, "utf8")
  const refDir = join(skillDir, "reference")
  const tplDir = join(skillDir, "templates")

  const refs = new Set([...body.matchAll(/reference\/([\w.-]+\.md)/g)].map((m) => m[1]))
  const tpl = new Set([...body.matchAll(/templates\/([\w.-]+\.md)/g)].map((m) => m[1]))

  for (const r of refs) if (!existsSync(join(refDir, r))) fail(`SKILL.md referencia inexistente: reference/${r}`)
  for (const t of tpl) if (!existsSync(join(tplDir, t))) fail(`SKILL.md referencia inexistente: templates/${t}`)

  for (const dir of [refDir, tplDir]) {
    if (!existsSync(dir)) { fail(`${rel(dir)} ausente`); continue }
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (!statSync(p).isFile() || !f.endsWith(".md")) continue
      const set = dir === refDir ? refs : tpl
      if (!set.has(f)) warn(`${rel(p)} não referenciado no SKILL.md — adicione ao índice`)
    }
  }
}

// --- 3. No project-specific residue anywhere in the skill ------------------
const FORBIDDEN = [
  "mei-pro-web", "zm-gestao", "salão pro", "salao pro", "pendencias_zm",
  "build:cloud", "build:local", "agentes:check", "repositorios github",
  "melhorias", "zm-skills", "sisgestão", "zm gestao", "nzm-",
]
const mdFiles = []
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith(".md")) mdFiles.push(p)
  }
}
if (existsSync(skillDir)) walk(skillDir)
for (const f of mdFiles) {
  const text = readFileSync(f, "utf8").toLowerCase()
  for (const token of FORBIDDEN) {
    if (text.includes(token)) fail(`${rel(f)}: resíduo específico de projeto encontrado: "${token}"`)
  }
}

// --- 4. Basic file sanity ---------------------------------------------------
for (const f of [skillMd, ...mdFiles]) {
  if (!existsSync(f)) continue
  const text = readFileSync(f, "utf8")
  if (text.trim().length < 200) warn(`${rel(f)} muito curto (< 200 chars)`)
}

// --- Report -----------------------------------------------------------------
console.log(`zm-pro validator — ${mdFiles.length} arquivos verificados`)
for (const w of warnings) console.log(`aviso - ${w}`)
for (const e of errors) console.error(`ERRO  - ${e}`)
if (errors.length === 0) {
  console.log("ok - zm-pro íntegro")
  process.exit(0)
} else {
  console.error(`BLOQUEADO - ${errors.length} erro(s)`)
  process.exit(1)
}
