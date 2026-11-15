# 08 — Testes e qualidade

Testes são o preço de mudar código com confiança. Meta não é 100% de cobertura — é **nenhum fluxo crítico quebrado silenciosamente**.

## Pirâmide

1. **Unitário** (maioria): regras de negócio puras — cálculos, validações, state machines. Rápido, sem IO, com dados sintéticos.
2. **Integração**: API ↔ banco ↔ auth. Contra emulador/instância local (Firebase Emulator UI, Postgres efêmero, MSW para HTTP). Testa RLS/autorização de verdade: recurso de outra conta tem que falhar.
3. **E2E** (poucos, críticos): fluxos que valem dinheiro — cadastro → venda → recibo; login → operação; sync offline → reload → sync. Playwright + fixtures + MSW; roda no pipeline da mudança relevante.
4. **Transversal**: acessibilidade (axe-core/axe-playwright), performance (Lighthouse CI, web-vitals), visual (Storybook opcional), segurança (ZAP/audit no gate).

## Regras de ouro

- **Teste de regressão quando há seam**: todo bug corrigido ganha teste que falha sem o fix. Sem seam? Crie a menor seam possível — não "não dá para testar".
- **Nada de teste que depende de ordem ou relógio real** sem controle (fake timers); nada de fixture com dado real — só inventado.
- **Determinístico**: flaky test é bug do teste — quarentena e correção, nunca retry cego até passar.
- **Gate é real**: `typecheck` e suíte completa com saída colada na entrega. "Deve estar passando" não é resultado.
- **Cobertura como diagnóstico, não religião**: mire 80%+ em `src/domain`/regras e 100% dos fluxos críticos; linha descoberta em caminho de dinheiro/dados é alerta, não estatística.

## Gates de qualidade (por tipo de mudança)

| Mudança | Obrigatório |
|---|---|
| Qualquer código | typecheck + testes |
| Schema/migration | + teste de migração (up/down) |
| Auth/autorização/RLS | + teste de negação cross-account |
| Dependência | + quality:gate + security:gate |
| UI / fluxo comercial | + e2e + a11y axe |
| Offline/sync/licença | + e2e no fluxo afetado + simulação de falha de rede |
| Release | tudo + build(s) + changelog |

## Bug report → teste

Reproduzir antes de corrigir (passo a passo + esperado × atual) → teste que falha → fix mínimo → teste verde → typecheck/build → evidência na entrega. Correção sem teste de regressão volta como bug daqui a dois meses — lembre disso quando tiver pressa.

## Ferramentas (referência; instalar só com decisão)

Playwright · Testing Library · MSW · Firebase Emulator UI · Storybook · axe-core/axe-playwright · Lighthouse CI · web-vitals · Coveralls/c8 para relatório (local é suficiente).
