// Characterization tests: they pin observed behavior, quirks included.
// Do not "fix" an assertion here without a product decision — that is the point.
import { test } from "node:test"
import assert from "node:assert/strict"
import { priceFor } from "./pricing.mjs"

test("preço simples arredonda para o centavo", () => {
  assert.equal(priceFor(3, 1999, "regular"), 5997)
})

test("cliente vip recebe 10%", () => {
  assert.equal(priceFor(2, 1000, "vip"), 1800)
})

test("quantidade a partir de 10 recebe 5%", () => {
  assert.equal(priceFor(10, 1000, "regular"), 9500)
})

test("descontos acumulam (vip + volume)", () => {
  assert.equal(priceFor(10, 1000, "vip"), 8550)
})

test("total acima de R$ 1.000,00 recebe 2% extra", () => {
  assert.equal(priceFor(200, 1000, "regular"), 186200)
})

test("arredondamento é para o inteiro mais próximo", () => {
  assert.equal(priceFor(1, 1005, "regular"), 1005)
  assert.equal(priceFor(1, 1004, "vip"), 904)
})

test("quantidade zero custa zero", () => {
  assert.equal(priceFor(0, 1999, "vip"), 0)
})
