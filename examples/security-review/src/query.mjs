// EXAMPLE — review target, not production code.
// The rule: parameters are mandatory for values; identifiers are allowlisted.
const ALLOWED_SORT = new Set(["name", "created_at"])

export const buildUserQuery = ({ userId, sort }) => {
  const safeSort = ALLOWED_SORT.has(sort) ? sort : "created_at"
  // Parameterized: no user input reaches the SQL text.
  return {
    text: `SELECT id, name FROM users WHERE id = $1 ORDER BY ${safeSort}`,
    values: [userId],
  }
}
