# Example — a small web app with a database

> The complete small application this repository was missing: an HTTP API with validation, a JSON-file-backed store as the "database", and end-to-end tests. Node ≥ 18, zero dependencies.

## What it is

A to-do API for one user:

```
GET    /tasks            → list tasks (newest first)
POST   /tasks            { title, done? } → 201 created
GET    /tasks/:id        → task or 404
PATCH  /tasks/:id        { title?, done? } → 200 or 404
DELETE /tasks/:id        → 204 or 404
```

The store is a **JSON file** (`tasks.json`) written atomically (temp + rename). It is a stand-in for a real database so the example runs anywhere without setup. It has **no concurrency guarantees** — that is the honest limitation, not an oversight.

## Prerequisites

- Node ≥ 18 (uses global `fetch` in the tests)
- No install: `node` only

## Run the app

```bash
node -e "import('./src/server.mjs').then(({createApp}) => import('./src/store.mjs').then(({createStore}) => createApp(createStore('data/tasks.json')).listen(3000)))"
```

then `curl -X POST localhost:3000/tasks -H 'content-type: application/json' -d '{"title":"approve"}'`

## Run the tests

```bash
node --test examples/task-api/src/server.test.mjs
```

Real output:

```text
✔ fluxo completo: criar, listar, atualizar, remover (127.3856ms)
✔ rejeita título inválido e JSON quebrado (46.0701ms)
✔ patch vazio e done não booleano são rejeitados (23.3591ms)
ℹ tests 3
ℹ pass 3
ℹ fail 0
```

`npm run test:examples` runs this too (19 example tests in total).

## What this example teaches

- **Validation at the boundary:** title 1–120 chars, `done` strictly boolean, empty patch rejected, payload ≤ 16 KB, JSON parse errors → 400.
- **Error discipline:** 400 / 404 / 413 / 500 with `{ "error": … }`; internal messages never leak to clients.
- **Atomic writes:** temp file + rename — a reader never sees a half-written file.
- **Synthetic data only;** the test suite uses a fresh temp directory per run.

## What it is not

- Not production architecture: no auth, no per-user isolation, no pagination, no migrations, no backups, no pooling.
- Not a framework choice: `node:http` keeps the example readable. Real apps use their project's framework.
- Not a concurrency answer: two writers racing lose updates. A real database exists for a reason.
