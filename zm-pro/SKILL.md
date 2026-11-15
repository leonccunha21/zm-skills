---
name: zm-pro
description: Kit para projeto profissional ponta a ponta. Use quando a tarefa envolver (1) kickoff ou setup de projeto novo, (2) implementação de feature ou correção, (3) revisão, auditoria ou hardening de qualidade/segurança, (4) entrega — commit, PR, release, deploy ou pós-incidente, (5) dados pessoais — auditoria LGPD, ou decisão sobre arquitetura, padrão ou layout. Carrega só as referências da trilha da tarefa.
---

# ZM Pro — kit de projeto profissional

Este arquivo é o **router**: leia-o inteiro, escolha a trilha da tarefa e carregue apenas as referências necessárias em `reference/`. Templates copiáveis ficam em `templates/`.

## Quando usar

- Kickoff, planejamento ou setup de qualquer projeto de software
- Implementação, correção ou refatoração de código
- Revisão, auditoria ou hardening (qualidade, segurança, acessibilidade, LGPD)
- Entrega: commit, PR, release, deploy, pós-incidente
- Decisão de arquitetura, padrão ou layout

## Quando não usar

- Tarefa trivial fora de projeto (dúvida solta, texto curto)
- O projeto tem `RULES.md`/`AGENTS.md` próprio: **eles vencem este kit**. O kit é o default profissional, não um override

## O ciclo (sempre)

1. **Ler o terreno**: README, AGENTS.md, RULES.md, package.json/lockfiles antes de agir.
2. **Reproduzir/entender**: comportamento esperado × atual; confirmar que dependência, tabela, endpoint ou feature já existe antes de criar.
3. **Menor mudança segura**, com teste de regressão quando houver seam; no máximo **3 referências do catálogo por tarefa**.
4. **Verificar de verdade**: executar os comandos (typecheck, testes, build, e2e) e registrar a saída real — nunca declarar sucesso sem evidência.
5. **Entregar com registro**: arquivos alterados, comandos + resultado, riscos, pendências, evidência (ver `templates/CHECKLIST-ENTREGA.md`).

## Índice de referência (carregue só o que a trilha pede)

| Arquivo | Leia quando a tarefa tocar… |
|---|---|
| `reference/01-regras-codigo.md` | regras de código, gates, dependências, definição de pronto |
| `reference/02-padronizacao-projeto.md` | estrutura de docs, commits, PR, semver, changelog |
| `reference/03-layout-ui.md` | UI, layout, formulários, PT-BR, acessibilidade |
| `reference/04-multi-agentes.md` | sessões, coordenação multiagente, handoff, prompt para agentes |
| `reference/05-memoria.md` | memória de projeto, ADRs, melhorias/pendências |
| `reference/06-lgpd.md` | dados pessoais: mapa de dados, consentimento, DSAR, incidentes |
| `reference/07-seguranca.md` | segredos, OWASP, autenticação/RLS, headers, dependências |
| `reference/08-testes-qualidade.md` | testes unitários/integração/e2e, a11y, performance |
| `reference/09-entrega-git.md` | commits, branches, PR, release, rollback |
| `reference/10-operacao-observabilidade.md` | logs, métricas, alertas, backup, runbook, pós-mortem |

## Regras universais (valem em toda trilha)

1. **Referência ≠ dependência ≠ instalação.** O catálogo informa escolhas; instalar exige decisão explícita: licença, manutenção e custo-zero verificados.
2. **Segredos e dados reais nunca saem do projeto** — nem em log, chat, commit, screenshot ou ferramenta externa.
3. **Deploy é fail-closed.** Gate vermelho bloqueia; emergência é manual e auditável.
4. **PT-BR na UI**, formato `R$ 1.234,56`, data `dd/mm/aaaa`, alvo de toque ≥ 44px, mobile-first.
5. **Custo-zero por padrão**: nada pago sem decisão explícita do dono do projeto.
6. **Evidência antes de "pronto"**: comando executado + saída anexada à entrega.
7. **LGPD é rascunho de engenharia, não conformidade**: validação do Encarregado/jurídico é externa a este kit.
8. **Uma fonte de verdade por fato**: mudança de regra acontece no arquivo dono, nunca em cópia.

## Catálogo de referências

As referências curadas do time (nome + link + descrição simples, licença e alertas verificados) ficam no **catálogo do repositório de referências**. Ao encaminhar tarefa a agente, cite sempre **nome + link**, nunca apenas número — e no máximo 3 por tarefa. Referência não é autorização para instalar.

## Templates

`templates/` contém versões genéricas copiáveis para o projeto de destino: `AGENTS.md`, `RULES.md`, `ADR.md`, `DEFINICAO-DE-PRONTO.md`, `CHECKLIST-ENTREGA.md`, `PR-TEMPLATE.md`. Copie e ajuste ao projeto — não edite os originais do kit.
