#!/usr/bin/env node
// EN ↔ pt-BR parity check — structural, not translation-proof.
// English is canonical; this catches drift, not wording.
//
// Pairs checked:
//   README.md ↔ README.pt-BR.md
//   docs/for-humans.md ↔ docs/para-leigos.md
//
// Compares: heading level sequence, fence count, command-like code tokens,
// and link destinations (with a small allowlist of intentional differences).
// Usage:
//   node scripts/parity-check.mjs [--json]
import { existsSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { join } from "node:path"

const root = fileURLToPath(new URL("..", import.meta.url))

const headingLevels = (text) =>
  [...text.matchAll(/^(#{1,6})\s+/gm)].map((m) => m[1].length)
const fenceCount = (text) => (text.match(/^```/gm) ?? []).length
const codeTokens = (text) => [...text.matchAll(/`([^`\n]+)`/g)].map((m) => m[1])
const commandTokens = (text) =>
  [...new Set(codeTokens(text).filter((c) => /^(npm|npx|node|git)\s/.test(c)))].sort()
const hrefs = (text) => [...new Set([...text.matchAll(/\]\(([^)#\s]+)(#[^)]*)?[\s)]/g)].map((m) => m[1]))].sort()

// Intentional differences (never flagged)
const badgeOk = /^https:\/\/img\.shields\.io\// // badges may carry a localized label= on each README
const langPairOk = (a, b) => (a === "README.md" && b === "README.pt-BR.md") || (a === "README.pt-BR.md" && b === "README.md")
const guidePairOk = (a, b) => new Set([a, b]).size === 2 && ["docs/for-humans.md", "docs/para-leigos.md"].every((x) => [a, b].includes(x))

function checkPair(pathEn, pathPt, label) {
  const diffs = []
  if (!existsSync(join(root, pathEn))) {
    diffs.push(`${label}: EN file not found: ${pathEn}`)
    return diffs
  }
  if (!existsSync(join(root, pathPt))) {
    diffs.push(`${label}: PT file not found: ${pathPt}`)
    return diffs
  }
  const en = readFileSync(join(root, pathEn), "utf8")
  const pt = readFileSync(join(root, pathPt), "utf8")

  const levelsEn = headingLevels(en)
  const levelsPt = headingLevels(pt)
  if (levelsEn.join(",") !== levelsPt.join(",")) {
    diffs.push(`${label}: heading structure differs (EN: [${levelsEn}] vs PT: [${levelsPt}])`)
  }

  if (fenceCount(en) !== fenceCount(pt)) {
    diffs.push(`${label}: code fence count differs (EN: ${fenceCount(en)} vs PT: ${fenceCount(pt)})`)
  }

  const cmdsEn = commandTokens(en)
  const cmdsPt = commandTokens(pt)
  for (const c of cmdsEn.filter((x) => !cmdsPt.includes(x))) diffs.push(`${label}: command in EN, missing in PT: ${c}`)
  for (const c of cmdsPt.filter((x) => !cmdsEn.includes(x))) diffs.push(`${label}: command in PT, missing in EN: ${c}`)

  const hrefsEn = hrefs(en)
  const hrefsPt = hrefs(pt)
  for (const h of hrefsEn.filter((x) => !hrefsPt.includes(x))) {
    if (badgeOk.test(h)) continue
    if (hrefsPt.some((p) => langPairOk(h, p))) continue
    if (hrefsPt.some((p) => guidePairOk(h, p))) continue
    diffs.push(`${label}: link destination in EN, missing in PT: ${h}`)
  }
  for (const h of hrefsPt.filter((x) => !hrefsEn.includes(x))) {
    if (badgeOk.test(h)) continue
    if (hrefsEn.some((p) => langPairOk(p, h))) continue
    if (hrefsEn.some((p) => guidePairOk(p, h))) continue
    diffs.push(`${label}: link destination in PT, missing in EN: ${h}`)
  }
  return diffs
}

const readmeDiffs = checkPair("README.md", "README.pt-BR.md", "README")
const guidesDiffs = checkPair("docs/for-humans.md", "docs/para-leigos.md", "docs/guides")
const differences = [...readmeDiffs, ...guidesDiffs]

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({
    schemaVersion: 1,
    ok: differences.length === 0,
    pairs: [
      { en: "README.md", pt: "README.pt-BR.md", ok: readmeDiffs.length === 0, differences: readmeDiffs },
      { en: "docs/for-humans.md", pt: "docs/para-leigos.md", ok: guidesDiffs.length === 0, differences: guidesDiffs },
    ],
    differences,
  }, null, 2))
} else if (differences.length === 0) {
  console.log("parity-check — all pairs equivalent: READMEs equivalent (structure, commands, links)")
  console.log("  README.md ↔ README.pt-BR.md ✓")
  console.log("  docs/for-humans.md ↔ docs/para-leigos.md ✓")
} else {
  for (const d of differences) console.error(`ERRO  - ${d}`)
  console.error(`BLOQUEADO - ${differences.length} diferença(s)`)
}
process.exit(differences.length === 0 ? 0 : 1)
