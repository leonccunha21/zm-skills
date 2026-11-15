# Definição de Pronto (Definition of Done)

> Vale para toda entrega do projeto. "Pronto" sem os itens abaixo é WIP com boa aparência.

## Código

- [ ] Comportamento reproduzido/entendido; mudança **mínima e segura**; nada de escopo expandido em silêncio
- [ ] Typecheck limpo; lint limpo; suíte de testes verde (saída colada na entrega)
- [ ] Teste de regressão incluído quando havia seam; teste de negação para autorização/RLS quando aplicável
- [ ] Sem `any` injustificado, `catch` vazio, `console.log` de debug esquecido ou silenciamento de gate
- [ ] Migration (se houver) com rollback testado; soft-delete/tombstone onde há histórico

## Qualidade e segurança

- [ ] Scan de segredos limpo; nenhum PII em código, fixture, log ou screenshot novo
- [ ] Autorização server-side por recurso revisada (cross-account/cross-tenant falha)
- [ ] Dependências novas justificadas (existência, licença, manutenção, custo-zero, peso)
- [ ] Headers/CSP/sessão não regrediram; falha continua fail-closed

## Verificação (evidências anexadas)

- [ ] `<comando de typecheck>` — saída
- [ ] `<comando de testes>` — saída
- [ ] `<build da(s) edição(ões)>` — saída
- [ ] `<e2e>` — saída (obrigatório se tocou UI/fluxo comercial/sync/licença/offline)
- [ ] Smoke manual em `<ambiente>` (obrigatório para release)

## Rastreabilidade

- [ ] Commit(s) com conventional commits, por pathspec
- [ ] `melhorias`/registro de entregas atualizado (SHA, data, evidência, o que falta) no mesmo commit
- [ ] Pendências que dependem de ambiente real/decisão de negócio registradas em `PENDENCIAS_*.md`
- [ ] Docs/ADR atualizados se a decisão mudou; CHANGELOG atualizado se houve mudança visível
- [ ] PR com checklist (`PR-TEMPLATE.md`) preenchido; revisão humana aprovada; gates verdes
- [ ] Nada marcado como "pronto" sem o item correspondente verificado — não testado é dito explicitamente
