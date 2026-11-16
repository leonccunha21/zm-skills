# 03 — Layout & UI

Screens that look hand-made by a senior team: clear hierarchy, consistent spacing, accessible — not "generic AI template". Reference families (evaluate, don't blindly install): shadcn/ui and siblings, UI/UX Pro Max, Impeccable, Taste Skill, 60fps.design, Motion Primitives, Watermelon UI, Preline. Distill rules; never add a dependency without an explicit decision.

## Locales and formats

Default for pt-BR products (adapt per market, never mix by accident):

- UI in **Brazilian Portuguese**; code, identifiers and commits in English (unless the project mandates otherwise)
- Currency `R$ 1.234,56`; date `dd/mm/yyyy`; 24h time; phones `(11) 99999-9999`; CPF/CNPJ masked and validated by checksum (never raw regex)
- Review pluralization, gender agreement and spelling; AI-drafted microcopy gets a cold human read before shipping (reference families: Stop Slops, Humanizer)

## Mobile-first and touch targets

- Design at 360px first; expand with breakpoints. "Desktop that breaks on phone" is not acceptance.
- Touch targets ≥ **44×44px** (WCAG 2.5.8), ≥ 8px apart
- One field per line on mobile; correct `inputmode`/`type` per field; submit pinned at the bottom on long flows

## Visual system (tokens)

One source of truth for tokens (CSS custom properties + your Tailwind/theme config): **color** (bg, surface, ink, primary, success, warning, danger, with hover/focus/disabled variants; AA contrast), **type** (modular scale ~12/14/16/18/24/32/40; two families max), **spacing** (4/8/12/16/24/32/48/64), **radius**, **elevation** (3 shadows), **motion** (120–220ms `ease-out`, honor `prefers-reduced-motion`).

Avoid: generic purple gradients, decorative glassmorphism, emojis in formal UI, icon-only destructive actions, three or more typefaces.

## Screen anatomy (admin/ERP/management UIs)

- **One primary action per screen.** Secondary = ghost/outline; destructive = confirm-twice or undo.
- **Complete states**: empty (with guidance + CTA), loading (skeletons, not spinner soup), error (what happened + what to do), success (confirmation + next action). A screen without the four states is half a screen.
- **Tables**: sticky header, subtle zebra/hover, indicated sort, pagination or virtualization. No horizontal scroll on mobile — reflow into cards.
- **Long forms**: collapsible sections + partial save; inline errors next to the field, not only at the top.
- **Information density**: data before ornament; right-aligned numerals with tabular figures.

## Accessibility (non-optional)

- AA contrast (text 4.5:1, UI 3:1); visible `:focus-visible` on everything interactive
- Full keyboard navigation; `aria-label` on icon-only controls; meaningful `alt`; landmarks; modals trap focus and close on Esc; toasts use `role="status"`; tables with `<th scope>`
- Verify with axe-core/axe-playwright + Lighthouse (a11y ≥ 95) and, ideally, a real screen reader

## Motion with purpose

Animation explains change (item enter/exit, expand/collapse, action feedback). Short durations; no gratuitous bounce/spring in work tools. 60 fps or nothing.

## UI checklist (before the PR)

1. 360px OK? Targets ≥ 44px? Keyboard navigable? AA contrast?
2. Empty / loading / error / success — all four present?
3. One primary action? Destructive actions guarded? Locale formats correct?
4. Tokens used — no hardcoded colors/sizes outside the theme?
5. No PII in placeholders, fixtures or screenshots?
