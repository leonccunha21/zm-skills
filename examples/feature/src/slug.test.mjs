import { test } from "node:test"
import assert from "node:assert/strict"
import { slugify } from "./slug.mjs"

test("remove acentos e mantém palavras", () => {
  assert.equal(slugify("Ação de Cobrança"), "acao-de-cobranca")
})

test("normaliza espaços e pontuação", () => {
  assert.equal(slugify("  Olá,   mundo!  "), "ola-mundo")
})

test("não produz hífen nas pontas", () => {
  assert.equal(slugify("--já---pronto--"), "ja-pronto")
})

test("limita o tamanho e continua determinístico", () => {
  const long = "a".repeat(100)
  assert.equal(slugify(long).length, 60)
  assert.equal(slugify(long), slugify(long))
})
