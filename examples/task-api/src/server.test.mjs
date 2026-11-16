import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createStore } from "./store.mjs"
import { createApp } from "./server.mjs"

const withServer = async (t, run) => {
  const dir = mkdtempSync(join(tmpdir(), "zm-task-api-"))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  const store = createStore(join(dir, "tasks.json"))
  const app = createApp(store)
  await new Promise((resolve) => app.listen(0, "127.0.0.1", resolve))
  t.after(() => app.close())
  const base = `http://127.0.0.1:${app.address().port}`
  const api = {
    base,
    get: (path) => fetch(`${base}${path}`),
    post: (path, body) => fetch(`${base}${path}`, { method: "POST", body: JSON.stringify(body) }),
    rawPost: (path, body) => fetch(`${base}${path}`, { method: "POST", body }),
    patch: (path, body) => fetch(`${base}${path}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (path) => fetch(`${base}${path}`, { method: "DELETE" }),
  }
  await run(api)
}

test("fluxo completo: criar, listar, atualizar, remover", async (t) => {
  await withServer(t, async (api) => {
    const created = await api.post("/tasks", { title: "pagar boleto" })
    assert.equal(created.status, 201)
    const task = await created.json()

    const list = await (await api.get("/tasks")).json()
    assert.equal(list.length, 1)

    const patched = await api.patch(`/tasks/${task.id}`, { done: true })
    assert.equal(patched.status, 200)
    assert.equal((await patched.json()).done, true)

    const deleted = await api.delete(`/tasks/${task.id}`)
    assert.equal(deleted.status, 204)
    assert.equal((await api.get(`/tasks/${task.id}`)).status, 404)
  })
})

test("rejeita título inválido e JSON quebrado", async (t) => {
  await withServer(t, async (api) => {
    assert.equal((await api.post("/tasks", { title: "   " })).status, 400)
    assert.equal((await api.post("/tasks", { title: "a".repeat(121) })).status, 400)
    assert.equal((await api.rawPost("/tasks", "not json")).status, 400)
  })
})

test("patch vazio e done não booleano são rejeitados", async (t) => {
  await withServer(t, async (api) => {
    const created = await (await api.post("/tasks", { title: "ok" })).json()
    assert.equal((await api.patch(`/tasks/${created.id}`, {})).status, 400)
    assert.equal((await api.patch(`/tasks/${created.id}`, { done: "yes" })).status, 400)
  })
})
