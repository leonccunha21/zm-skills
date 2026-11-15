# AGENTS.md — Protocolo do agente neste repositório

> Copie para a raiz do projeto e ajuste os comandos reais. **Regras de ouro:**

1. **Regra #0 — ler antes de agir:** leia `RULES.md`, este arquivo, o `README.md` do projeto e a tarefa (objetivo, arquivos, critérios de aceite) *antes* de qualquer ferramenta. Skill da tarefa, se existir, é carregada antes do primeiro passo.
2. **Uma tarefa por execução.** Não expanda escopo sozinho; fora do escopo = pare e pergunte.
3. **Evidência antes de "pronto":** rode os comandos e cole a saída; sucesso sem evidência é falha de processo.
4. **Menor mudança segura**; teste de regressão quando houver seam.
5. **Protocolo anti-atropelamento:** confira `git status` antes de escrever; commit por pathspec; nunca delete/enterre WIP de outra sessão; `main` só recebe PR aprovado com gates verdes.
6. **Segredos e dados reais nunca** em código, log, commit, screenshot ou ferramenta externa.
7. **Deploy é fail-closed:** gate vermelho bloqueia; emergência é manual e documentada.
8. **Referência ≠ dependência:** catálogos/skills informam; instalar exige decisão explícita (licença + manutenção + custo-zero).
9. **Conflito entre documentos:** `RULES.md` > `AGENTS.md` > skill > catálogo. Se necessário, abra ADR — não improvise por cima de regra escrita.

## Comandos reais do projeto (preencha)

| Ação | Comando |
|---|---|
| Dev | `npm run dev` |
| Typecheck | `npm run typecheck` |
| Testes | `npm run test:all` |
| Lint | `npm run lint` |
| Build (nuvem) | `npm run build:cloud` |
| Build (local) | `npm run build:local` |
| Quality gate | `npm run quality:gate` |
| Security gate | `npm run security:gate` |
| E2E | `npm run e2e` |

## Integridade

- Toda entrega registra: arquivos alterados · comandos executados e resultado · riscos · pendências · evidência.
- Nunca declarar "PASSOU" sem saída de comando. O que não foi testado é dito explicitamente ("não testado: <motivo>").
- Documento de coordenação multi-sessão (`docs/COORDENACAO_AGENTES.md`), quando existir, é o caminho de encontro — frentes, donos de arquivo, ordem de escrita.
- Ambiente: editar em LOCAL; produção/homologação só com aprovação e checklist de release.
