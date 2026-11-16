# Example — legacy code, test first, refactor safely

A module nobody documented: discounts decided inline, in an order that matters. The safe route is **characterization first**: pin observed behavior, refactor, prove nothing moved.

## 1. Characterize before touching anything

`src/pricing.test.mjs` asserts what the code *does*, quirks included: VIP and bulk discounts compound, rounding is to the nearest cent, totals above R$ 1.000,00 get an extra 2%.

```bash
node --test examples/legacy/src/pricing.test.mjs
```

Real output against the original implementation:

```text
✔ preço simples arredonda para o centavo (1.7716ms)
✔ cliente vip recebe 10% (0.3644ms)
✔ quantidade a partir de 10 recebe 5% (0.2493ms)
✔ descontos acumulam (vip + volume) (0.2361ms)
✔ total acima de R$ 1.000,00 recebe 2% extra (0.3738ms)
✔ arredondamento é para o inteiro mais próximo (0.2367ms)
✔ quantidade zero custa zero (0.2149ms)
ℹ tests 7
ℹ pass 7
ℹ fail 0
```

## 2. Refactor without changing behavior

The inline rules became named constants and one helper; the order is preserved, because compounding discounts are order-dependent.

```diff
-if (customerType === "vip") total = total * 0.9
-if (qty >= 10) total = total * 0.95
-if (total > 100000) total = total * 0.98
-return Math.round(total)
+if (customerType === "vip") total = applyDiscount(total, VIP_DISCOUNT)
+if (qty >= BULK_MIN_QTY) total = applyDiscount(total, BULK_DISCOUNT)
+if (total > HIGH_TOTAL_CENTS) total = applyDiscount(total, HIGH_TOTAL_DISCOUNT)
+return Math.round(total)
```

Same seven tests, same output — green again:

```text
ℹ tests 7
ℹ pass 7
ℹ fail 0
```

## 3. Prove the net actually catches a change

A one-line "cleanup" from `Math.round` to `Math.floor` was applied on purpose and the suite was re-run:

```text
✔ preço simples arredonda para o centavo (1.6135ms)
✔ cliente vip recebe 10% (0.4235ms)
✔ quantidade a partir de 10 recebe 5% (0.382ms)
✔ descontos acumulam (vip + volume) (0.3119ms)
✔ total acima de R$ 1.000,00 recebe 2% extra (0.3335ms)
✖ arredondamento é para o inteiro mais próximo (2.1499ms)
✔ quantidade zero custa zero (1.1134ms)
ℹ pass 6
ℹ fail 1
```

The change was reverted; a characterization test that never fails is decoration.

## Delivery record

- Files changed: `src/pricing.mjs` (refactor), `src/pricing.test.mjs` (new safety net).
- Commands: `node --test examples/legacy/src/pricing.test.mjs` — before, after and with the deliberate break.
- Risks: behavior is pinned for the tested paths only; untested paths remain unknown.
- Not tested: concurrency, currency rounding policy, tax — out of scope.
- Open item: replace the ad-hoc discounts with a pricing policy when the product defines one.

Run it with `npm run test:examples`.
