// Legacy pricing — refactored, behavior unchanged (pinned by pricing.test.mjs).
// The rules were inline and unnamed; the order still matters because discounts
// compound, so it is preserved exactly.
const VIP_DISCOUNT = 0.9
const BULK_DISCOUNT = 0.95
const HIGH_TOTAL_DISCOUNT = 0.98

const BULK_MIN_QTY = 10
const HIGH_TOTAL_CENTS = 100_000

const applyDiscount = (value, discount) => value * discount

export function priceFor(qty, unitCents, customerType) {
  let total = qty * unitCents

  if (customerType === "vip") total = applyDiscount(total, VIP_DISCOUNT)
  if (qty >= BULK_MIN_QTY) total = applyDiscount(total, BULK_DISCOUNT)
  if (total > HIGH_TOTAL_CENTS) total = applyDiscount(total, HIGH_TOTAL_DISCOUNT)

  return Math.round(total)
}
