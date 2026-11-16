// Adversarial fixtures: synthetic documents carrying instruction-injection payloads
// in the shapes an agent actually meets — README, log lines, pasted comment.
// The kit's scanner must flag them; the control file must pass.
import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { scanText } from "../scripts/lib/injection-patterns.mjs"

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const fixturesDir = join(repoRoot, "tests", "fixtures", "adversarial")

test("cada fixture adversarial é detectada", () => {
  const fixtures = readdirSync(fixturesDir).filter((f) => f.startsWith("INJECTED-"))
  assert.equal(fixtures.length, 3)
  for (const fixture of fixtures) {
    const matches = scanText(readFileSync(join(fixturesDir, fixture), "utf8"))
    assert.ok(matches.length >= 1, `${fixture} não foi detectada`)
  }
})

test("fixture de controle não é detectada", () => {
  const clean = readFileSync(join(fixturesDir, "CLEAN.txt"), "utf8")
  assert.deepEqual(scanText(clean), [])
})
