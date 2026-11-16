#!/usr/bin/env node
// Zero-dependency installer for the zm-pro skill.
// Copies this repository's `zm-pro/` skill into a harness skills directory.
//
// Usage:
//   node scripts/install.mjs <harness> [--global] [--force] [--dry-run] [--dir <path>]
//   npm run install-skill -- <harness> [flags]     (npm needs the `--` separator)
//
//   --dir <path> is the project root, not the final destination:
//   the skill lands in <path>/.agents/skills/zm-pro (opencode) or
//   <path>/.claude/skills/zm-pro (claude). Default: the current directory.
//   --dry-run prints the upgrade plan (existing → incoming, files that change) and writes nothing.
//   --force updates an existing install; the previous folder is kept as `zm-pro.backup-<timestamp>`.
//
// Harnesses:
//   opencode  → project: <cwd>/.agents/skills/zm-pro  ·  global: $XDG_CONFIG_HOME/opencode/skills/zm-pro
//   claude    → project: <cwd>/.claude/skills/zm-pro  ·  global: ~/.claude/skills/zm-pro
//   codex | cursor | gemini  → no copy; prints the manual route (paths are not standardized)
//
// Exit codes: 0 = installed or instructions printed · 1 = error (with message on stderr)
import { existsSync, mkdirSync, cpSync, rmSync, readFileSync, readdirSync, renameSync } from "node:fs"
import { join, resolve, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { homedir } from "node:os"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const src = join(repoRoot, "zm-pro")
const srcSkill = join(src, "SKILL.md")

const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const option = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}
const valueFlags = new Set(["--dir"])
const positionals = []
for (let i = 0; i < args.length; i += 1) {
  if (valueFlags.has(args[i])) { i += 1; continue }
  if (args[i].startsWith("--")) continue
  positionals.push(args[i])
}
const harness = positionals[0]?.toLowerCase()

const fail = (msg) => {
  console.error(`install.mjs: ${msg}`)
  process.exit(1)
}

if (!harness) {
  fail("harness required. Usage: node scripts/install.mjs <opencode|claude|codex|cursor|gemini> (via npm: npm run install-skill -- opencode)")
}
if (!["opencode", "claude", "codex", "cursor", "gemini"].includes(harness)) {
  fail(`unknown harness "${harness}". Expected: opencode | claude | codex | cursor | gemini`)
}

if (!existsSync(srcSkill)) fail(`source not found: ${srcSkill} — run from the repository checkout`)
const head = readFileSync(srcSkill, "utf8").slice(0, 400)
if (!/^name:\s*zm-pro\s*$/m.test(head)) fail("SKILL.md frontmatter mismatch — is this really the zm-pro checkout?")

if (harness === "codex" || harness === "cursor" || harness === "gemini") {
  console.log(`No automatic copy for ${harness} — the path conventions differ per harness.`)
  console.log("Manual route:")
  if (harness === "codex") console.log("  - Point your Codex instructions/context at zm-pro/SKILL.md (AGENTS.md reference is fine).")
  if (harness === "cursor") console.log("  - Cursor Project Rules: copy zm-pro/SKILL.md as the rule, or point '@zm-pro/SKILL.md' in chat.")
  if (harness === "gemini") console.log("  - Gemini CLI: reference zm-pro/SKILL.md from your context file (.gemini/gemini.md or equivalent).")
  console.log("What to expect: the router tells the agent when to load each reference — nothing else loads until then.")
  console.log("Compatibility evidence: docs/harness-compatibility.md")
  process.exit(0)
}

const dirOption = option("--dir")
const projectRoot = dirOption ? resolve(dirOption) : process.cwd()
const globalDir = harness === "opencode"
  ? join(process.env.XDG_CONFIG_HOME || join(homedir(), ".config"), "opencode", "skills")
  : join(homedir(), ".claude", "skills")
const baseDir = flag("--global") ? globalDir
  : join(projectRoot, harness === "opencode" ? join(".agents", "skills") : join(".claude", "skills"))
const dest = join(baseDir, "zm-pro")

const readVersion = (file) => {
  try {
    return readFileSync(file, "utf8").match(/zm-pro v(\d+\.\d+\.\d+)/)?.[1]
  } catch {
    return undefined
  }
}
const incomingVersion = readVersion(srcSkill)
const previousVersion = readVersion(join(dest, "SKILL.md"))
const compareVersions = (a, b) => {
  const pa = a.split(".").map(Number)
  const pb = b.split(".").map(Number)
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1
  }
  return 0
}

const filesUnder = (dir, base = dir, acc = []) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) filesUnder(p, base, acc)
    else acc.push(relative(base, p).replaceAll("\\", "/"))
  }
  return acc
}
const plan = (from, to) => {
  const source = filesUnder(from).sort()
  const existing = new Set(filesUnder(to))
  const sourceSet = new Set(source)
  let unchanged = 0
  const changed = []
  const added = []
  for (const file of source) {
    if (!existing.has(file)) added.push(file)
    else if (readFileSync(join(from, file)).equals(readFileSync(join(to, file)))) unchanged += 1
    else changed.push(file)
  }
  const localOnly = [...existing].filter((f) => !sourceSet.has(f)).sort()
  return { unchanged, changed, added, localOnly }
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-")
let backup

if (existsSync(dest)) {
  const diff = plan(src, dest)
  console.log(`Existing install: v${previousVersion ?? "desconhecida"} → incoming v${incomingVersion ?? "desconhecida"}`)
  console.log(`Plan for ${dest}: ${diff.unchanged} unchanged, ${diff.changed.length} changed, ${diff.added.length} new, ${diff.localOnly.length} local-only`)
  if (diff.localOnly.length > 0) {
    const shown = diff.localOnly.slice(0, 5).join(", ")
    console.log(`  local-only files stay in the backup: ${shown}${diff.localOnly.length > 5 ? ", …" : ""}`)
  }
  if (previousVersion && incomingVersion && compareVersions(incomingVersion, previousVersion) < 0) {
    console.warn(`warning: downgrade — ${incomingVersion} is older than ${previousVersion}; the backup is the safe way back`)
  }
  if (flag("--dry-run")) {
    console.log("Dry run — nothing written.")
    process.exit(0)
  }
  if (!flag("--force")) {
    fail(`already exists: ${dest}\n  re-run with --force to update (the previous folder is kept as a backup), or remove it manually first`)
  }
  backup = `${dest}.backup-${stamp}`
  renameSync(dest, backup)
  console.log(`Previous install kept at: ${backup}`)
} else if (flag("--dry-run")) {
  console.log(`Dry run — would install v${incomingVersion ?? "desconhecida"} → ${dest}`)
  process.exit(0)
}

mkdirSync(baseDir, { recursive: true })
const tmp = `${dest}.tmp-${stamp}`
try {
  cpSync(src, tmp, { recursive: true })
  renameSync(tmp, dest)
} catch (err) {
  rmSync(tmp, { recursive: true, force: true })
  fail(`install failed: ${err.message}${backup ? `\n  previous install kept at: ${backup}` : ""}`)
}

console.log(`Installed zm-pro v${incomingVersion ?? "?"} → ${dest} (${flag("--global") ? "global" : "project"})`)
if (backup) console.log(`Rollback: delete ${dest} and rename ${backup} back to zm-pro.`)
console.log("Verify: the harness auto-discovers it; in a session, ask: \"use the zm-pro skill\".")
console.log("Change your mind: delete the folder (git/zip copy — nothing else is installed).")
