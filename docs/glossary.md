# Glossary

> The words this kit uses with a precise meaning. If a rule uses one of them, this is what it means. English is canonical; the pt-BR README links here.

| Term | Meaning | Not this |
|---|---|---|
| **Repository** | The git project you work in: code, history, docs, configuration | the vendor folder of a library |
| **Skill** | A folder with `SKILL.md` + references that a harness can discover and load on demand | a running service or a CLI |
| **Router** | `SKILL.md`: the short decision file that maps a task to the references and the expected deliverable | a summary of every guide |
| **Reference** | A focused guide under `zm-pro/reference/`, loaded only when the task needs it | a tutorial you read top to bottom |
| **Template** | A copyable starting document under `zm-pro/templates/`; adapt it in your project, never edit the original | a generator with runtime behavior |
| **Harness** | The program that runs the agent and decides what context/tools it gets (OpenCode, Claude Code, Cursor, …) | the model provider |
| **Agent** | The model plus the harness loop and tools acting on your repository | a person on the team |
| **Model provider** | The company/API serving the model (pricing, retention, training policy) | the harness |
| **Rule** | A must/should statement with a verification method | advice without a check |
| **Track** | A route through the kit for one kind of task (feature, audit, release, privacy…) | a project phase |
| **Deliverable** | What the task must produce: diff, test, ADR, PR, runbook… | a status update |
| **Evidence** | Real command output, test result, link or artifact that proves a claim | "it works on my machine" |
| **Gate** | A check that blocks merge/release when red (`npm run validate`, tests, checksum verify) | a suggestion |
| **ADR** | Architecture Decision Record: context, options, decision, consequences | a task list |
| **Fail-closed** | When unsure, refuse and explain instead of guessing (installer overwrite, deploy gate) | best-effort overwrite |
| **Progressive disclosure** | Load the router first, then only the reference the task needs | preloading every guide |
| **Profile** | Declared rigor level of a project (essential, professional, critical, audit) | a separate fork of the kit |
| **Mechanical fix** | A change with one correct result, applied only with preview and consent (trailing space, final newline) | a semantic rewrite |
| **Synthetic data** | Invented fixtures that look real enough to test, never copied from production | anonymized customer data |

## Related concepts, in one line each

- **`RULES.md`** — project rules; highest authority after system/harness policy.
- **`AGENTS.md`** — project protocol: commands, gates, anti-collision rules.
- **Definition of done** — the observable criteria that end a task.
- **Anti-collision** — the protocol that stops two sessions from overwriting each other's work.
- **Checksum manifest** — one SHA-256 line per shipped file, attached to a release.
- **SemVer (here)** — MAJOR means the consumer must act; MINOR adds content; PATCH corrects without action.
