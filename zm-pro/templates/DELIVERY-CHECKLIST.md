# Delivery checklist (per delivery — paste into the PR or the delivery log)

```
DELIVERY: <one line — what this delivery does>
DATE: YYYY-MM-DD   SHA(S): <sha>   SCOPE/FRONT: <files/modules>

OBJECTIVE AND ACCEPTANCE CRITERIA
- <objective>
- <criterion 1> / <criterion 2> / …

FILES CHANGED
- <path> — <what and why>
(one line per file; if the list exploded, the delivery was too big)

COMMANDS EXECUTED AND REAL RESULTS
- <command> → <pass/fail + relevant output or log ref>
- <command> → …

NOT VERIFIED (explicit)
- <what was not tested and why — real hardware, homologation, business decision…>

RISKS AND ROLLBACK
- Risk: <…> → Mitigation: <…>
- Rollback: <previous tag/branch, migration down, feature flag…>

OPEN ITEMS
- <item + owner + what unblocks it>

EVIDENCE
- <command output pasted / recording link / synthetic-data screenshot>

DEFINITION OF DONE: <attach the marked DEFINITION-OF-DONE.md>
```

Filling rules:

1. **No empty fields.** Doesn't apply? Write "n/a — reason".
2. **A listed command without output doesn't count.** Paste the real output.
3. **Claim, then mark; unable to verify, then say.** The checklist is a contract with the reviewer.
4. One delivery = one objective. Two tasks in one checklist = two deliveries.
5. Real customer data never appears in evidence — synthetic fixtures or sanitized screenshots only.
