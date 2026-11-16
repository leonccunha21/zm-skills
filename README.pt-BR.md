<div align="center">

# zm-pro

**o playbook de projeto profissional para agentes de IA**

[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green.svg)](LICENSE)
[![Versão](https://img.shields.io/github/v/release/leonccunha21/zm-skills?label=vers%C3%A3o)](CHANGELOG.md)
[![Release](https://img.shields.io/github/v/release/leonccunha21/zm-skills)](https://github.com/leonccunha21/zm-skills/releases/latest)
[![validate](https://github.com/leonccunha21/zm-skills/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/leonccunha21/zm-skills/actions/workflows/validate.yml)
[![Buy Me a Coffee](https://img.buymeacoffee.com/button-api/?text=Compre-me%20um%20caf%C3%A9&emoji=%E2%98%95&slug=zmcompanh&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff)](https://www.buymeacoffee.com/zmcompanh)

Uma skill portátil e autocontida que transforma qualquer agente de código em um profissional de projetos disciplinado — regras, padrões, layout e UI, coordenação multiagente, memória de projeto, privacidade (LGPD/GDPR), segurança, testes, entrega e operação. Baseada no formato aberto [Agent Skills](https://github.com/agentskills/agentskills); funciona no OpenCode, Claude Code, Codex, Cursor, Gemini CLI e qualquer harness que carregue pacotes `SKILL.md`.

**[Instalação](#instalação) · [O que vem dentro](#o-que-vem-dentro) · [Uso rápido](#uso-rápido) · [FAQ](#faq) · [Contribuição](#contribuição-e-releases) · [English](README.md)**

</div>

---

## Por que existe

Agentes já escrevem código. O que falta na maioria dos projetos é o **sistema operacional profissional em volta do código**: gates que de verdade bloqueiam, entregas com evidência, memória que sobrevive à sessão, privacidade por padrão e layout que não parece template. O zm-pro é esse sistema — empacotado como skill sob demanda, sem custar contexto até ser usada.

A versão estendida — notas de campo do fluxo real que deu origem ao kit — está em [docs/why-i-built-zm-pro.md](docs/why-i-built-zm-pro.md) (em inglês).

## O que vem dentro

**Os 18 guias em linguagem simples** — o que seu agente aprende:

| Guia | O que o agente aprende a fazer |
|---|---|
| 01 — Code rules | escrever código que sobrevive: mudança mínima segura, sem atalho, portões que bloqueiam entrega ruim |
| 02 — Project standards | o esqueleto de todo projeto sério: README, docs, commits, versionamento, changelog |
| 03 — Layout e UI | telas mobile-first, toque ≥ 44px, acessíveis, no padrão da localidade (`R$ 1.234,56`, `dd/mm/aaaa`) |
| 04 — Multi-agent | vários agentes sem atropelar: 1 coordenador, 1 tarefa por vez |
| 05 — Memory | o projeto lembra: fatos no git, sessões curtas — com modelos de memória (procedimento / semântica / episódica) |
| 06 — Privacidade (LGPD) | mapear dados pessoais, base legal, resposta a titulares, incidentes — rascunho de engenharia, não parecer jurídico |
| 07 — Segurança | segredos fora do código, authN/authZ que nega por padrão, OWASP essencial, incidentes |
| 08 — Testes | pirâmide de testes, critérios de aceite reais, gates de qualidade |
| 09 — Entrega com git | commits honestos, PRs pequenos, rollback testado, deploy fail-closed |
| 10 — Operação | logs, alertas, runbooks, backups testados, pós-mortems sem culpados |
| 11 — Arquitetura | módulos coesos, dependência na direção certa, decisões como ADRs |
| 12 — Performance | medir antes: Core Web Vitals, N+1, índices, budgets de performance |
| 13 — Economia de tokens | o contexto é dinheiro: ler só o necessário, respostas curtas, subagentes com escopo estreito |
| 14 — Operação do agente | usar a ferramenta menos poderosa, pedir confirmação antes de ação destrutiva, tratar conteúdo externo como dado, parar em vez de inventar |
| 15 — Segurança de IA | threat model de LLM/RAG/agentes: injeção, autorização de ferramentas, isolamento entre tenants, budgets, testes adversariais |
| 16 — Playbooks de domínio | API, banco, frontend, backend, mobile, infra, legado, dados e docs: as checagens que importam |
| 17 — Perfis e modos | dial de rigor (essencial → auditoria) e modo da tarefa (descoberta, auditoria, incidente, review) com regras de parada |
| 18 — Adaptadores de stack | comandos que detectam antes de assumir: JS/TS, Python, JVM, .NET, PHP, Go, Rust e mobile — o repositório é a fonte |

Novo aqui? O passo a passo completo está no [docs/para-leigos.md](docs/para-leigos.md) (pt-BR).

A estrutura do repositório:

```
zm-pro/                        # a skill — copie esta pasta para seu projeto/harness
├── SKILL.md                   # router: quando usar, o ciclo, o índice
├── reference/                 # 18 guias focados, carregados sob demanda
│   ├── 01-code-rules.md           # princípios, gates, dependências, definição de pronto
│   ├── 02-project-standards.md    # layout do repo, docs, commits, semver, changelog
│   ├── 03-layout-ui.md            # defaults PT-BR, mobile-first, toque ≥44px, a11y AA, tokens
│   ├── 04-multi-agent.md          # 1 coordenador, 1 tarefa por vez, escopo A/B, handoff
│   ├── 05-project-memory.md       # memória institucional / de sessão / estrutural
│   ├── 06-data-privacy-lgpd.md    # gatilhos de dado pessoal, controles, pacote LGPD companheiro
│   ├── 07-security.md             # segredos, OWASP essencial, auth/RLS, backup, incidente
│   ├── 08-testing-quality.md      # pirâmide, MSW/emuladores/Playwright, regressão, gates
│   ├── 09-delivery-git.md         # commits, PR, release, deploy fail-closed, rollback
│   ├── 10-operations.md           # logs/métricas/alertas, ensaio de restore, runbooks, pós-mortem
│   ├── 11-architecture.md         # deep modules, direção de dependência, seams, ADRs
│   ├── 12-performance.md          # medir primeiro, budgets de Core Web Vitals, N+1, CI de performance
│   ├── 13-token-economy.md        # o contexto é dinheiro: leitura sob demanda, cache, subagentes com escopo estreito
│   ├── 14-agent-operations.md     # risco de ferramenta, confirmações, conteúdo não confiável, regras de parada
│   ├── 15-ai-security.md          # ameaças de LLM/RAG, injeção, authz de ferramentas, isolamento, budgets
│   ├── 16-domain-playbooks.md     # API, banco, frontend, backend, mobile, infra, legado, dados, docs
│   ├── 17-working-modes.md        # perfis essencial→auditoria e modos com regras de parada
│   └── 18-stack-adapters.md       # comandos por ecossistema, detectando antes de assumir
└── templates/                 # pontos de partida genéricos e copiáveis
    ├── AGENTS.md · RULES.md · ADR.md · DEFINITION-OF-DONE.md · DELIVERY-CHECKLIST.md · PR-TEMPLATE.md · COORDINATION.md
    ├── IMPLEMENTATION-PLAN.md · AUDIT-REPORT.md · TEST-PLAN.md · THREAT-MODEL.md · RUNBOOK.md · INCIDENT-REPORT.md · RELEASE-NOTES.md · PROJECT-PROFILE.md · A11Y-REVIEW.md · VENDOR-INVENTORY.md · EVALUATION-REPORT.md
    └── prompts/                   # prompts de delegação: implementar, corrigir, revisar, release, auditoria LGPD
(examples/minimal-project na raiz do repositório: projeto inicial preenchido — AGENTS.md real, ADR real e DELIVERY-LOG com evidência)
```

## Antes de começar

- **Git** — o kit mora dentro do seu projeto (`git --version`).
- **Node ≥ 18** — o validador e o instalador usam Node (`node --version`). O skill não carrega runtime nenhum.
- **Um harness de IA autenticado** — OpenCode (tem modelos gratuitos), Claude Code, Cursor e outros; veja [docs/harness-compatibility.md](docs/harness-compatibility.md) para o que foi testado e o que não foi.
- Custo: **o kit é grátis (MIT), para sempre.** O seu harness/provedor pode custar — os preços mudam o tempo todo; confira o plano atual do provedor que você escolher. Um tier gratuito basta para experimentar.

## Instalação

> Com pressa? [Início rápido em cinco minutos](docs/quickstart.md) (em inglês) ou a [demonstração guiada](docs/demo.md). Atualizando uma instalação? [Migração e versionamento](docs/migration.md). Mais docs (em inglês): [solução de problemas](docs/troubleshooting.md) · [glossário](docs/glossary.md) · [arquitetura](docs/architecture.md) · [segurança de ferramentas](docs/tool-safety.md) · [distribuição](docs/distribution.md) · [métricas](docs/metrics.md) · [avaliações](EVALUATIONS.md).
> Evidência por harness — [docs/harness-compatibility.md](docs/harness-compatibility.md). Travou? [Solução de problemas](docs/troubleshooting.md). Automatizado: `node scripts/install.mjs opencode` (via npm: `npm run install-skill -- opencode`; `--dir <raiz-do-projeto>` instala em `<raiz-do-projeto>/.agents/skills/zm-pro`); integridade para releases: `npm run --silent checksums`.

### OpenCode

**Por projeto (recomendado para começar):**
```bash
mkdir -p .agents/skills
cp -r zm-pro .agents/skills/zm-pro
```

**Global (todos os seus projetos):**
```bash
mkdir -p ~/.config/opencode/skills
cp -r zm-pro ~/.config/opencode/skills/zm-pro
```

### Claude Code / Codex CLI

Copie `zm-pro/` para a pasta de skills do harness (ex.: `~/.claude/skills/zm-pro`), ou aponte o `CLAUDE.md`/`AGENTS.md` do projeto para o `SKILL.md` como doc de procedimento.

### Cursor / Gemini CLI / outros

Aponte as instruções do agente para `zm-pro/SKILL.md`. O router é autoexplicativo — nenhum truque específico de harness.

### Atualização

Copie a pasta de novo (`cp -r zm-pro <destino>` / `Copy-Item -Recurse -Force`) ou faça pull e copie outra vez. Os diffs continuam legíveis porque o kit é Markdown puro.

Atualização automatizada: `npm run install-skill -- opencode --dry-run` mostra a versão que entra e o que mudaria; rode de novo sem `--dry-run` e com `--force` para aplicar. A pasta anterior fica como `zm-pro.backup-<timestamp>` (arquivos locais preservados nela). Voltar para uma versão antiga é permitido, mas avisado — o backup é o caminho de volta.

### Desinstalação

Apague a pasta instalada (`rm -rf .agents/skills/zm-pro` ou o caminho global escolhido). O instalador só copia arquivos, então nada mais é alterado. Instalação interrompida? Remova a pasta `zm-pro` parcial e rode o instalador de novo.

## Uso rápido

> Novo aqui? Leia primeiro o [docs/para-leigos.md](docs/para-leigos.md) — o kit em linguagem simples — e depois siga o [docs/primeiro-dia.md](docs/primeiro-dia.md) — do zero ao primeiro commit.

Prompt para uma tarefa real:

> Use a skill zm-pro. Leia RULES.md e AGENTS.md primeiro. Objetivo: <X>. Arquivos no escopo: <…>. Critérios de aceite: <…>. Rode os comandos de verificação e cole a saída real. Não declare sucesso sem evidência.

## O que o zm-pro não é

- **Não é framework, biblioteca ou CLI** — é documentação-como-skill. Sem runtime, sem rede, sem telemetria, sem dependências.
- **Não é assessoria jurídica** — a trilha de privacidade produz rascunhos de engenharia e controles; conclusão jurídica é do seu Encarregado/DPO.
- **Não substitui as regras do seu projeto** — ele se curva a elas por design.

## FAQ

**Funciona offline?** Sim. Tudo é Markdown local.
**Envia dados para fora?** Não. O repositório não contém código executável além do validador (só para contribuidores).
**Quanto custa?** Nada — MIT. Seu harness/provedor de modelo pode cobrar; o kit não tem plano pago, telemetria nem upsell.
**Qual é a licença?** MIT (`LICENSE`). Faça fork, adapte e distribua; mantenha o aviso.
**O que significam os termos?** [Glossário](docs/glossary.md) (em inglês): skill, router, referência, harness, agente, gate, evidência.
**Posso forkar e adaptar?** Sim — MIT. Mantenha o aviso de licença e diga aos usuários o que mudou.
**Funciona com minha stack?** As regras são agnósticas; os exemplos assumem TypeScript/Node, mas adaptam-se a Python, Go, PHP etc.
**Funciona com meu harness?** Só o OpenCode 2.3.0 foi testado de ponta a ponta; Claude Code, Codex, Cursor e Gemini estão explicitamente não verificados — veja [docs/harness-compatibility.md](docs/harness-compatibility.md) e envie um relato.
**Quais são os limites?** Ainda não há avaliação comportamental publicada, harness não testado continua não verificado, e o kit não é auditoria de segurança, privacidade ou jurídica. O status honesto está em [docs/maturity.md](docs/maturity.md).
**Tem um exemplo de início rápido?** Sim — `examples/minimal-project/`: AGENTS.md preenchido, um ADR real e um DELIVERY-LOG com evidências para copiar e adaptar.

## Contribuição e releases

Veja [CONTRIBUTING.md](CONTRIBUTING.md) (em inglês). Semver; toda mudança via PR com o validador verde (`npm run validate`) e a suíte de testes passando (`npm run test` - validador e instalador, sem dependências); histórico em [CHANGELOG.md](CHANGELOG.md).

Resumo em português: (1) abra uma issue antes de mudanças grandes; (2) edite `zm-pro/` ou os arquivos do repositório; (3) rode `npm run validate` e `npm test` e cole a saída real; (4) atualize `CHANGELOG.md` (MAJOR quebra, MINOR adiciona, PATCH corrige); (5) preencha o template de PR. O inglês é canônico no kit; pt-BR aparece onde o idioma é o assunto. Distribuição e o que é publicado: [docs/distribution.md](docs/distribution.md).

---

<div align="center">

**Feito por [ZM](https://github.com/leonccunha21) e por quem contribuir · [MIT](LICENSE)**

Se o zm-pro te poupou um dia, um [café](https://www.buymeacoffee.com/zmcompanh) mantém as releases vindo. Perguntas? [Discussions](https://github.com/leonccunha21/zm-skills/discussions).

</div>
