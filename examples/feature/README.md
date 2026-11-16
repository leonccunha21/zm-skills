# Example — a small feature, end to end

A feature request the way it should arrive: one behavior, an acceptance criterion, a test, a changelog line and a delivery record. No framework, no dependencies.

## The request

> Posts need a URL slug. "Ação de Cobrança" must become `acao-de-cobranca`. Keep it deterministic and cap it at 60 characters.

Scope: one new module and its test. Out: routing, persistence, admin UI.

## What the agent did

1. Read `README.md`, `AGENTS.md`, `RULES.md` — no project rules existed, so it stated the reversible assumption: ESM + `node:test`, matching the existing example.
2. Loaded only the code-rules and testing references.
3. Wrote the test first, then the smallest implementation that satisfies it.
4. Ran the suite and quoted the output.
5. Added the changelog entry with the affected behavior, not just a title.

## Result

```bash
node --test examples/feature/src/slug.test.mjs
```

Real output:

```text
✔ remove acentos e mantém palavras (1.2ms)
✔ normaliza espaços e pontuação (0.4ms)
✔ não produz hífen nas pontas (0.3ms)
✔ limita o tamanho e continua determinístico (0.2ms)
ℹ tests 4
ℹ pass 4
ℹ fail 0
```

## Changelog entry

```markdown
## [Unreleased]
### Added
- `slugify(text)` — URL slug for post titles: strips accents, collapses spaces,
  trims hyphens, caps at 60 chars. Covered by 4 unit tests.
```

## Delivery record

- Files changed: `src/slug.mjs` (new), `src/slug.test.mjs` (new), `CHANGELOG.md`.
- Commands: `node --test examples/feature/src/slug.test.mjs` — output above.
- Risks: unicode handling depends on `String.normalize("NFKD")`; covered by the accent test.
- Not tested: collision handling across posts (needs persistence, out of scope).
- Open item: route integration, owned by the next task.

## What makes this a good example

- Acceptance criterion is observable (`acao-de-cobranca`), not "improve slugs".
- The test existed before the implementation and stayed unchanged.
- The changelog says what a user gets, not "changed slug file".
- The gaps are named: collision handling and routing are explicitly out.

Run it with `npm run test:examples` from the repository root.
