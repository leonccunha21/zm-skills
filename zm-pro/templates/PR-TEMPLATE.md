## Resumo

<!-- O que muda e por quê, em 3–5 linhas. Se o contexto for longo, aponte para o ADR/issue. -->

## Tipo de mudança

- [ ] feat (nova funcionalidade)  - [ ] fix (correção)  - [ ] refactor (sem mudança de comportamento)
- [ ] chore/docs/build/ci         - [ ] security        - [ ] breaking change (detalhar abaixo)

## Como testar

```
<!-- passos exatos, com setup mínimo -->
1.
2.
3.
```

- [ ] Verifiquei em viewport 360px e desktop
- [ ] Teclado + leitor de tela (ou axe) sem regressões

## Verificação executada (saída real)

<!-- Cole: typecheck, testes, build(s), e2e, gates. Nada de "OK" mudo. -->

## Evidência

<!-- Screenshot/vídeo com dados fictícios, saída de comando, link de CI -->

## Riscos e rollback

- Risco: <…>
- Rollback: <tag/branch anterior / migration down / flag>
- Impacto em dados/migrations: <nenhum | migration NNNN, com down testado>

## Pendências

<!-- o que fica para depois, com dono; o que depende de ambiente real -->

## Checklist do autor

- [ ] `RULES.md` e `AGENTS.md` respeitados; RULES tem precedência em caso de conflito
- [ ] Sem segredo/PII; fixtures sintéticas; scan de segredos limpo
- [ ] Autorização server-side revisada (recurso de outra conta falha) — se tocou dados
- [ ] Migration com rollback testado — se tocou schema
- [ ] Registro de entregas / CHANGELOG / docs atualizados no mesmo PR
- [ ] `DEFINICAO-DE-PRONTO.md` marcado
- [ ] Telas com UI: os 4 estados (vazio/carregando/erro/sucesso) implementados

## Revisor

- [ ] Revisei a diff inteira, não só os arquivos tocados por mim
- [ ] Gates verdes no CI; evidência bate com a diff
- [ ] Escopo não expandiu além do objetivo do PR
