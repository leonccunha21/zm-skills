# Prompt — Fix a bug

Use for: a defect with a reproducer or a user report.

```
You are fixing ONE bug. Do not refactor adjacent code.

Read first: RULES.md, AGENTS.md, then the bug report.
Symptom (user-visible): <what the user sees, verbatim if reported>.
Reproduce with: <steps / command / fixture> — you must see it fail before changing anything.
Expected vs. actual: <X> vs. <Y>.

Process:
1. Reproduce reliably; state the reproducing command and its failure output.
2. Hypothesize the root cause from reading, not from guessing — cite file:line.
3. Write a failing regression test FIRST; watch it fail.
4. Minimal fix; re-run the test (red → green), then the full gates: <typecheck>, <tests>, <build>.
5. If you cannot reproduce: gather <missing data>, state what you tried, STOP — do not ship a blind fix.
6. No unrelated changes in this diff. Found another bug? File it as an open item; don't fix it here.

Report: root cause (file:line) · the regression test name · commands + real output · risk of the fix · open items · "Not tested: <gaps>".
```
