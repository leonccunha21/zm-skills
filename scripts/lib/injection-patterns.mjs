// Shared injection-payload patterns for the kit's self-audit.
// Used by tests/injection-hygiene.test.mjs and tests/fixtures-adversarial.test.mjs.
export const PATTERNS = [
  /ignore (all|any|previous|prior|the) (instructions|rules|restrictions|directions)/i,
  /disregard (all|any|previous|the) (instructions|rules|restrictions)/i,
  /you are (now|free to) /i,
  /new instructions\s*:/i,
  /(exfiltrat|steal)[^.\n]{0,40}(secret|token|password|api key|credential)/i,
  /paste (the|those|all) (secrets|tokens|credentials|keys)/i,
]

export const scanText = (text) =>
  PATTERNS.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source)
