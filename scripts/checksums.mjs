#!/usr/bin/env node
// Zero-dependency checksum tool for the release-integrity flow.
// Walks the `zm-pro/` skill directory, hashes every file (SHA-256) and prints
// CHECKSUMS-compatible lines to stdout. Attach the output to GitHub releases.
//
// Usage:
//   node scripts/checksums.mjs                          # print the manifest
//   node scripts/checksums.mjs --verify <manifest>      # verify a manifest against disk
//   npm run --silent checksums > CHECKSUMS-$(node -p "require('./package.json').version").txt
//   (npm prints its banner on stdout; `--silent` keeps the manifest clean)
//
// Output format: "<sha256>  <relative/path>" (sorted by path, LF endings)
// --verify exits 0 only when every listed file matches, nothing listed is missing,
// and no extra file exists under zm-pro/. Paths outside the repository are rejected.
import { createHash } from "node:crypto"
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, relative, isAbsolute, resolve, sep } from "node:path"
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

const hash = (file) => createHash("sha256").update(readFileSync(file)).digest("hex")
const toRel = (p) => relative(repoRoot, p).replaceAll("\\", "/")

const manifest = () =>
  walk(skillDir)
    .map((p) => ({ rel: toRel(p), sha: hash(p) }))
    .sort((a, b) => a.rel.localeCompare(b.rel))

const verifyArg = process.argv.indexOf("--verify")
if (verifyArg === -1) {
  process.stdout.write(manifest().map(({ sha, rel }) => `${sha}  ${rel}`).join("\n") + "\n")
  process.exit(0)
}

const manifestPath = process.argv[verifyArg + 1]
if (!manifestPath) {
  console.error("checksums.mjs: --verify needs a manifest path (e.g. --verify CHECKSUMS-v0.8.1.txt)")
  process.exit(1)
}
if (!existsSync(manifestPath)) {
  console.error(`checksums.mjs: manifest not found: ${manifestPath}`)
  process.exit(1)
}

const errors = []
const listed = new Set()
for (const [index, rawLine] of readFileSync(manifestPath, "utf8").split(/\r?\n/).entries()) {
  const line = rawLine.trim()
  if (!line) continue
  const parsed = line.match(/^([a-f0-9]{64}) {2}(.+)$/)
  if (!parsed) {
    errors.push(`line ${index + 1}: invalid manifest entry → ${line}`)
    continue
  }
  const [, expected, relPath] = parsed
  const target = resolve(repoRoot, relPath)
  const outside = isAbsolute(relPath) || relative(repoRoot, target).startsWith("..") || relative(repoRoot, target).includes(`..${sep}`)
  if (outside) {
    errors.push(`line ${index + 1}: path outside the repository rejected → ${relPath}`)
    continue
  }
  listed.add(toRel(target))
  if (!existsSync(target)) {
    errors.push(`missing file → ${relPath}`)
    continue
  }
  const actual = hash(target)
  if (actual !== expected) errors.push(`checksum mismatch → ${relPath}\n  expected ${expected}\n  actual   ${actual}`)
}

for (const { rel } of manifest()) {
  if (!listed.has(rel)) errors.push(`file not covered by the manifest → ${rel}`)
}

if (errors.length === 0) {
  console.log(`checksums.mjs: ${listed.size} arquivos verificados`)
  console.log("ok - manifesto íntegro")
  process.exit(0)
}
for (const error of errors) console.error(`ERRO  - ${error}`)
console.error(`BLOQUEADO - ${errors.length} problema(s)`)
process.exit(1)
