// Minimal JSON-file-backed store for the example — the "database" of the demo app.
// Atomic writes via temp + rename; no concurrency guarantees beyond that.
// NOT production-grade: it exists so the example runs with zero dependencies.
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { randomUUID } from "node:crypto"

export const createStore = (file) => {
  const load = () => {
    if (!existsSync(file)) return []
    const raw = readFileSync(file, "utf8").trim()
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  }
  const save = (items) => {
    mkdirSync(dirname(file), { recursive: true })
    const tmp = `${file}.tmp-${randomUUID()}`
    writeFileSync(tmp, JSON.stringify(items, null, 2))
    renameSync(tmp, file)
  }
  return {
    list: () => load(),
    get: (id) => load().find((item) => item.id === id) ?? null,
    create: ({ title, done = false }) => {
      const items = load()
      const item = { id: randomUUID(), title, done, createdAt: new Date().toISOString() }
      save([item, ...items])
      return item
    },
    update: (id, patch) => {
      const items = load()
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) return null
      items[index] = { ...items[index], ...patch }
      save(items)
      return items[index]
    },
    remove: (id) => {
      const items = load()
      const next = items.filter((item) => item.id !== id)
      if (next.length === items.length) return false
      save(next)
      return true
    },
  }
}
