# Example — bug fix with a regression test

A deliberately tiny case that shows the cycle: **reproduce → failing test → smallest fix → green → record**. No framework, no dependencies — `node:test` only.

The bug: `total()` summed item prices and ignored `quantity`, so two units of R$ 10,00 cost R$ 10,00.

## 1. Reproduce with a test (before the fix)

```bash
node --test examples/bugfix/src/total.test.mjs
```

Real output with the original implementation:

```text
✖ soma preço × quantidade (7.8284ms)
✖ arredonda centavos sem erro de ponto flutuante (0.6389ms)
✔ lista vazia é zero (2.446ms)
ℹ tests 3
ℹ pass 1
ℹ fail 2

10 !== 20      # quantity 2 was ignored
0.1 !== 0.3    # floating point without cent rounding
```

## 2. Smallest safe fix

```diff
-export const total = (items) =>
-  items.reduce((sum, { price }) => sum + price, 0)
+export const total = (items) =>
+  Math.round(items.reduce((sum, { price, quantity }) => sum + price * quantity * 100, 0)) / 100
```

The test stays as-is — it is the regression proof, not a description of the fix.

## 3. Verify (after the fix)

```text
✔ soma preço × quantidade (1.6419ms)
✔ arredonda centavos sem erro de ponto flutuante (0.3063ms)
✔ lista vazia é zero (0.2959ms)
ℹ tests 3
ℹ pass 3
ℹ fail 0
```

## 4. Delivery record

- Files changed: `src/total.mjs` (fix), `src/total.test.mjs` (regression test).
- Commands: the same `node --test` before and after — output quoted above.
- Risks: money rounding; covered by the cent test.
- Not tested: currency/locale formatting and tax rules — out of scope for this example.

Run it yourself from the repository root: `npm run test:examples`.
