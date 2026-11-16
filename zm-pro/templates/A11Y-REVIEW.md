# Accessibility review — <screen/feature>

> Copy to `docs/a11y/review-<slug>.md`. Target: WCAG 2.2 AA where applicable.
> Automated tools catch a minority of issues; a manual pass is required for a real claim.

## Scope

- **Screens/flows:** <list> · **Platform/browser:** <versions> · **Assistive tech used:** <screen reader, switch, zoom>

## Checks

| Area | Check | Result | Evidence |
|---|---|---|---|
| Keyboard | every action reachable; no trap; logical order | pass/fail | <screenshot/note> |
| Focus | visible focus ring; focus moves to errors/dialogs; returns on close | | |
| Semantics | landmarks, headings hierarchy, lists, tables with headers | | |
| Names | buttons/links/inputs have accessible names; icons labeled | | |
| Forms | labels tied to fields; errors announced; required state programmatic | | |
| Contrast | text ≥ 4.5:1 (≥ 3:1 large); non-text UI ≥ 3:1 | | |
| Zoom / reflow | 200% zoom and 320px width without loss of content | | |
| Motion | respects `prefers-reduced-motion`; no unavoidable flashing | | |
| States | empty, loading, error and success announced and understandable | | |
| Language | page `lang` correct; locale formats for dates, numbers, currency | | |

## Screen reader pass

- **Tool/version:** <NVDA/VoiceOver/TalkBack + version>
- **Flow tested:** <what was read/operated>
- **Findings:** <confusing announcements, missing context>

## Automated tooling

```
<axe/Lighthouse command and output summary — not a substitute for the table above>
```

## Findings

| # | Severity | Finding | Fix | Owner |
|---|---|---|---|---|
| 1 | blocker / major / minor | <what> | <how> | <who> |

## Claim

<!-- Only state "conforms to WCAG 2.2 AA" after a manual audit covering the scope above. -->
