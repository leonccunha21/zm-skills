import { test } from "node:test"
import assert from "node:assert/strict"
import { buildUserQuery } from "./query.mjs"

test("valores nunca entram no SQL como texto", () => {
  const { text, values } = buildUserQuery({ userId: "1'; drop table users; --", sort: "created_at" })
  assert.ok(!text.includes("'"), "o texto SQL não deve conter o valor interpolado")
  assert.deepEqual(values, ["1'; drop table users; --"])
})

test("coluna inválida cai no padrão seguro", () => {
  const { text } = buildUserQuery({ userId: "42", sort: "id; DROP TABLE users" })
  assert.match(text, /ORDER BY created_at$/)
})
