# 09 — Entrega, Git e release

A entrega é o produto. Feature perfeita sem entrega verificável é protótipo caro.

## Unidade de entrega

Um **objetivo fechado** por entrega: o que muda, critério de aceite, comandos, evidência, registro. Se fizer duas coisas, são duas entregas.

## Commits e branches

- Conventional commits: `feat|fix|chore|docs|refactor|test(escopo): resumo imperativo em PT-BR ou EN — escolha um e seja consistente`.
- Commit por pathspec — nunca `git add -A` com WIP de outra sessão na árvore (ver `04-multi-agentes.md`).
- Branch por entrega; PR pequeno e reversível. Rebase da própria branch antes do PR ok; force-push em `main`, nunca.
- Merge com merge commit ou squash — **decida uma vez por repo** e documente no RULES.

## Pull Request (modelo em `templates/PR-TEMPLATE.md`)

Conteúdo obrigatório: contexto (por quê), mudanças (o que), como testar, riscos/rollback, pendências, evidência (comandos + saídas). Review responde em até 1 dia útil para mudanças de fluxo crítico; review sem checklist preenchido não aprova.

## Release

1. Tag semântica `vX.Y.Z` + `CHANGELOG.md` no mesmo commit (Keep a Changelog: Added/Changed/Fixed/Security).
2. Build de release reprodutível (lockfile, `npm ci`); artefato nomeado com versão.
3. **Deploy fail-closed**: gate vermelho bloqueia; emergência é manual, documentada e pós-mortem no dia seguinte.
4. Rollback definido **antes** do deploy: comando/tag anterior + migration down + critérios de acionamento (erro > X%, checkout fora, dado corrompido).
5. Pós-deploy: smoke test (login, operação principal, sync, licença) em produção/homologação minutos após o deploy.

## Definition of Done

Ver `templates/DEFINICAO-DE-PRONTO.md` — resumo: typecheck limpo · testes verdes · build da(s) edição(ões) OK · sem segredo/PII · migration com rollback · docs/registro/pendências no mesmo commit · evidência colada · PR aprovado com checklist.

## Changelog e notas de entrega

Escreva para quem **usa** o produto, não para quem codava: o que muda no dia a dia, correções com sintomas descritos ("corrigido: total de vendas zerado ao aplicar filtro de data"), breaking changes em destaque com ação necessária.

## Pós-entrega

Atualizar registro de entregas (SHA, data, evidência, o que falta) e, se aplicável, anúncio curto no canal do time. Entregas de fluxo crítico recebem monitoramento atento por N horas — alertas ligados (ver `10-operacao-observabilidade.md`).
