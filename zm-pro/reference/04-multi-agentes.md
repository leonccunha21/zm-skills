# 04 — Coordenação multi-agente

O modelo de trabalho do time não é "swarm de agentes": é **um agente-coordenador, uma tarefa por vez, com escopo escrito**. Simplicidade vence sofisticação — mas quando vários agentes/sessões tocam o mesmo projeto, estes são os protocolos.

## Papéis

- **Coordenador (humano ou sessão principal)**: decide a tarefa única, define objetivo, arquivos relacionados e critérios de aceite; delega; verifica. Nunca executa "só mais uma coisa" enquanto o especialista trabalha.
- **Especialista (sessão/subagente)**: executa 1 tarefa, no seu escopo de arquivos, e devolve relatório (o que mudou, como verificou, o que não pôde).
- **Revisor**: leitura fria do diff — aponta faltas, nunca reescreve no escuro.

## Regras de operação

1. **Uma tarefa por sessão.** Prompt de delegação contém: objetivo, arquivos/áreas, critérios de aceite, máximo 3 referências (nome + link), comandos de verificação. Nada de "faça o app inteiro".
2. **Escopo declarado.** O especialista lista os arquivos que vai tocar; quem precisa de arquivo fora do escopo **para e pergunta** — não expande sozinho.
3. **Uma frente por vez por árvore de trabalho.** Sessões paralelas dividem por frentes A/B com lista de arquivos disjunta (`docs/COORDENACAO_AGENTES.md`). Se um arquivo é compartilhado, há acordo explícito de quem escreve primeiro.
4. **Nunca enterrar WIP alheio.** Coordenador confere `git status` antes de mexer; commit por pathspec (`git add <arquivos>`, nunca `git add -A` com trabalho de outra sessão por perto).
5. **Handoff com estado.** Ao pausar/passar adiante: o que está pronto, o que falta, o que foi testado (e como), o que está arriscado. Sem handoff escrito, a próxima sessão refaz ou quebra.
6. **Comunicação é artefato.** Decisão importante vira ADR/registro no repo — nunca só a conversa. Chat some; repositório fica.

## Prompt-modelo para delegar a agente

> Leia `RULES.md`, `AGENTS.md`, o guia do projeto e esta tarefa. Objetivo: <X>. Arquivos sob escopo: <lista>. Critérios de aceite: <lista>. Rode <comandos> e reporte a saída real. Não instale nada do catálogo sem decisão; se precisar de algo fora do escopo, pare e pergunte. Não declare sucesso sem evidência.

## Quando escalar para orquestração formal

Só quando o fluxo real pedir: pipelines com handoffs (Microsoft Agent Framework — human-in-the-loop, checkpoints), grafos com estado e retomada (LangGraph), ou automação determinística (n8n/Temporal). Dashboards multi-agente (open-multi-agent, agent-status-dashboard, office virtual) são **referência de UX**, não dependência. Runtimes de swarm (Ruflo e afins) exigem decisão explícita e análise de licença/custo antes de qualquer experimento — hoje, fora do escopo dos produtos ZM.

## Anti-padrões

- Dois agentes editando o mesmo arquivo "em paralelo" sem acordo
- Coordenador que também executa (gargalo e perda de verificação)
- Tarefa sem critério de aceite → agente declara "pronto" prematuramente
- Subagente spawning subagente sem budget nem plano de merge
- Loop de tentativa/erro sem limite de iterações nem critério de parada
- Sumário de sessão como única memória (vai para o repo: ADR, melhorias, pendências)

## Fechando uma sessão multi-agente

1. `git status` limpo ou WIP proposital documentado e com donos nomeados
2. Comandos de verificação rodados, saída colada no registro da entrega
3. `docs/COORDENACAO_AGENTES.md` (se houver frentes) e changelog/registro atualizados
4. Próxima tarefa apontada — ou explicitamente encerrada
