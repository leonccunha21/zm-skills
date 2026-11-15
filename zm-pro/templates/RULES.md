# RULES.md — Regras de arquitetura e segurança (o que o agente NUNCA faz)

> Copie para a raiz do projeto e ajuste nomes/stack. Estas regras **vencem** skills, catálogos e conveniência. Violação = PR rejeitado.

## Arquitetura

1. Frontend em `src/` com componentes por feature; lógica de negócio em módulos puros (`src/domain`/`src/lib`), nunca dentro de componente.
2. Dados comerciais persistem em banco relacional com **autorização server-side e RLS**; o cliente nunca decide `account_id` de leitura/escrita.
3. Toda mutação de negócio passa por operação auditável (quem, quando, o quê, valor anterior/posterior).
4. Migrations são scripts **com rollback testado**; sem `down`, a migration não entra.
5. Exclusão de dado de negócio é soft-delete/tombstone; nunca `DELETE` físico onde há histórico, auditoria ou sync.
6. Offline (quando aplicável): fila sobrevive a reload; nada é dado como "sincronizado" antes da confirmação da nuvem; nunca `deleteMissing()` cego no pull.
7. Contratos externos (API, webhook, fila, arquivo) têm schema validado na fronteira (zod ou equivalente); segredo jamais em código-fonte.
8. Dependência nova só com: funcionalidade inexistente no projeto + licença compatível + manutenção ativa + custo-zero + peso justificável.

## Segurança e dados

9. Segredo/PII fora de: código, commit, log, fixture, screenshot, prompt para ferramenta externa. Scanner de segredos no gate.
10. Falha de autorização **nega por default** (fail-closed) — nunca "em caso de dúvida, deixa passar".
11. Senha com hash forte (argon2/bcrypt), sessão curta, rate limit; cripto sempre de biblioteca madura.
12. Headers de segurança (CSP, nosniff, HSTS, Referrer-Policy) e CORS restritivo habilitados antes do release.
13. Dados de produção nunca em dev/teste; fixtures sintéticas; dumps fora do Git.
14. Dado pessoal: minimização + base legal + retenção + direitos do titular — ver skill LGPD do projeto; engenharia nunca substitui o Encarregado/jurídico.

## Processo

15. `main` protegida: só entra via PR aprovado, gates verdes, checklist de entrega preenchido.
16. Sem gate vermelho em produção. Emergência: manual, documentada, pós-mortem no dia útil seguinte.
17. Custo-zero por padrão; serviço pago exige decisão escrita do dono do projeto.
18. Toda divergência relevante (código × documento) vira ADR — decisão reescrita, não improvisada por cima.

## Produto (ajuste ao seu domínio)

19. UI em PT-BR, mobile-first, alvo de toque ≥ 44px, `R$ 1.234,56`, data `dd/mm/aaaa`, formatação brasileira.
20. Uma ação primária por tela; os quatro estados (vazio, carregando, erro, sucesso) implementados antes de merge de UI.
