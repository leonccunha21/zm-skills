#!/usr/bin/env node
// EN ↔ pt-BR README parity check — structural, not translation-proof.
// English is canonical; this catches drift, not wording.
//
// Compares: heading level sequence, fence count, command-like code tokens,
// and link destinations (with a small allowlist of intentional differences).
// Usage:
//   node scripts/parity-check.mjs [--json]
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { join } from "node:path"

const root = fileURLToPath(new URL("..", import.meta.url))
const en = readFileSync(join(root, "README.md"), "utf8")
const pt = readFileSync(join(root, "README.pt-BR.md"), "utf8")

const headingLevels = (text) =>
  [...text.matchAll(/^(#{1,6})\s+/gm)].map((m) => m[1].length)
const fenceCount = (text) => (text.match(/^```/gm) ?? []).length
const codeTokens = (text) => [...text.matchAll(/`([^`\n]+)`/g)].map((m) => m[1])
const commandTokens = (text) =>
  [...new Set(codeTokens(text).filter((c) => /^(npm|npx|node|git)\s/.test(c)))].sort()
const hrefs = (text) => [...new Set([...text.matchAll(/\]\(([^)#\s]+)(#[^)]*)?\)/g)].map((m) => m[1]))].sort()

// Intentional differences (never flagged)
const badgeOk = /^https:\/\/img\.shields\.io\// // badges may carry a localized label= on each README
const langPairOk = (a, b) => (a === "README.md" && b === "README.pt-BR.md") || (a === "README.pt-BR.md" && b === "README.md")
const guidePairOk = (a, b) => new Set([a, b]).size === 2 && ["docs/for-humans.md", "docs/para-leigos.md"].every((x) => [a, b].includes(x))

const differences = []

const levelsEn = headingLevels(en)
const levelsPt = headingLevels(pt)
if (levelsEn.join(",") !== levelsPt.join(",")) {
  differences.push(`heading structure differs (EN: [${levelsEn}] vs PT: [${levelsPt}])`)
}

if (fenceCount(en) !== fenceCount(pt)) {
  differences.push(`code fence count differs (EN: ${fenceCount(en)} vs PT: ${fenceCount(pt)})`)
}

const cmdsEn = commandTokens(en)
const cmdsPt = commandTokens(pt)
for (const c of cmdsEn.filter((x) => !cmdsPt.includes(x))) differences.push(`command in EN, missing in PT: ${c}`)
for (const c of cmdsPt.filter((x) => !cmdsEn.includes(x))) differences.push(`command in PT, missing in EN: ${c}`)

const hrefsEn = hrefs(en)
const hrefsPt = hrefs(pt)
for (const h of hrefsEn.filter((x) => !hrefsPt.includes(x))) {
  if (badgeOk.test(h)) continue // locale-encoded badge
  if (hrefsPt.some((p) => langPairOk(h, p))) continue
  if (hrefsPt.some((p) => guidePairOk(h, p))) continue
  differences.push(`link destination in EN, missing in PT: ${h}`)
}
for (const h of hrefsPt.filter((x) => !hrefsEn.includes(x))) {
  if (badgeOk.test(h)) continue
  if (hrefsEn.some((p) => langPairOk(p, h))) continue
  if (hrefsEn.some((p) => guidePairOk(p, h))) continue
  differences.push(`link destination in PT, missing in EN: ${h}`)
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ schemaVersion: 1, ok: differences.length === 0, differences }, null, 2))
} else if (differences.length === 0) {
  console.log("parity-check — READMEs equivalent (structure, commands, links)")
} else {
  for (const d of differences) console.error(`ERRO  - ${d}`)
  console.error(`BLOQUEADO - ${differences.length} diferença(s)`)
}
process.exit(differences.length === 0 ? 0 : 1)
