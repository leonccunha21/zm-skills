<div align="center">

# zm-pro

**o playbook de projeto profissional para agentes de IA**

[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green.svg)](LICENSE)
[![Versão](https://img.shields.io/badge/vers%C3%A3o-0.4.0-blue.svg)](CHANGELOG.md)
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

```
zm-pro/                        # a skill — copie esta pasta para seu projeto/harness
├── SKILL.md                   # router: quando usar, o ciclo, o índice
├── reference/                 # 13 guias focados, carregados sob demanda
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
│   └── 13-token-economy.md        # o contexto é dinheiro: leitura sob demanda, cache, subagentes com escopo estreito
└── templates/                 # pontos de partida genéricos e copiáveis
    ├── AGENTS.md · RULES.md · ADR.md · DEFINITION-OF-DONE.md · DELIVERY-CHECKLIST.md · PR-TEMPLATE.md
    └── prompts/                   # prompts de delegação: implementar, corrigir, revisar, release, auditoria LGPD
(examples/minimal-project na raiz do repositório: projeto inicial preenchido — AGENTS.md real, ADR real e DELIVERY-LOG com evidência)
```

## Instalação

> Evidência por harness — [docs/harness-compatibility.md](docs/harness-compatibility.md). Automatizado: `node scripts/install.mjs opencode` (= `npm run install-skill`); integridade para releases: `npm run checksums`.

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

## Uso rápido

> Novo aqui? Leia primeiro o [docs/para-leigos.md](docs/para-leigos.md) — o kit em linguagem simples.

Prompt para uma tarefa real:

> Use a skill zm-pro. Leia RULES.md e AGENTS.md primeiro. Objetivo: <X>. Arquivos no escopo: <…>. Critérios de aceite: <…>. Rode os comandos de verificação e cole a saída real. Não declare sucesso sem evidência.

## O que o zm-pro não é

- **Não é framework, biblioteca ou CLI** — é documentação-como-skill. Sem runtime, sem rede, sem telemetria, sem dependências.
- **Não é assessoria jurídica** — a trilha de privacidade produz rascunhos de engenharia e controles; conclusão jurídica é do seu Encarregado/DPO.
- **Não substitui as regras do seu projeto** — ele se curva a elas por design.

## FAQ

**Funciona offline?** Sim. Tudo é Markdown local.
**Envia dados para fora?** Não. O repositório não contém código executável além do validador (só para contribuidores).
**Posso forkar e adaptar?** Sim — MIT. Mantenha o aviso de licença e diga aos usuários o que mudou.
**Funciona com minha stack?** As regras são agnósticas; os exemplos assumem TypeScript/Node, mas adaptam-se a Python, Go, PHP etc.
**Tem um exemplo de início rápido?** Sim — `examples/minimal-project/`: AGENTS.md preenchido, um ADR real e um DELIVERY-LOG com evidências para copiar e adaptar.

## Contribuição e releases

Veja [CONTRIBUTING.md](CONTRIBUTING.md) (em inglês). Semver; toda mudança via PR com o validador verde (`npm run validate`); histórico em [CHANGELOG.md](CHANGELOG.md).

---

<div align="center">

**Feito por [ZM](https://github.com/leonccunha21) e por quem contribuir · [MIT](LICENSE)**

Se o zm-pro te poupou um dia, um [café](https://www.buymeacoffee.com/zmcompanh) mantém as releases vindo.

</div>
