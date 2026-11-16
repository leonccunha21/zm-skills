#!/usr/bin/env node
// Zero-dependency validator/auditor for the zm-pro skill pack and repository.
// Run: npm run validate   (or: node scripts/validate.mjs [flags])
//
// Flags:
//   --json               machine-readable report (stable schema, sorted findings)
//   --fail-on=<level>    error (default) | warning | suggestion — minimum severity that fails
//   --fix                preview the mechanical fixes (trailing whitespace, final newline)
//   --fix --yes          apply those fixes (never touches anything else)
//   --quiet              only the summary and blocking findings
//
// Checks: repository shape, frontmatter, index integrity, relative links, images
// and anchors, project-specific residue, version sync across package.json,
// SKILL.md, CHANGELOG, READMEs and SECURITY, plus mechanical hygiene.
// Read-only by default. Exits non-zero when a finding reaches the configured level.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { join, relative, dirname, isAbsolute, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const skillDir = join(root, "zm-pro")
const skillMd = join(skillDir, "SKILL.md")

const findings = []
const add = (severity, message, location = {}) => {
  findings.push({
    severity,
    message,
    file: location.file ?? null,
    line: location.line ?? null,
    evidence: location.evidence ?? null,
    suggestion: location.suggestion ?? null,
  })
}
const fail = (message, location) => add("error", message, location)
const warn = (message, location) => add("warning", message, location)
const suggest = (message, location) => add("suggestion", message, location)
const rel = (p) => relative(root, p).replaceAll("\\", "/")

const textCache = new Map()
const readText = (file) => {
  if (!textCache.has(file)) {
    try {
      textCache.set(file, readFileSync(file, "utf8"))
    } catch {
      textCache.set(file, "")
    }
  }
  return textCache.get(file)
}
const lineOf = (file, needle) => {
  if (!file) return null
  const index = readText(file).indexOf(needle)
  if (index === -1) return null
  return readText(file).slice(0, index).split(/\r?\n/).length
}

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
  if (!existsSync(join(root, required))) {
    fail(`repo: ${required} ausente`, { file: required, suggestion: `crie ${required} na raiz` })
  }
}

// --- 2. Skill entry file and frontmatter ------------------------------------
if (!existsSync(skillMd)) {
  fail("zm-pro/SKILL.md ausente", { file: rel(skillMd) })
} else {
  const body = readText(skillMd)
  const fmMatch = body.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/)
  if (!fmMatch) {
    fail("SKILL.md: frontmatter não encontrado (esperado bloco --- … --- nas primeiras linhas)", {
      file: rel(skillMd), line: 1, suggestion: "adicione --- / name / description / --- no topo",
    })
  } else {
    const fm = fmMatch[1]
    const fields = new Map()
    for (const line of fm.split(/\r?\n/)) {
      if (!line.trim()) continue
      const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
      if (!kv) {
        fail(`SKILL.md: linha de frontmatter inválida → ${line.trim()}`, {
          file: rel(skillMd), line: lineOf(skillMd, line.trim()),
        })
        continue
      }
      if (fields.has(kv[1])) {
        fail(`SKILL.md: campo duplicado no frontmatter → ${kv[1]}`, {
          file: rel(skillMd), line: lineOf(skillMd, line.trim()),
        })
      }
      fields.set(kv[1], kv[2])
    }
    for (const key of ["name", "description"]) {
      if (!fields.get(key)?.trim()) {
        fail(`SKILL.md: campo obrigatório ausente no frontmatter → ${key}`, {
          file: rel(skillMd), line: 2, suggestion: `acrescente "${key}:" ao frontmatter`,
        })
      }
    }
    const name = fields.get("name") ?? ""
    if (name && name !== "zm-pro") {
      fail(`SKILL.md: name deve ser "zm-pro" → "${name}"`, { file: rel(skillMd) })
    }
    const desc = (fields.get("description") ?? "").trim()
    if (desc && desc.length < 40) {
      fail(`SKILL.md: description curta demais (${desc.length} < 40 chars)`, {
        file: rel(skillMd), suggestion: "descreva quando usar e o que a skill entrega",
      })
    }
    if (desc.length > 1024) {
      fail(`SKILL.md: description longa demais (${desc.length} > 1024 chars)`, { file: rel(skillMd) })
    }
  }
  const lines = body.split("\n").length
  if (lines > 120) {
    warn(`SKILL.md com ${lines} linhas — o router deve ficar curto (< 120)`, {
      file: rel(skillMd), evidence: `${lines} linhas`,
    })
  }
}

// --- 3. Referenced files exist; index covers reality -------------------------
if (existsSync(skillMd)) {
  const body = readText(skillMd)
  const refDir = join(skillDir, "reference")
  const tplDir = join(skillDir, "templates")

  const refs = new Set([...body.matchAll(/reference\/([\w.-]+\.md)/g)].map((m) => m[1]))
  const tpl = new Set([...body.matchAll(/templates\/([\w.-]+\.md)/g)].map((m) => m[1]))

  for (const r of refs) {
    if (!existsSync(join(refDir, r))) {
      fail(`SKILL.md referencia inexistente: reference/${r}`, {
        file: rel(skillMd), line: lineOf(skillMd, `reference/${r}`),
        suggestion: "crie o arquivo ou remova a referência do índice",
      })
    }
  }
  for (const t of tpl) {
    if (!existsSync(join(tplDir, t))) {
      fail(`SKILL.md referencia inexistente: templates/${t}`, {
        file: rel(skillMd), line: lineOf(skillMd, `templates/${t}`),
        suggestion: "crie o arquivo ou remova a referência do índice",
      })
    }
  }

  for (const dir of [refDir, tplDir]) {
    if (!existsSync(dir)) {
      fail(`${rel(dir)} ausente`, { file: rel(dir) })
      continue
    }
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (!statSync(p).isFile() || !f.endsWith(".md")) continue
      const set = dir === refDir ? refs : tpl
      if (!set.has(f)) {
        fail(`${rel(p)} não indexado no SKILL.md — todo guia publicado precisa de gatilho`, {
          file: rel(p), line: 1,
          suggestion: `adicione reference/${f} (ou templates/${f}) ao índice do router`,
        })
      }
    }
  }
}

// --- 4. Relative links, images and anchors resolve --------------------------
const LINK_RE = /(!?)\[[^\]]*\]\(([^)\s]+)\)/g
const safeDecode = (s) => { try { return decodeURIComponent(s) } catch { return s } }
const checkTarget = (file, target, anchor, kind, raw) => {
  const resolved = isAbsolute(target) ? join(root, target) : resolve(dirname(file), target)
  if (!existsSync(resolved)) {
    fail(`${rel(file)}: ${kind} quebrado → ${target}`, {
      file: rel(file), line: lineOf(file, raw), evidence: `destino resolvido: ${rel(resolved)}`,
      suggestion: "corrija o caminho (use %20 para espaços) ou crie o arquivo",
    })
    return
  }
  if (!anchor || !resolved.endsWith(".md")) return
  const want = safeDecode(anchor).toLowerCase()
  if (!headingsOf(readText(resolved)).includes(want)) {
    fail(`${rel(file)}: âncora não encontrada → ${target}#${anchor}`, {
      file: rel(file), line: lineOf(file, raw),
      evidence: `títulos disponíveis: ${headingsOf(readText(resolved)).slice(0, 6).join(", ") || "(nenhum)"}`,
      suggestion: "atualize o #slug ou o título de destino",
    })
  }
}
for (const f of allMd) {
  const text = readText(f)
  for (const m of prose(text).matchAll(LINK_RE)) {
    const kind = m[1] === "!" ? "imagem" : "link"
    const raw = m[2]
    if (/^(https?:|mailto:|tel:|ftp:|data:)/i.test(raw)) continue
    if (/^(javascript|vbscript):/i.test(raw)) {
      fail(`${rel(f)}: link com esquema executável não é permitido → ${raw}`, {
        file: rel(f), line: lineOf(f, raw), evidence: raw,
        suggestion: "use um link https:// ou um caminho relativo",
      })
      continue
    }
    if (raw.startsWith("#")) {
      const want = safeDecode(raw.slice(1)).toLowerCase()
      if (!headingsOf(text).includes(want)) {
        fail(`${rel(f)}: âncora não encontrada → ${raw}`, {
          file: rel(f), line: lineOf(f, raw), suggestion: "atualize o #slug ou o título",
        })
      }
      continue
    }
    const [pathPart, anchor] = raw.split("#")
    if (!pathPart) continue
    checkTarget(f, safeDecode(pathPart.split("?")[0]), anchor, kind, raw)
  }
}

// --- 5. No project-specific residue in the skill -----------------------------
const FORBIDDEN = [
  "mei-pro-web", "zm-gestao", "salão pro", "salao pro", "pendencias_zm",
  "build:cloud", "build:local", "agentes:check", "repositorios github",
  "melhorias", "zm-skills", "sisgestão", "zm gestao", "nzm-",
]
for (const f of skillMdFiles) {
  const text = readText(f).toLowerCase()
  for (const token of FORBIDDEN) {
    if (text.includes(token)) {
      const line = lineOf(f, token)
      fail(`${rel(f)}: resíduo específico de projeto: "${token}"`, {
        file: rel(f), line, evidence: `linha ${line ?? "?"} contém "${token}"`,
        suggestion: "remova o nome/regra específica de projeto da skill",
      })
    }
  }
}

// --- 6. Version sync across the repo -----------------------------------------
const pkgPath = join(root, "package.json")
if (existsSync(pkgPath)) {
  let pkg
  try {
    pkg = JSON.parse(readText(pkgPath))
  } catch {
    fail("package.json: JSON inválido", { file: "package.json" })
  }
  if (pkg?.version) {
    const version = pkg.version
    if (!/^\d+\.\d+\.\d+$/.test(version)) {
      fail(`package.json: versão não é SemVer → ${version}`, { file: "package.json" })
    }

    if (existsSync(skillMd) && !readText(skillMd).includes(`zm-pro v${version}`)) {
      fail(`SKILL.md: router não menciona a versão atual — esperado "zm-pro v${version}"`, {
        file: rel(skillMd), line: 1, evidence: `package.json version = ${version}`,
        suggestion: `troque o marcador por "zm-pro v${version}"`,
      })
    }
    if (existsSync(join(root, "CHANGELOG.md"))) {
      const changelog = readText(join(root, "CHANGELOG.md"))
      const latest = changelog.match(/^##\s*\[(\d+\.\d+\.\d+)\]/m)
      if (!latest) {
        fail("CHANGELOG.md: nenhuma versão encontrada (esperado ## [X.Y.Z])", {
          file: "CHANGELOG.md", suggestion: "finalize [Unreleased] em ## [X.Y.Z] — data",
        })
      } else if (latest[1] !== version) {
        fail(`CHANGELOG.md: versão mais recente ${latest[1]} ≠ package.json ${version}`, {
          file: "CHANGELOG.md", line: lineOf(join(root, "CHANGELOG.md"), `## [${latest[1]}]`),
          evidence: `package.json version = ${version}`, suggestion: "finalize o changelog na versão publicada",
        })
      }
    }
    for (const readme of ["README.md", "README.pt-BR.md"]) {
      const p = join(root, readme)
      if (!existsSync(p)) continue
      const text = readText(p)
      for (const m of text.matchAll(/img\.shields\.io\/badge\/(?:version|vers%C3%A3o)-(\d+\.\d+\.\d+)/gi)) {
        if (m[1] !== version) {
          fail(`${readme}: badge estático ${m[1]} ≠ package.json ${version}`, {
            file: readme, line: lineOf(p, m[0]), evidence: `package.json version = ${version}`,
            suggestion: "use o badge dinâmico do GitHub Releases ou atualize o número",
          })
        }
      }
    }
    if (existsSync(join(root, "SECURITY.md"))) {
      const minor = `${version.split(".")[0]}.${version.split(".")[1]}.x`
      if (!readText(join(root, "SECURITY.md")).includes(minor)) {
        warn(`SECURITY.md: não menciona a minor suportada ${minor}`, {
          file: "SECURITY.md", suggestion: `documente a versão suportada ${minor}`,
        })
      }
    }
  }
}

// --- 7. Basic sanity -----------------------------------------------------------
for (const f of allMd) {
  const text = readText(f)
  if (text.trim().length < 200) {
    warn(`${rel(f)} muito curto (< 200 chars)`, {
      file: rel(f), evidence: `${text.trim().length} chars`, suggestion: "remova o arquivo vazio ou escreva o conteúdo",
    })
  }
}

// --- 8. Mechanical hygiene (the only findings --fix may touch) ----------------
const mechanical = []
for (const f of allMd) {
  const text = readText(f)
  const lines = text.split(/\r?\n/)
  lines.forEach((line, index) => {
    if (/[ \t]+$/.test(line)) {
      suggest(`${rel(f)}: espaço em branco no fim da linha`, {
        file: rel(f), line: index + 1, evidence: JSON.stringify(line.slice(-6)), suggestion: "remover o espaço",
      })
      mechanical.push({ file: f, kind: "trailing" })
    }
  })
  if (text.length > 0 && !text.endsWith("\n")) {
    suggest(`${rel(f)}: arquivo sem newline final`, {
      file: rel(f), line: lines.length, suggestion: "terminar o arquivo com uma quebra de linha",
    })
    mechanical.push({ file: f, kind: "newline" })
  }
}

// --- Report ---------------------------------------------------------------------
const order = { error: 0, warning: 1, suggestion: 2 }
findings.sort((a, b) =>
  (a.file ?? "").localeCompare(b.file ?? "") ||
  (a.line ?? 0) - (b.line ?? 0) ||
  order[a.severity] - order[b.severity] ||
  a.message.localeCompare(b.message)
)
const errors = findings.filter((f) => f.severity === "error")
const warnings = findings.filter((f) => f.severity === "warning")
const suggestions = findings.filter((f) => f.severity === "suggestion")

const fixArg = process.argv.includes("--fix")
const yes = process.argv.includes("--yes")
const failOnArg = process.argv.find((a) => a.startsWith("--fail-on="))
const failOn = failOnArg ? failOnArg.split("=")[1] : "error"
if (!["error", "warning", "suggestion"].includes(failOn)) {
  console.error(`validate.mjs: --fail-on precisa de error | warning | suggestion (recebido: ${failOn})`)
  process.exit(1)
}

const fixTargets = [...new Set(mechanical.map((m) => m.file))]
if (fixArg) {
  let total = 0
  for (const file of fixTargets) {
    const before = readText(file)
    const after = `${before.replace(/\r?\n/g, "\n").split("\n").map((line) => line.replace(/[ \t]+$/, "")).join("\n").replace(/\n*$/, "")}\n`
    if (after === before) continue
    const beforeLines = before.split(/\r?\n/)
    const afterLines = after.split("\n")
    const changed = []
    for (let i = 0; i < Math.max(beforeLines.length, afterLines.length); i += 1) {
      if (beforeLines[i] !== afterLines[i]) changed.push(i + 1)
    }
    console.log(`fix - ${rel(file)} (linhas ${changed.slice(0, 8).join(", ")}${changed.length > 8 ? ", …" : ""})`)
    total += 1
    if (yes) writeFileSync(file, after)
  }
  if (total === 0) console.log("fix - nada a corrigir")
  else if (!yes) {
    console.log(`fix - prévia de ${total} arquivo(s); nada foi escrito. Re-rode com --fix --yes para aplicar.`)
    process.exit(0)
  } else {
    console.log(`fix - ${total} arquivo(s) corrigido(s) mecanicamente (espaço no fim da linha / newline final).`)
  }
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({
    schemaVersion: 1,
    ok: errors.length === 0,
    files: allMd.length,
    counts: { error: errors.length, warning: warnings.length, suggestion: suggestions.length },
    errors: errors.map((f) => f.message),
    warnings: warnings.map((f) => f.message),
    findings,
  }, null, 2))
} else {
  console.log(`zm-pro validator — ${allMd.length} arquivos verificados`)
  const quiet = process.argv.includes("--quiet")
  if (!quiet) {
    for (const f of suggestions) {
      const at = f.file ? ` ${f.file}${f.line ? `:${f.line}` : ""} —` : ""
      console.log(`sugestão -${at} ${f.message}${f.suggestion ? ` · ${f.suggestion}` : ""}`)
    }
    for (const f of warnings) {
      const at = f.file ? ` ${f.file}${f.line ? `:${f.line}` : ""} —` : ""
      console.log(`aviso -${at} ${f.message}${f.suggestion ? ` · ${f.suggestion}` : ""}`)
    }
  }
  for (const f of errors) {
    const at = f.file ? ` ${f.file}${f.line ? `:${f.line}` : ""} —` : ""
    console.error(`ERRO  -${at} ${f.message}${f.evidence ? `\n         evidência: ${f.evidence}` : ""}${f.suggestion ? `\n         sugestão: ${f.suggestion}` : ""}`)
  }
  if (findings.length === 0) console.log("ok - zm-pro íntegro")
  else if (errors.length === 0) console.log(`ok - ${warnings.length} aviso(s), ${suggestions.length} sugestão(ões), sem erro bloqueador`)
}

const blocking =
  failOn === "error" ? errors.length
  : failOn === "warning" ? errors.length + warnings.length
  : findings.length
if (blocking > 0) {
  if (errors.length > 0) console.error(`BLOQUEADO - ${errors.length} erro(s)`)
  process.exit(1)
}
process.exit(0)
