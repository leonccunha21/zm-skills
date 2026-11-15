# 03 — Layout e UI (PT-BR, mobile-first, profissional)

Objetivo: telas que parecem feitas por um time sênior — hierarquia clara, espaçamento consistente, acessível — e não "template de IA genérico". Base de referência: shadcn/ui e família, UI/UX Pro Max, Impeccable, Taste Skill, 60fps.design, Motion Primitives (catálogo). Destile regras; não instale nada sem decisão explícita.

## Idioma e formatos (Brasil)

- UI inteira em **PT-BR**; código, identificadores e commits em inglês.
- Moeda `R$ 1.234,56`; data `dd/mm/aaaa`; hora 24h; telefones `(61) 99999-9999`; CPF/CNPJ com máscara e validação de dígito (zod/`cpf-cnpj-validator` quando instalado — nunca regex pura).
- Pluralização, concordância e acentuação revisadas; texto de IA passa por leitura fria humana antes de publicar (Stop Slops / Humanizer como referência de tom).

## Mobile-first e alvos de toque

- Desenhe o layout primeiro para 360px; expanda com breakpoints (`sm/md/lg`). Nada de "desktop quebrado no celular".
- Alvo de toque ≥ **44×44px** (WCAG 2.5.5/2.5.8); espaçamento mínimo de 8px entre alvos.
- Formulários: um campo por linha no mobile; teclado adequado por tipo de input (`inputmode="numeric"`, `type="email"`); botão de submit fixo no rodapé em fluxos longos.

## Sistema visual (tokens)

Defina tokens num único lugar (CSS vars + Tailwind theme): **cores** (bg, surface, ink, primary, success, warning, danger — com variantes hover/focus/disabled e contraste AA), **tipografia** (escala modular: 12/14/16/18/24/32/40; 2 famílias no máximo — uma serifa ou sans de display + sans de texto), **espaçamento** (escala 4/8/12/16/24/32/48/64), **radius**, **shadow** (3 elevações), **motion** (120–220ms, `ease-out`; respeito a `prefers-reduced-motion`).

Evite: gradiente roxo genérico, glassmorphism decorativo, emojis em UI formal, ícone sem texto em ação destrutiva, 3 fontes.

## Anatomia da tela (aplica-se a admin/ERP/gestão)

- **Uma ação primária por tela.** Secundárias como ghost/outline; destrutivas sempre com confirmação dupla ou undo.
- **Estados completos**: vazio (com orientação e CTA), carregando (skeleton, não spinner no meio da tela), erro (o que aconteceu + o que fazer), sucesso (confirmação + próxima ação). Tela sem os 4 estados está pela metade.
- **Tabelas**: header congelado, zebra ou hover sutil, ordenação indicada, paginação ou virtualização; nunca scroll horizontal no mobile — transforme em cards.
- **Formulários longos**: seções colapsáveis + salvamento parcial; erros inline junto ao campo, não só no topo.
- **Densidade certa para gestão**: dados antes de ornamento; números alinhados à direita, com fonte tabular.

## Acessibilidade (não opcional)

- Contraste AA (texto 4.5:1; UI 3:1). Todo elemento interativo com foco visível (`:focus-visible`).
- Navegação 100% por teclado; `aria-label` em ícone-sem-texto; `alt` descritivo; landmarks (`main`, `nav`, `header`).
- Modais com foco preso e esc fecha; toasts com `role="status"`; tabelas com `<th scope>`.
- Verifique com axe-core/axe-playwright + Lighthouse (a11y ≥ 95) e, sendo possível, teste com leitor de tela real.

## Motion com propósito

Transições explicam mudança de estado (entrada/saída de item, expandir/recolher, feedback de ação). Duração curta, sem mola/bounce gratuito em ferramenta de trabalho. Menos é mais: 60fps ou sem animação.

## Checklist rápido de UI (antes do PR)

1. 360px OK? Alvo ≥ 44px? Teclado navega? Contraste AA?
2. Vazio / carregando / erro / sucesso — os quatro estados existem?
3. Uma ação primária? Ações destrutivas protegidas? Formatação PT-BR?
4. Tokens usados (nenhuma cor/size hardcoded fora do tema)?
5. Sem PII em placeholder, screenshot ou fixture?
