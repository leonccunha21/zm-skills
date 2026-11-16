// Tiny task API over node:http + the JSON store. The "web app with a database"
// of the examples folder — runnable, dependency-free, deliberately small.
import { createServer } from "node:http"
import { createStore } from "./store.mjs"

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on("data", (chunk) => {
      size += chunk.length
      if (size > 16 * 1024) {
        reject(new Error("payload too large"))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on("end", () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {})
      } catch {
        reject(new Error("invalid JSON"))
      }
    })
    req.on("error", reject)
  })

const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" })
  res.end(JSON.stringify(body))
}

const validateTitle = (title) =>
  typeof title === "string" && title.trim().length >= 1 && title.trim().length <= 120

export const createApp = (store) =>
  createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost")
    const path = url.pathname
    const idMatch = path.match(/^\/tasks\/([A-Za-z0-9-]+)$/)

    try {
      if (req.method === "GET" && path === "/tasks") {
        return json(res, 200, store.list())
      }
      if (req.method === "POST" && path === "/tasks") {
        const body = await readBody(req)
        if (!validateTitle(body.title)) {
          return json(res, 400, { error: "title must be 1–120 characters" })
        }
        return json(res, 201, store.create({ title: body.title.trim(), done: body.done === true }))
      }
      if (req.method === "GET" && idMatch) {
        const item = store.get(idMatch[1])
        return item ? json(res, 200, item) : json(res, 404, { error: "not found" })
      }
      if (req.method === "PATCH" && idMatch) {
        const body = await readBody(req)
        const patch = {}
        if (body.title !== undefined) {
          if (!validateTitle(body.title)) return json(res, 400, { error: "title must be 1–120 characters" })
          patch.title = body.title.trim()
        }
        if (body.done !== undefined) {
          if (typeof body.done !== "boolean") return json(res, 400, { error: "done must be boolean" })
          patch.done = body.done
        }
        if (Object.keys(patch).length === 0) return json(res, 400, { error: "empty patch" })
        const item = store.update(idMatch[1], patch)
        return item ? json(res, 200, item) : json(res, 404, { error: "not found" })
      }
      if (req.method === "DELETE" && idMatch) {
        return store.remove(idMatch[1]) ? json(res, 204, null) : json(res, 404, { error: "not found" })
      }
      return json(res, 404, { error: "route not found" })
    } catch (err) {
      if (err.message === "invalid JSON") return json(res, 400, { error: "invalid JSON" })
      if (err.message === "payload too large") return json(res, 413, { error: "payload too large" })
      return json(res, 500, { error: "internal error" })
    }
  })
