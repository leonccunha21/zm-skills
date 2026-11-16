# Example — a security review, end to end

> A deliberately tiny audit of one module. The shape matters more than the module: **scope → finding with evidence → severity → fix → verification**. No real vulnerabilities, no secrets — everything here is synthetic.

## Scope

`src/query.mjs` after a review that flagged the original version of the same function:

```js
// BEFORE (the version under review — never shipped)
const text = `SELECT id, name FROM users WHERE id = '${userId}' ORDER BY ${sort}`
return db.query(text)
```

## Findings

| # | Severity | Finding | Evidence | Impact | Recommendation |
|---|---|---|---|---|---|
| 1 | **High** | SQL injection via `userId` interpolated into the query text | `WHERE id = '${userId}'` | full read/write of the table with one crafted string | parameterize values (`$1`) and allowlist identifiers |
| 2 | Medium | Unallowlisted `ORDER BY` identifier | `ORDER BY ${sort}` | same class of injection; breaks caching rules | allowlist expected columns |
| 3 | Low | Error message would echo raw SQL | observed in logs of similar modules | discloses schema to attackers | generic error text to clients, detail only in server logs |

## Fix applied (and tested)

```js
export const buildUserQuery = ({ userId, sort }) => {
  const safeSort = ALLOWED_SORT.has(sort) ? sort : "created_at"
  return { text: `SELECT id, name FROM users WHERE id = $1 ORDER BY ${safeSort}`, values: [userId] }
}
```

The sort column is still interpolated — that is intentional: parameters exist for **values**, while identifiers cannot be bound. The allowlist is the control.

## Verification

```bash
node --test examples/security-review/src/query.test.mjs
```

Real output:

```text
✔ valores nunca entram no SQL como texto
✔ coluna inválida cai no padrão seguro
ℹ tests 2
ℹ pass 2
ℹ fail 0
```

## Delivery record

- Files changed (in a real PR): `src/query.mjs`, regression test, ticket with link to this finding.
- What the reviewer must keep: the parameterization and the allowlist — removing either reintroduces #1/#2.
- Not tested here: database-level authorization, connection pooling, audit logging — separate scopes.
- Never include: production rows, real credentials, exploit payloads validated against live systems — synthetic data only.

Run it with `npm run test:examples`.
