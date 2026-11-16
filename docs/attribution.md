# Attribution and licensing

> What third-party material the kit references, in which role, under which license, and whether any text leaves this repository. This file exists so a legal reviewer does not have to guess.

## What this repository contains

- **All kit text under `zm-pro/`** is original to this project, MIT-licensed (`LICENSE`).
- **Scripts under `scripts/`** are original, MIT-licensed.
- **Tests and fixtures** in `tests/` are synthetic (invented names, `example.com`-style placeholders), MIT-licensed.
- **No icons, images, fonts or binary assets** are vendored.
- **No copied prose from third-party documentation**; references are links, not quotes.

## External references and their licenses (as checked 2026-11-16)

| Material | Role in kit | License | Notes |
|---|---|---|---|
| OWASP Cheat Sheet Series | security guidance reference (07) | CC-BY-SA 3.0.0 | named as reference only; no text reproduced |
| Core Web Vitals / Lighthouse CI | performance guidance (12) | Apache-2.0 | docs referenced |
| OpenTelemetry, Grafana+Loki, Sentry, ZAP, Gitleaks | tooling suggestions (10, 07) | Apache-2.0 / AGPL / MIT (Sentry: FSL/source-available) | recommendations, never vendored |
| GitHub Actions `checkout`/`setup-node` | CI | MIT (actions/toolkit) | pinned by SHA |
| goul4rt/lgpd-skills | companion privacy pack (06) | MIT | optional companion; linked with attribution |
| Node.js / npm ecosystem | tooling | MIT | scripts target Node ≥ 18 |
| WCAG 2.2 | accessibility target (03) | W3C Document License | referenced as normative standard, not reproduced |

Tool licenses move; the table above reflects what was verified when written and is re-checked quarterly (`docs/maintenance-policy.md`).

## Names used

Trademarks (Playwright, Sentry, OpenCode, Claude Code, Cursor, Google, GitHub, etc.) belong to their respective owners and are used here for identification, not affiliation.

## Your obligations when forking

Keep `LICENSE` (MIT); if you remove or modify guidance, say what you changed; do not ship a fork that claims endorsement by this project. Attribution of this project itself is requested (a link to the repository), not required.

## Reporting a licensing error

If you find text that looks copied in a file here, open a private security/legal report per `SECURITY.md` (linking the file and the source) — licensing notices are maintained within 72 hours.
