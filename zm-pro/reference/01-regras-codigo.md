# 01 — Regras de código e gates

Como escrever código que sobrevive a produção. Vale para qualquer stack; os exemplos neutros assumem TypeScript/Node, que é a base recomendada — adapte, não relaxe.

## Princípios

1. **Menor mudança segura.** Resolva o problema, nada além. Refatorar de carona aumenta risco e dificulta review. Se vir algo errado fora do escopo: registre como pendência, não corrija agora.
2. **Sem over-engineering.** (Ponytail, GSTACK, superpowers, Matt Pocock Skills — referências nomeadas no catálogo.) Nada de camada, abstração ou dependência "prevendo o futuro". YAGNI com duas exceções: seam para teste e contrato público.
3. **Contratos explícitos.** Interfaces, tipos e schemas (zod ou equivalente) na fronteira: entrada HTTP, leitura/escrita de banco, mensagem de fila, env vars. Validar na entrada, tipar no interior, nunca confiar em dado externo.
4. **Erro é parte do design.** Todo caminho de falha tem estado definido: a UI mostra erro acionável (PT-BR), o log registra contexto, o chamador decide retry/rollback. Nenhum `catch` vazio.
5. **Tarefas/migrations reversíveis.** Roteiro + rollback + teste em toda migration de schema; auditoria e soft-delete/tombstone para dados de negócio; nunca `delete` físico onde há histórico.

## Baseline recomendada (não obrigatória)

React 19 + TypeScript estrito + Vite + Tailwind v4 + PWA; animações comedidas; ícones padronizados. Banco relacional com RLS/autorização server-side (Neon Postgres ou equivalente); mutação por operação auditável. Validação de schema com zod. Ícones e toasts consistentes. Dois builds (nuvem/local) se o produto tiver duas edições — um verde não comprova o outro.

## Gates obrigatórios antes de entregar

| Gate | Quando | Comando típico |
|---|---|---|
| Typecheck estrito | toda mudança | `npm run typecheck` (ou `tsc --noEmit`) |
| Suíte de testes | toda mudança | `npm run test:all` |
| Build da(s) edição(ões) afetada(s) | mudança de código/deps/assets | `build:cloud` e/ou `build:local` |
| Quality gate | tocou dependências ou baseline | `quality:gate` |
| Security gate | tocou dependências, auth, schema | `security:gate` |
| E2E | UI, fluxo comercial, sync, licença, offline | `npm run e2e` |

Um gate vermelho **bloqueia entrega**. Se não dá para rodar algum (PC real, segundo dispositivo, homologação manual), registre em pendências e diga explicitamente que não foi verificado.

## Dependências

Antes de adicionar qualquer dependência: (1) a funcionalidade já existe via stdlib ou código local? (2) licença compatível (MIT/Apache/BSD; cuidado AGPL/GPL/CC-BY-SA)? (3) mantida (commits recentes, issues respondidas)? (4) custo-zero? (5) peso no bundle/install? Se qualquer resposta for "não" ou "não sei", não adicione. Fixe versões; rode o scanner de segredos/vulnerabilidades no CI.

## Definição de pronto (resumo — ver `templates/DEFINICAO-DE-PRONTO.md`)

Typecheck + testes + build verdes com saída registrada · nenhum segredo/PII introduzido · migration com rollback · docs/melhorias/pendências atualizadas no mesmo commit · evidência anexada.

## Anti-padrões (rejeitar em review)

- `any` sem justificativa; `@ts-ignore` sem comentário com motivo e link/issue
- Duplicação impossível de evitar mas não registrada (ADR)
- Dependência adicionada "porque está no catálogo"
- Lógica de negócio no componente de UI; segredo ou URL de produção no código
- `git push` com teste vermelho; "configurei no meu PC" como validação
- Silenciar erro (`catch {}`, `|| true`) para fazer gate passar
