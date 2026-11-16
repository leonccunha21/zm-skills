#!/usr/bin/env node
// Zero-dependency installer for the zm-pro skill.
// Copies this repository's `zm-pro/` skill into a harness skills directory.
//
// Usage:
//   node scripts/install.mjs <harness> [--global] [--force] [--dir <path>]
//
// Harnesses:
//   opencode  → project: <cwd>/.agents/skills/zm-pro  ·  global: $XDG_CONFIG_HOME/opencode/skills/zm-pro
//   claude    → project: <cwd>/.claude/skills/zm-pro  ·  global: ~/.claude/skills/zm-pro
//   codex | cursor | gemini  → no copy; prints the manual route (paths are not standardized)
//
// Exit codes: 0 = installed or instructions printed · 1 = error (with message on stderr)
import { existsSync, mkdirSync, cpSync, rmSync, readFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { homedir } from "node:os"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const src = join(repoRoot, "zm-pro")
const srcSkill = join(src, "SKILL.md")

const args = process.argv.slice(2)
const harness = args.find((a) => !a.startsWith("--"))?.toLowerCase()
const flag = (name) => args.includes(name)
const option = (name) => {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}

const fail = (msg) => {
  console.error(`install.mjs: ${msg}`)
  process.exit(1)
}

if (!harness || !["opencode", "claude", "codex", "cursor", "gemini"].includes(harness)) {
  fail(`unknown harness "${harness ?? ""}". Expected: opencode | claude | codex | cursor | gemini`)
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

if (existsSync(dest)) {
  if (!flag("--force")) {
    fail(`already exists: ${dest}\n  re-run with --force to overwrite, or remove it manually first`)
  }
  rmSync(dest, { recursive: true, force: true })
}

mkdirSync(baseDir, { recursive: true })
cpSync(src, dest, { recursive: true })

console.log(`Installed zm-pro → ${dest} (${flag("--global") ? "global" : "project"})`)
console.log("Verify: the harness auto-discovers it; in a session, ask: \"use the zm-pro skill\".")
console.log("Change your mind: delete the folder (git/zip copy — nothing else is installed).")
