# zm-skills — Kit de projeto profissional para agentes de IA

Kit de skills **próprio e completo** para elevar qualquer projeto de software ao nível profissional: regras de código, padronização, layout/UI em PT-BR, coordenação multi-agente, memória de projeto, segurança, testes, entrega e operação. Feito para funcionar no **OpenCode** (e em qualquer harness que leia o formato aberto de skills `SKILL.md`, como Claude Code, Codex, Cursor e Gemini CLI).

**Filosofia (não negociável):**

1. **Referência ≠ dependência ≠ instalação.** O kit ensina *como trabalhar*; ele nunca autoriza adicionar biblioteca, serviço pago ou runtime ao produto.
2. **Divulgação progressiva.** O `SKILL.md` é um router curto; cada área detalhada vive em `reference/` e só carrega quando a tarefa pede. Contexto enxuto, atenção preservada.
3. **Evidência antes de "pronto".** Nenhuma entrega sem comandos executados de fato e saída registrada. Nunca "PASSOU" sem prova.
4. **Custo-zero por padrão.** Nada pago sem decisão explícita do dono do projeto; licença verificada antes de incorporar qualquer código.
5. **PT-BR na interface; inglês no código e nos identificadores.**

## O que vem no pacote

```
zm-skills/
├── README.md                  ← você está aqui
├── LICENSE                    ← MIT
├── CHANGELOG.md
└── zm-pro/                    ← a skill (copie esta pasta inteira)
    ├── SKILL.md               ← router: quando usar + índice + regras universais
    ├── reference/             ← 10 guias detalhados, carregados sob demanda
    │   ├── 01-regras-codigo.md
    │   ├── 02-padronizacao-projeto.md
    │   ├── 03-layout-ui.md
    │   ├── 04-multi-agentes.md
    │   ├── 05-memoria.md
    │   ├── 06-lgpd.md
    │   ├── 07-seguranca.md
    │   ├── 08-testes-qualidade.md
    │   ├── 09-entrega-git.md
    │   └── 10-operacao-observabilidade.md
    └── templates/             ← copiáveis para o projeto de destino
        ├── AGENTS.md          ← protocolo de início e integridade do agente
        ├── RULES.md           ← regras de arquitetura e segurança
        ├── ADR.md             ← registro de decisão arquitetural
        ├── DEFINICAO-DE-PRONTO.md
        ├── CHECKLIST-ENTREGA.md
        └── PR-TEMPLATE.md
```

## Instalação

### OpenCode — global (todos os projetos do usuário)

```powershell
Copy-Item -Recurse ".\zm-pro" "$env:USERPROFILE\.config\opencode\skills\zm-pro"
```

### OpenCode — por projeto (recomendado para piloto)

```powershell
Copy-Item -Recurse ".\zm-pro" "<seu-projeto>\.agents\skills\zm-pro"
```

A skill é descoberta automaticamente; o corpo só carrega quando o agente invoca a tool `skill`. Nenhuma configuração força o carregamento sem necessidade.

### Outros harnesses (Claude Code, Codex, Cursor, Gemini CLI)

O formato `SKILL.md` (frontmatter `name` + `description`) é o padrão aberto [Agent Skills](https://github.com/agentskills/agentskills). Copie `zm-pro/` para a pasta de skills do harness, ou aponte o `AGENTS.md`/`CLAUDE.md` do projeto para `zm-pro/SKILL.md` como referência de procedimento.

### Atualizar

```powershell
# sobrescreva a pasta copiada com a versão nova
Copy-Item -Recurse -Force ".\zm-pro" "<destino>\zm-pro"
```

## Como usar

1. Numa tarefa real, peça ao agente: *"use a skill zm-pro"* — ou deixe a descrição disparar sozinha (a skill é model-invoked).
2. O agente lê o `SKILL.md`, identifica a trilha da tarefa (kickoff, implementação, revisão, entrega, LGPD) e carrega **só** as `reference/` relevantes.
3. Ao final, a entrega segue `templates/CHECKLIST-ENTREGA.md`: arquivos alterados, comandos executados + saída, riscos, pendências, evidência.

**Quer que a skill só dispare quando você digitar o nome?** Adicione `disable-model-invocation: true` ao frontmatter do `SKILL.md` — ela vira user-invoked (custo de contexto zero).

## Relação com o LGPD Skills

O kit **não duplica** o [lgpd-skills](https://github.com/goul4rt/lgpd-skills) (MIT): `reference/06-lgpd.md` ensina *quando* e *como* invocar as 19 skills `lgpd-*` e trata o limite do que é rascunho de engenharia vs. conformidade jurídica. Instale as skills LGPD no projeto como feito no `mei-pro-web` (`.agents/skills/lgpd-*`).

## Versionamento e contribuição

- Versionamento semântico; mudanças em `SKILL.md`/`reference/` entram via PR com checklist próprio (`templates/CHECKLIST-ENTREGA.md`).
- Uma regra por lugar (fonte única de verdade); `SKILL.md` nunca repete o que está em `reference/`.
- Referência nova entra primeiro no catálogo de referências do time; só vira regra no kit se provar valor num projeto real.

## Licença

MIT — veja [LICENSE](LICENSE). Reutilize, copie e adapte em projetos comerciais mantendo o aviso de copyright.
