# Checklist de entrega (por entrega — cole no PR ou no registro)

```
ENTREGA: <uma linha: o que esta entrega faz>
DATA: AAAA-MM-DD   SHA(S): <sha>   ESCOPO/FRENTE: <arquivos/módulos>

OBJETIVO E CRITÉRIOS DE ACEITE
- <objetivo>
- <critério 1> / <critério 2> / …

ARQUIVOS ALTERADOS
- <caminho> — <o que mudou e por quê>
(uma linha por arquivo; se a lista explodiu, a entrega era grande demais)

COMANDOS EXECUTADOS E RESULTADO REAL
- <comando> → <passou/falhou + resumo da saída ou SHA do log>
- <comando> → …

NÃO VERIFICADO (explicitamente)
- <o que ficou sem teste e por quê — PC real, homologação, decisão de negócio…>

RISCOS E ROLLBACK
- Risco: <…> → Mitigação: <…>
- Rollback: <tag/branch anterior, migration down, flag…>

PENDÊNCIAS
- <pendência + dono + o que destrava>

EVIDÊNCIA DE FUNCIONAMENTO
- <saída de comando colada / link de gravação / print com dados fictícios>

DEFINIÇÃO DE PRONTO: <anexar DEFINICAO-DE-PRONTO.md marcado>
```

Regras de preenchimento:

1. **Campos vazios não existem.** Se não se aplica, escreva "n/a — motivo".
2. **Comando listado sem saída não conta.** Cole a saída real (ou o trecho relevante).
3. **Prometeu, marca; não verificou, declara.** Checklist é contrato com o revisor.
4. Uma entrega = um objetivo. Duas tarefas no mesmo checklist = separar em duas entregas.
5. Dados reais de clientes nunca aparecem em evidência — use fixtures sintéticas ou screenshots sanitizados.
