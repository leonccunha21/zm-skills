#!/usr/bin/env node
// Zero-dependency validator for the zm-pro skill pack and repository.
// Run: npm run validate   (or: node scripts/validate.mjs)
// Exits non-zero on failure. Checks: structure, index integrity,
// relative-link resolution across all Markdown files, project-specific residue,
// and router/package version sync.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, dirname, isAbsolute, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const skillDir = join(root, "zm-pro")
const skillMd = join(skillDir, "SKILL.md")

const errors = []
const warnings = []
const fail = (m) => errors.push(m)
const warn = (m) => warnings.push(m)
const rel = (p) => relative(root, p).replaceAll("\\", "/")

const walk = (dir, acc = []) => {
  if (!existsSync(dir)) return acc
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}
const allMd = walk(root).filter((f) => f.endsWith(".md") && !rel(f).startsWith("node_modules/"))
const skillMdFiles = allMd.filter((f) => f.startsWith(skillDir))

// --- 1. Repository shape ---------------------------------------------------
for (const required of ["LICENSE", "README.md", "CHANGELOG.md", "CONTRIBUTING.md"]) {
  if (!existsSync(join(root, required))) fail(`repo: ${required} ausente`)
}

// --- 2. Skill entry file and frontmatter ------------------------------------
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
      warn(`SKILL.md: description com ${desc[1].length} chars — encurte (< 1024)`)
    }
  }
  const lines = body.split("\n").length
  if (lines > 120) warn(`SKILL.md com ${lines} linhas — o router deve ficar curto (< 120)`)
}

// --- 3. Referenced files exist; index covers reality -------------------------
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

// --- 4. Relative links resolve ----------------------------------------------
const LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g
for (const f of allMd) {
  const text = readFileSync(f, "utf8")
  for (const m of text.matchAll(LINK_RE)) {
    let target = m[1]
    if (/^(https?:|mailto:|tel:|#)/i.test(target)) continue
    target = target.split("#")[0].split("?")[0]
    if (!target) continue // pure anchor
    const resolved = isAbsolute(target) ? join(root, target) : resolve(dirname(f), target)
    if (!existsSync(resolved)) fail(`${rel(f)}: link quebrado → ${target}`)
  }
}

// --- 5. No project-specific residue in the skill -----------------------------
const FORBIDDEN = [
  "mei-pro-web", "zm-gestao", "salão pro", "salao pro", "pendencias_zm",
  "build:cloud", "build:local", "agentes:check", "repositorios github",
  "melhorias", "zm-skills", "sisgestão", "zm gestao", "nzm-",
]
for (const f of skillMdFiles) {
  const text = readFileSync(f, "utf8").toLowerCase()
  for (const token of FORBIDDEN) {
    if (text.includes(token)) fail(`${rel(f)}: resíduo específico de projeto: "${token}"`)
  }
}

// --- 6. Router version matches package.json -----------------------------------
const pkgPath = join(root, "package.json")
if (existsSync(pkgPath) && existsSync(skillMd)) {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
    const body = readFileSync(skillMd, "utf8")
    if (pkg.version && !body.includes(`zm-pro v${pkg.version}`)) {
      fail(`SKILL.md: router não menciona a versão atual — esperado "zm-pro v${pkg.version}" (sincronize no release)`)
    }
  } catch {
    fail("package.json: JSON inválido")
  }
}

// --- 7. Basic sanity -----------------------------------------------------------
for (const f of allMd) {
  const text = readFileSync(f, "utf8")
  if (text.trim().length < 200) warn(`${rel(f)} muito curto (< 200 chars)`)
}

// --- Report ---------------------------------------------------------------------
console.log(`zm-pro validator — ${allMd.length} arquivos verificados`)
for (const w of warnings) console.log(`aviso - ${w}`)
for (const e of errors) console.error(`ERRO  - ${e}`)
if (errors.length === 0) {
  console.log("ok - zm-pro íntegro")
  process.exit(0)
} else {
  console.error(`BLOQUEADO - ${errors.length} erro(s)`)
  process.exit(1)
}
