# O zm-pro para quem não é especialista

> Um guia sem jargão para entender o que este repositório faz e como ele impede seu agente de IA de "esquecer o projeto". Leia isto antes de tudo — depois volte para o [README](../README.md).

## O problema que resolve

Você fala com um agente de IA (OpenCode, Claude Code, Cursor…) e ele:

- começa mexendo sem ler nada,
- conserta um arquivo errado e quebra dois,
- diz "pronto!" sem rodar os testes,
- repete decisões que já foram tomadas,
- entope a memória com arquivos que não devia.

O zm-pro é um **manual de conduta para agentes**: um conjunto de arquivos de texto que o agente lê antes de trabalhar. Não é um programa — é instrução pura, copiada dentro do seu projeto.

## Em 3 passos

1. Copie a pasta `zm-pro/` para dentro do seu projeto (ou global no seu harness).
2. Adapte os dois arquivos obrigatórios (`AGENTS.md`, `RULES.md`) para o que o seu projeto não pode violar.
3. Peça ao agente: *"Use o zm-pro. Objetivo: X. Critérios de aceite: Y."*

## O "mapa" do kit — o que cada arquivo ensina

O arquivo guia (`SKILL.md`) funciona como um **router**: o agente lê ele primeiro e carrega só o que a tarefa exige — nunca tudo de uma vez. Aqui vai cada habilidade em linguagem humana:

| Guia | Em uma frase de leigo |
|---|---|
| 01 — Code rules | Como escrever código que sobrevive: mudança mínima, nada de enganação, e portões que **bloqueiam** entrega ruim |
| 02 — Project standards | O esqueleto que todo projeto sério tem: README que serve, docs, commits, versionamento, changelog |
| 03 — Layout e UI | Telas mobile-first, com alvos de toque ≥ 44px, acessível, em R$ 1.234,56 e dd/mm/aaaa quando for o caso |
| 04 — Multi-agent | Como vários agentes trabalham sem atropelar um ao outro (um coordenador, uma tarefa por vez) |
| 05 — Memory | Como o projeto "lembra": o que fica no git (definitivo), o que fica na sessão (curto prazo) e como manter a memória limpa — com tipos de memória: **procedimento** (como fazemos), **conhecimento** (o que decidimos) e **acontecimentos** (o que aconteceu) |
| 06 — Privacidade e LGPD | Mapear dados pessoais, base legal, resposta a titulares, incidentes — rascunho de engenharia, não parecer jurídico |
| 07 — Segurança | Segredos fora do código, autenticação, autorização que nega por padrão, OWASP, incidentes |
| 08 — Testes e qualidade | Pirâmide de testes (muitos unitários, poucos E2E), critérios de aceite, gates de qualidade |
| 09 — Entrega com git | Commits honestos, PRs pequenos, rollback pronto, deploy que falha fechado |
| 10 — Operação | Logs, alertas, runbooks, backups testados e pós-mortems sem culpados |
| 11 — Arquitetura | Módulos coesos, dependência na direção certa, decisões registradas (exceções: registro de decisões — ADR) |
| 12 — Performance | Medir antes de otimizar: Core Web Vitals, N+1, índices, orçamento de performance |
| 13 — Economia de tokens | Como não estourar a memória/custo do agente: carregar só o necessário, respostas curtas, subagentes com escopo estreito |

## O que vem nas outras pastas

- **templates/** — pontos de partida genéricos: protocolo de agente (`AGENTS.md`), regras (`RULES.md`), registro de decisões (`ADR.md`), checklists de entrega e PR, e 5 prompts prontos (implementar, corrigir, revisar, release, auditoria de privacidade).
- **examples/minimal-project/** — um exemplo preenchido de ponta a ponta: lê, compara com o template em branco e aprende o padrão.
- **scripts/** — ferramentas que rodam no seu computador, nada mágico: `install.mjs` (instala o skill no seu harness), `checksums.mjs` (verifica integridade dos arquivos no release), `validate.mjs` (confere se o kit está íntegro).
- **.github/** — o mesmo validador rodando no CI (Ubuntu e Windows), além de templates de issue/PR.

## O que ele NÃO faz

- Não escreve código por você. Quem escreve é o seu agente — a skill só impede que ele seja negligente.
- Não é jurídica, não é compliance, não é consultoria. Para LGPD, as decisões finais são do seu encarregado/DPO.
- Não substitui o time. Se o time tem regras próprias, **as do time ganham** — a skill cede.
- Não funciona em todos os harnesses da mesma forma: no OpenCode foi testado ponta a ponta; nos outros, está documentado o que não foi verificado (veja [harness-compatibility.md](harness-compatibility.md)).

## Comece hoje

Siga o [primeiro-dia.md](primeiro-dia.md) — do zero ao primeiro commit em ~20 minutos, com troubleshooting incluído.

## Glossário de sobrevivência

| Termo | Significado simples |
|---|---|
| Agente | a IA que lê e escreve código sob o seu comando |
| Harness | o programa onde o agente vive (OpenCode, Claude Code, Cursor…) |
| Skill | um pacote de instruções que o agente lê sob demanda |
| Router | o arquivo de navegação do kit (`SKILL.md`) |
| Gate | verificação que bloqueia entrega ruim |
| Evidência | saída de comando colada — nunca promessa |
| ADR | registro de decisão: o porquê de cada decisão |
| Rollback | desfazer mudança com segurança |
| Commit | ponto salvo no histórico do projeto |
| Trilha (track) | o caminho certo para a tarefa (implementar, corrigir, entregar…) |

## Por que confiar

- Nasceu de um codebase comercial em produção, foi testado num piloto real (módulo entregue, 9/9 testes, evidência colada).
- Código aberto MIT, bilíngue, zero dependências, sem telemetria, sem rede.
- Cada entrega cita comandos com saída — ou declara explicitamente o que não foi testado.
