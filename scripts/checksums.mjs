#!/usr/bin/env node
// Zero-dependency checksum generator for the release-integrity flow.
// Walks the `zm-pro/` skill directory, hashes every file (SHA-256) and prints
// CHECKSUMS-compatible lines to stdout. Attach the output to GitHub releases.
//
// Usage:
//   npm run checksums > CHECKSUMS-$(node -p "require('./package.json').version").txt
//
// Output format: "<sha256>  <relative/path>" (sorted by path, LF endings)
import { createHash } from "node:crypto"
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const skillDir = join(repoRoot, "zm-pro")
if (!existsSync(skillDir)) {
  console.error("checksums.mjs: zm-pro/ not found — run from the repository checkout")
  process.exit(1)
}

const walk = (dir, acc = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (statSync(p).isFile()) acc.push(p)
  }
  return acc
}

const lines = walk(skillDir)
  .map((p) => ({ rel: relative(repoRoot, p).replaceAll("\\", "/"), sha: createHash("sha256").update(readFileSync(p)).digest("hex") }))
  .sort((a, b) => a.rel.localeCompare(b.rel))
  .map(({ sha, rel }) => `${sha}  ${rel}`)

process.stdout.write(lines.join("\n") + "\n")
