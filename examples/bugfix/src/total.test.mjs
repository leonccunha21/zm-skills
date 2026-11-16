import { test } from "node:test"
import assert from "node:assert/strict"
import { total } from "./total.mjs"

test("soma preço × quantidade", () => {
  assert.equal(total([{ price: 10, quantity: 2 }]), 20)
})

test("arredonda centavos sem erro de ponto flutuante", () => {
  assert.equal(total([{ price: 0.1, quantity: 3 }]), 0.3)
})

test("lista vazia é zero", () => {
  assert.equal(total([]), 0)
})
