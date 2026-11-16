#!/usr/bin/env node
// Read-only diagnostic for a consumer project. Reports what zm-pro would care
// about before any work starts: rules, commands, tests, CI, secrets hygiene.
//
// Usage:
//   node scripts/diagnose.mjs [path] [--json]
//
// It never writes, never installs and never runs project scripts. Exit code is
// 0 unless the path is invalid: findings are information, not a gate.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { basename, join, resolve } from "node:path"

const args = process.argv.slice(2)
const json = args.includes("--json")
const targetArg = args.find((a) => !a.startsWith("--"))
const root = resolve(targetArg ?? process.cwd())

if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`diagnose.mjs: not a directory: ${root}`)
  process.exit(1)
}

const findings = []
const add = (severity, area, message, next) => findings.push({ severity, area, message, next })
const has = (name) => existsSync(join(root, name))
const read = (name) => {
  try {
    return readFileSync(join(root, name), "utf8")
  } catch {
    return ""
  }
}

// --- Project rules and protocol ---------------------------------------------
for (const [file, area] of [["AGENTS.md", "protocol"], ["RULES.md", "rules"]]) {
  if (!has(file)) {
    add("warning", area, `${file} ausente`, "crie a partir de zm-pro/templates antes de delegar tarefas")
  }
}
if (!has("README.md")) add("warning", "docs", "README.md ausente", "documente propósito, comandos e como rodar")

// --- Commands ---------------------------------------------------------------
const packageJson = has("package.json") ? (() => {
  try {
    return JSON.parse(read("package.json"))
  } catch {
    add("error", "commands", "package.json inválido", "corrija o JSON antes de qualquer automação")
    return {}
  }
})() : null

if (packageJson) {
  const scripts = packageJson.scripts ?? {}
  for (const [name, why] of [
    ["test", "sem script de teste, a evidência vira opinião"],
    ["lint", "sem lint, o estilo depende de revisão manual"],
    ["build", "sem build, o artefato não é verificado"],
  ]) {
    if (!scripts[name]) add("suggestion", "commands", `script npm "${name}" ausente`, why)
  }
  if (packageJson.private !== true) {
    add("suggestion", "distribution", "package.json sem private: true", "confirme se a publicação é intencional")
  }
  const deps = { ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) }
  const locks = ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb", "bun.lock"]
  if (Object.keys(deps).length > 0 && !locks.some(has)) {
    add("warning", "commands", "nenhum lockfile encontrado", "versões não reprodutíveis: comite o lockfile do seu gerenciador")
  }
} else if (!has("pyproject.toml") && !has("go.mod") && !has("Cargo.toml") && !has("composer.json") && !has("pom.xml") && !has("build.gradle")) {
  add("warning", "commands", "nenhum manifesto de projeto reconhecido", "documente o toolchain e os comandos no README")
}

// --- Tests ------------------------------------------------------------------
const walk = (dir, acc = [], depth = 0) => {
  if (depth > 4) return acc
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", "dist", "build", "vendor", ".venv"].includes(entry.name)) continue
    const p = join(dir, entry.name)
    if (entry.isDirectory()) walk(p, acc, depth + 1)
    else acc.push(entry.name)
  }
  return acc
}
let testFiles = 0
try {
  testFiles = walk(root).filter((name) =>
    /\.(test|spec)\.[cm]?[jt]sx?$|_test\.(go|py)$|^test_.*\.py$|Tests?\.(cs|java|kt)$/.test(name),
  ).length
} catch {
  add("warning", "tests", "não foi possível listar os arquivos do projeto", "verifique permissões")
}
if (testFiles === 0) add("warning", "tests", "nenhum arquivo de teste encontrado", "comece pelo caminho crítico, não por cobertura")

// --- CI and supply chain ----------------------------------------------------
const ciFiles = [
  ".github/workflows", ".gitlab-ci.yml", ".circleci/config.yml", "azure-pipelines.yml", "Jenkinsfile",
]
if (!ciFiles.some(has)) add("warning", "ci", "nenhuma configuração de CI encontrada", "automatize o gate mínimo: teste + build")

// --- Secrets / personal data -------------------------------------------------
const envFiles = [".env", ".env.local", ".env.production"]
const presentEnv = envFiles.filter(has)
const ignoreLines = read(".gitignore").split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("#"))
const ignored = (file) => ignoreLines.some((line) => line === file || line === `${file}*` || line === ".env*" || line === "*.env" || line.startsWith(`${file}/`))
const trackedEnv = presentEnv.filter((file) => !ignored(file))
if (trackedEnv.length > 0) {
  add("error", "secrets", `arquivo de ambiente sem regra no .gitignore: ${trackedEnv.join(", ")}`, "adicione ao .gitignore e confirme que não está versionado")
}
if (has("SECURITY.md")) {
  // Nothing to report: a security policy is present.
} else {
  add("suggestion", "security", "SECURITY.md ausente", "defina como reportar vulnerabilidades")
}

// --- Planned work -----------------------------------------------------------
const messages = [
  "Diagnóstico somente leitura — nada foi alterado.",
  `Projeto: ${basename(root)} (${root})`,
  `Achados: ${findings.length}`,
]
if (json) {
  const order = { error: 0, warning: 1, suggestion: 2 }
  findings.sort((a, b) => order[a.severity] - order[b.severity] || a.area.localeCompare(b.area))
  console.log(JSON.stringify({ schemaVersion: 1, project: basename(root), readOnly: true, findings }, null, 2))
} else {
  for (const f of findings) console.log(`${f.severity.toUpperCase().padEnd(10)} ${f.area.padEnd(12)} ${f.message}\n           → ${f.next}`)
  console.log("")
  for (const m of messages) console.log(m)
  if (findings.length === 0) console.log("Nada a apontar: regras, comandos, testes e CI presentes. Revise o conteúdo manualmente.")
}
