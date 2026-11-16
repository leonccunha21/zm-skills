#!/usr/bin/env node
// Zero-dependency validator for the zm-pro skill pack and repository.
// Run: npm run validate   (or: node scripts/validate.mjs [--json])
// Exits non-zero on failure. Checks: structure, frontmatter, index integrity,
// relative links, images and anchors, project-specific residue,
// and version sync across package.json, SKILL.md, CHANGELOG, READMEs and SECURITY.
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

const SKIP_DIRS = new Set([".git", "node_modules"])
const walk = (dir, acc = []) => {
  if (!existsSync(dir)) return acc
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(join(dir, e.name), acc)
    } else {
      acc.push(join(dir, e.name))
    }
  }
  return acc
}
const allMd = walk(root).filter((f) => f.endsWith(".md"))
const skillMdFiles = allMd.filter((f) => f.startsWith(skillDir))

// Fenced code is not prose: links/headings inside it must not be validated.
const prose = (text) => {
  const kept = []
  let fence = null
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^[ \t]{0,3}(`{3,}|~{3,})/)
    if (m) {
      if (!fence) fence = m[1][0]
      else if (m[1][0] === fence) fence = null
      continue
    }
    if (!fence) kept.push(line)
  }
  return kept.join("\n")
}

// GitHub-style heading slug: keep unicode letters/numbers, drop punctuation,
// turn each space into a hyphen (so "Contributing & releases" → contributing--releases).
const slugify = (heading) =>
  heading
    .replace(/<[^>]+>/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*~]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/[ \t]/g, "-")

const headingsOf = (text) =>
  prose(text)
    .split("\n")
    .map((line) => line.match(/^#{1,6}\s+(.+?)\s*#*\s*$/))
    .filter(Boolean)
    .map((m) => slugify(m[1]))

// --- 1. Repository shape ---------------------------------------------------
for (const required of [
  "LICENSE", "README.md", "README.pt-BR.md", "CHANGELOG.md",
  "CONTRIBUTING.md", "SECURITY.md",
]) {
  if (!existsSync(join(root, required))) fail(`repo: ${required} ausente`)
}

// --- 2. Skill entry file and frontmatter ------------------------------------
if (!existsSync(skillMd)) {
  fail("zm-pro/SKILL.md ausente")
} else {
  const body = readFileSync(skillMd, "utf8")
  const fmMatch = body.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/)
  if (!fmMatch) {
    fail("SKILL.md: frontmatter não encontrado (esperado bloco --- … --- nas primeiras linhas)")
  } else {
    const fm = fmMatch[1]
    const fields = new Map()
    for (const line of fm.split(/\r?\n/)) {
      if (!line.trim()) continue
      const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
      if (!kv) { fail(`SKILL.md: linha de frontmatter inválida → ${line.trim()}`); continue }
      if (fields.has(kv[1])) fail(`SKILL.md: campo duplicado no frontmatter → ${kv[1]}`)
      fields.set(kv[1], kv[2])
    }
    for (const key of ["name", "description"]) {
      if (!fields.get(key)?.trim()) fail(`SKILL.md: campo obrigatório ausente no frontmatter → ${key}`)
    }
    const name = fields.get("name") ?? ""
    if (name && name !== "zm-pro") fail(`SKILL.md: name deve ser "zm-pro" → "${name}"`)
    const desc = (fields.get("description") ?? "").trim()
    if (desc && desc.length < 40) fail(`SKILL.md: description curta demais (${desc.length} < 40 chars)`)
    if (desc.length > 1024) fail(`SKILL.md: description longa demais (${desc.length} > 1024 chars)`)
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
      if (!set.has(f)) fail(`${rel(p)} não indexado no SKILL.md — todo guia publicado precisa de gatilho`)
    }
  }
}

// --- 4. Relative links, images and anchors resolve --------------------------
const LINK_RE = /(!?)\[[^\]]*\]\(([^)\s]+)\)/g
const safeDecode = (s) => { try { return decodeURIComponent(s) } catch { return s } }
const checkTarget = (file, target, anchor, kind) => {
  const resolved = isAbsolute(target) ? join(root, target) : resolve(dirname(file), target)
  if (!existsSync(resolved)) {
    fail(`${rel(file)}: ${kind} quebrado → ${target}`)
    return
  }
  if (!anchor || !resolved.endsWith(".md")) return
  const want = safeDecode(anchor).toLowerCase()
  if (!headingsOf(readFileSync(resolved, "utf8")).includes(want)) {
    fail(`${rel(file)}: âncora não encontrada → ${target}#${anchor}`)
  }
}
for (const f of allMd) {
  const text = readFileSync(f, "utf8")
  for (const m of prose(text).matchAll(LINK_RE)) {
    const kind = m[1] === "!" ? "imagem" : "link"
    const raw = m[2]
    if (/^(https?:|mailto:|tel:|ftp:|data:)/i.test(raw)) continue
    if (raw.startsWith("#")) {
      const want = safeDecode(raw.slice(1)).toLowerCase()
      if (!headingsOf(text).includes(want)) fail(`${rel(f)}: âncora não encontrada → ${raw}`)
      continue
    }
    const [pathPart, anchor] = raw.split("#")
    if (!pathPart) continue
    checkTarget(f, safeDecode(pathPart.split("?")[0]), anchor, kind)
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

// --- 6. Version sync across the repo -----------------------------------------
const pkgPath = join(root, "package.json")
if (existsSync(pkgPath)) {
  let pkg
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
  } catch {
    fail("package.json: JSON inválido")
  }
  if (pkg?.version) {
    const version = pkg.version
    if (!/^\d+\.\d+\.\d+$/.test(version)) fail(`package.json: versão não é SemVer → ${version}`)

    if (existsSync(skillMd) && !readFileSync(skillMd, "utf8").includes(`zm-pro v${version}`)) {
      fail(`SKILL.md: router não menciona a versão atual — esperado "zm-pro v${version}"`)
    }
    if (existsSync(join(root, "CHANGELOG.md"))) {
      const changelog = readFileSync(join(root, "CHANGELOG.md"), "utf8")
      const latest = changelog.match(/^##\s*\[(\d+\.\d+\.\d+)\]/m)
      if (!latest) fail("CHANGELOG.md: nenhuma versão encontrada (esperado ## [X.Y.Z])")
      else if (latest[1] !== version) {
        fail(`CHANGELOG.md: versão mais recente ${latest[1]} ≠ package.json ${version}`)
      }
    }
    for (const readme of ["README.md", "README.pt-BR.md"]) {
      const p = join(root, readme)
      if (!existsSync(p)) continue
      const text = readFileSync(p, "utf8")
      for (const m of text.matchAll(/img\.shields\.io\/badge\/(?:version|vers%C3%A3o)-(\d+\.\d+\.\d+)/gi)) {
        if (m[1] !== version) fail(`${readme}: badge estático ${m[1]} ≠ package.json ${version}`)
      }
    }
    if (existsSync(join(root, "SECURITY.md"))) {
      const minor = `${version.split(".")[0]}.${version.split(".")[1]}.x`
      if (!readFileSync(join(root, "SECURITY.md"), "utf8").includes(minor)) {
        warn(`SECURITY.md: não menciona a minor suportada ${minor}`)
      }
    }
  }
}

// --- 7. Basic sanity -----------------------------------------------------------
for (const f of allMd) {
  const text = readFileSync(f, "utf8")
  if (text.trim().length < 200) warn(`${rel(f)} muito curto (< 200 chars)`)
}

// --- Report ---------------------------------------------------------------------
if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ ok: errors.length === 0, files: allMd.length, errors, warnings }, null, 2))
  process.exit(errors.length === 0 ? 0 : 1)
}
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
