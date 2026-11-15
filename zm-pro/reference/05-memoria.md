# 05 — Memória de projeto

Dois erros simétricos destroem projetos: (a) decidir sem memória — o time redecide o já decidido; (b) lembrar demais sem disciplina — contexto se acumula até ninguém achar nada. As **três camadas** abaixo, em ordem de autoridade.

## Camada 1 — Memória institucional (versionada, fonte de verdade)

O que sobrevive a qualquer sessão/modelo/PC. Mora no repositório:

- `README.md` — o que é o projeto e como rodá-lo
- `RULES.md` / `AGENTS.md` — o que não pode acontecer
- `docs/adr/NNNN-*.md` — **por quê** de cada decisão relevante (contexto → opções → decisão → consequências)
- Registro de entregas (`melhorias` na convenção do time): SHA + data + evidência + pendências — a linha do tempo de "o que foi feito e provado"
- `PENDENCIAS_*.md` — o que falta e por quê (ambiente real, homologação, decisão de negócio)
- `docs/referencias-github.md` — o que do catálogo está adotado/observação/descartado **neste** projeto

Regra: se um agente duvida de algo do projeto, a resposta está aqui — não na conversa. Encontrou divergência entre o registro e o código? O código é a verdade do presente; o registro é a verdade da intenção. Registre a divergência e corrija o documento no mesmo commit.

## Camada 2 — Memória de sessão e coordenação (versionada, efêmera)

- `docs/COORDENACAO_AGENTES.md`: frentes A/B, lista de arquivos por sessão, ordem de escrita
- Handoff de fim de sessão: pronto / falta / verificado / arriscado (ver `04-multi-agentes.md`)
- Notas de trabalho solto só em `*.local.md`/`draft-*.md`, **fora do Git**

Diferença prática: Camada 1 é para o futuro; Camada 2 é para a semana. Ambas vivem no repo; nenhuma vive no chat.

## Camada 3 — Memória estrutural (opcional, sob demanda)

Mapeia o *código* — o que chama o quê — para o agente navegar sem reler tudo:

- **Graphify** / **Codebase Memory MCP**: grafo de dependências código↔docs, com diff como cidadão de primeira classe (reindex incremental)
- **OpenViking**: base de conhecimento em árvore de pastas com recuperação sob demanda (padrão para contexto longo de projeto)
- **Obsidian** como referência conceitual (links + grafo para conhecimento humano)

Antes de adotar qualquer um: licença, funcionamento offline/local, que dados saem do PC (nenhum dado de cliente, token ou dump de produção pode alimentá-los sem decisão explícita e anonimizada), e custo-zero. São **referência e ferramenta opcional**, nunca dependência obrigatória — e nunca destino de dados reais.

## Higiene da memória

1. **Uma fonte de verdade por fato.** Outra menção aponta para ela; nunca repete. Duplicação diverge, divergência confunde agente, confusão destrói confiança no registro.
2. **Poda periódica.** Registro que perdeu relevância (migração concluída, decisão superada) é removido ou arquivado em `docs/adr/` com status `superseded`.
3. **Sedimento é o inimigo.** Toda entrega remove o que invalidou; adicionar é fácil, podar é disciplina.
4. **Data e SHA em tudo.** Sem a data/commit, o registro vira folclore.
5. **Memória de agente ≠ memória de produto.** O prompt/contexto do agente é volátil; o git não é. Decisão importante escrita só em prompt está perdida.
