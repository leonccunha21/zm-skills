// Example implementation after the fix. The bug: the total ignored quantity.
export const total = (items) =>
  Math.round(items.reduce((sum, { price, quantity }) => sum + price * quantity * 100, 0)) / 100
