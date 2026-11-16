# Seu primeiro dia com o zm-pro

> Do zero ao primeiro commit funcional, sem jargão. 15–20 minutos. Se você nunca abriu um projeto antes, este é o caminho.

Versão em inglês: [for-humans.md](for-humans.md) · O que é cada guia: [para-leigos.md](para-leigos.md) · Ambiente completo: veja o README do repositório.

## Antes de começar

- **Git instalado** — `git --version` no terminal. É por ele que o projeto "lembra" de tudo.
- **Node 18+** — `node --version`. O validador e o instalador do kit usam Node. Nada de runtime seu projeto precisa carregar.
- **Um harness de IA autenticado** — o programa que você usa para conversar com o agente (ex.: OpenCode). O OpenCode oferece modelos gratuitos; outros, como o Claude Code, costumam exigir plano pago. Os preços mudam o tempo todo — confira o plano atual do seu provedor antes de se comprometer. **O kit é grátis, MIT, para sempre.**

## Passo 1 — copie o kit para o seu projeto (2 min)

Dentro do seu projeto:

```bash
mkdir -p .agents/skills
cp -r <caminho>/zm-pro .agents/skills/zm-pro
```

No OpenCode, a skill é descoberta automaticamente. Em dúvida: pergunte para o seu agente "você carregou a skill zm-pro?" — ele sabe responder; se ele não souber, o caminho está errado (`.agents/skills/zm-pro/SKILL.md` deve existir no seu projeto).

## Passo 2 — deixe o agente te entrevistar (2 min)

Peça: *"Use o zm-pro. Quero começar este projeto do zero."*

O agente vai ler os seus arquivos de regras e te fazer perguntas. Responda com fatos do projeto — e se não souber alguma resposta, diga **"não sei ainda"**. O agente registra como pendência; não invente resposta.

## Passo 3 — os dois arquivos que mandam no projeto (3 min)

- **`RULES.md`** — as regras invioláveis do projeto. Ex.: "nunca mexa no módulo de pagamentos", "sempre rode os testes antes de commit", "nada de biblioteca nova sem decisão sua".
- **`AGENTS.md`** — os comandos reais do projeto (testes, lint, build). Não tem? Marque `n/a` e diga o motivo — não invente comando que você não pode rodar.

Preencha só o que importa. Regra de ouro do kit: **um fato, um lugar, um dono.**

## Passo 4 — rode o validador (1 min)

```bash
npm run validate
```

Você precisa ver: `ok - zm-pro íntegro`. Esse comando é a garantia de que o kit chegou completo na sua máquina — mostre a saída colada também para o agente (o kit funciona por evidência, então dê a ele evidência).

## Passo 5 — sua primeira tarefa (10 min)

Peça uma **tarefa pequena** para o seu agente. Exemplos:

- "Adicione um teste para o cálculo de desconto"
- "Corrija o alinhamento do rodapé no mobile"
- "Explique, em 5 linhas, como funciona este projeto"

Observe o ciclo:

1. Ele lê README/AGENTS/RULES antes de tocar em qualquer coisa
2. Faz a **menor mudança possível** (sem "já que estou aqui…")
3. Roda os comandos e **cola a saída**
4. Entrega um registro curto: o que mudou, o que foi testado, o que **não** foi testado

Se ele disser "pronto" **sem colar saída nenhuma**, responda: *"Qual comando você rodou e qual foi a saída?"* — se não houver, o trabalho não está pronto. Isso é o kit funcionando, não uma falha.

## Segurança em uma linha

**Nunca cole senha, chave de API, token ou dado de cliente no chat, no código ou em commits.** Se o agente pedir, recuse — isso é certo e você pode auditar por que recusou.

## Se algo quebrar

- `git status` mostra **tudo** que mudou
- `git restore .` **desfaz tudo** — nada foi para o ar; isso só acontece em branch
- Commit antes de pedir mudanças maiores: você sempre pode voltar
- Commit pequeno > commit grande: menos risco, mais de volta

## Glossário de sobrevivência

| Termo | Significado simples |
|---|---|
| **Agente** | a IA que lê e escreve código sob o seu comando |
| **Harness** | o programa onde o agente vive (OpenCode, Claude Code, Cursor…) |
| **Skill** | um pacote de instruções que o agente lê sob demanda |
| **Router** | o arquivo de navegação do kit (`SKILL.md`) — diz qual guia carregar |
| **Gate** | verificação que **bloqueia** entrega ruim (teste falhando = não entrega) |
| **Evidência** | saída de comando colada — nunca a promessa de que funciona |
| **ADR** | registro de decisão (o *porquê* de cada decisão importante) |
| **Rollback** | desfazer mudança com segurança, voltar ao estado anterior |
| **Commit** | ponto salvo no histórico do projeto (o "ctrl+s" com história) |
| **Trilha (track)** | o caminho certo para o tipo de tarefa (implementar, corrigir, entregar…) |

## Troubleshooting da primeira sessão

**O agente parece ignorar o skill.**
Reinicie a sessão, depois pergunte: "qual skill você carregou?" Se não souber, confirme que `.agents/skills/zm-pro/SKILL.md` existe e reiniciou. Em último caso, cole o `SKILL.md` no início da conversa.

**`npm run validate` acusou erro.**
A mensagem diz a causa **em português**. Leia a linha `ERRO` e corrija o arquivo citado — ou peça: *"corrija o que o validador acusou"* e cole a saída dele.

**O agente é um terror com permissões.**
É o seu harness, não o kit. Comece com a permissão mais estreita e amplie conforme confia.

**O agente "terminou" e quebrou tudo.**
`git restore .` desfaz tudo. Se o estrago for git-level (commits), peça ajuda — existem botões de emergência no `10-operations.md` (runbook) — mas na primeira sessão, quase nunca vai tão longe.

**Agente travado em loop.**
Peça: "PARE. Resuma o que você fez, em 5 linhas, e o que falta." Quase tudo se resolve com um resumo honesto.

Boa primeira entrega — e que ela venha com evidência.
