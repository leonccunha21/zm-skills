# Melhorias e plano de evolução do zm-pro

> **Backlog pendente.** Os itens concluídos foram removidos em 2026-11-16. A evidência de cada entrega (status, comandos e resultados) está preservada no histórico do git (`git log -- MELHORIAS.md`) e no `CHANGELOG.md`. Este arquivo lista somente o que falta fazer.
>
> Marcar um item como concluído somente após implementação e evidência reproduzível (ver critérios na seção 1). Fases concluídas do roadmap (1, 2 e 4) foram removidas; ver seção 6.

## 1. Critérios permanentes de qualidade

Uma melhoria só deve ser marcada como concluída quando:

1. O problema ou oportunidade estiver descrito.
2. A alteração estiver implementada no arquivo responsável.
3. Os testes pertinentes tiverem sido executados.
4. A saída real dos comandos estiver registrada.
5. A documentação relacionada estiver atualizada.
6. Não houver regressão conhecida sem justificativa.
7. O changelog for atualizado quando a mudança fizer parte de uma release.
8. O status for verificável por outra pessoa.

### Severidade sugerida

- **P0 — Bloqueador:** instrução incorreta, risco de segurança, instalação quebrada, release enganosa ou perda de dados.
- **P1 — Alta:** falha de validação, incompatibilidade relevante, documentação que impede uso ou lacuna importante de qualidade.
- **P2 — Média:** melhoria de experiência, cobertura adicional, exemplos e automação útil.
- **P3 — Baixa:** refinamento editorial, conveniência ou ideia experimental.

## 2. Princípios que não devem ser sacrificados

- Simplicidade antes de complexidade.
- Evidência antes de alegação.
- Segurança e privacidade por padrão.
- Compatibilidade declarada com honestidade.
- Nenhum custo ou serviço pago sem autorização explícita.
- Nenhuma dependência desnecessária.
- Nenhuma telemetria escondida.
- Nenhuma alteração destrutiva ou sobrescrita silenciosa.
- Regras do projeto consumidor acima das regras genéricas do kit.
- Uma fonte de verdade por informação.
- Documentação que corresponda ao comportamento real do código.
- **Priorização:** reduzir risco de comportamento incorreto, perda de dados, exposição de informações ou falsa alegação de compatibilidade tem prioridade sobre adicionar guias ou aumentar o repositório.

## 3. Compatibilidade com agentes e harnesses

A matriz atual (`docs/harness-compatibility.md`) reconhece OpenCode como o único harness testado de ponta a ponta e os demais como não verificados. Preservar essa honestidade.

- [ ] Testar OpenCode, Claude Code, Codex CLI, Cursor e Gemini CLI em versões identificadas.
- [ ] Adicionar relatos da comunidade com evidências: versão, SO, caminho instalado, prompt usado, comportamento observado e logs sem dados sensíveis.

**Critério de conclusão:** cada status da matriz corresponde a um teste documentado ou permanece explicitamente como não verificado.

## 4. Testes automatizados e CI

- [ ] Adicionar verificação de Markdown e spellcheck com dicionário técnico pt-BR/en-US, sem bloquear falsos positivos sem revisão. *(não feito: sem dicionário técnico offline no ambiente; risco de milhares de falsos positivos sem um dicionário curado)*

## 5. Distribuição, releases e adoção

- [x] Manter PRs de catálogos comunitários atualizados e registrar status real (aberto, aprovado, mesclado ou fechado). *(registrado em `docs/distribution.md` em 2026-11-16: Prat011/awesome-llm-skills #337 aberto; sickn33/agentic-awesome-skills #2351 fechado sem merge, com pedido de bundle auto-contido e teste do bundle exato; nenhuma listagem aprovada)*
- [x] Medir adoção com sinais públicos e voluntários (estrelas, forks, relatos, PRs); não adicionar telemetria à skill. *(baseline 2026-11-16 registrada em `docs/distribution.md`: 1 star, 0 forks, 1 watcher/0 subscribers, 0 issues reais, 1 submission de catálogo aberta; método reproduzível documentado; nenhum dado coletado dentro da skill; atualizar a cada release)*

## 6. Roadmap: fases em aberto

**Fase 3 — Compatibilidade comprovada.** Conteúdo e critérios na [seção 3](#3-compatibilidade-com-agentes-e-harnesses): executar a matriz de testes nos harnesses prioritários e publicar relatos da comunidade com evidências.

**Fase 5 — Maturidade contínua.**

- [ ] Revisar issues recorrentes e incorporar melhorias com evidência. *(revisão 2026-11-16: nenhuma issue real existe — os 8 itens no endpoint `issues?state=all` são todos PRs, 6 do autor + 2 do dependabot; nada recorrente a incorporar; item permanece aberto até haver issues reais)*

**Fases concluídas (removidas):** 1 — Correções de confiança; 2 — Qualidade técnica; 4 — Experiência e adoção. Entrega e evidências estão no `CHANGELOG.md` e no histórico do git.

## 7. Avaliação comportamental da skill

Validar Markdown e instalação não prova que um agente entendeu o router, escolheu as referências corretas ou entregou engenharia melhor. O diferencial do zm-pro precisa ser demonstrado por resultados observáveis. Metodologia em [`EVALUATIONS.md`](EVALUATIONS.md).

- [ ] Avaliar se o agente identifica o ambiente, inspeciona o projeto, respeita instruções locais e evita assumir stack ou ferramentas inexistentes.
- [ ] Avaliar seleção correta e mínima das referências, sem carregar todos os guias indiscriminadamente.
- [ ] Medir sucesso, regressões, violações de restrições, contexto irrelevante, comandos inventados, alterações fora do escopo e qualidade da evidência final.
- [ ] Comparar tarefas equivalentes com e sem zm-pro, mantendo modelo, harness, contexto, orçamento e critérios.
- [ ] Repetir cenários quando houver variabilidade; reportar mediana, dispersão e falhas graves, não somente a melhor execução.

**Critério de conclusão:** cada release relevante possui relatório reproduzível com casos, ambiente, resultados, falhas conhecidas e comparação com a versão anterior.

## 8. Robustez, recuperação e execução em ambientes restritos

- [ ] Testar caminhos com espaços, caracteres Unicode, links simbólicos, permissões limitadas e diretórios protegidos. *(parcial: espaços, Unicode, symlinks e destino inválido cobertos por `tests/install.test.mjs`; permissões limitadas não testadas — o Windows ignora o atributo read-only em pastas)*

## 9. Critérios de aceite para considerar o zm-pro completo

O projeto não deve ser considerado completo por quantidade de arquivos ou número de guias. A conclusão deve depender de evidências.

- [ ] Router conciso, com roteamento correto e carregamento progressivo demonstrados em avaliações.
- [ ] Suíte comportamental com baseline e relatório reproduzível.

**Definição de completo:** o zm-pro será considerado pronto para uso profissional quando uma pessoa independente conseguir instalá-lo, configurá-lo, utilizá-lo em um projeto real, avaliar seus resultados, atualizá-lo e removê-lo com segurança, seguindo a documentação e sem depender de conhecimento informal do mantenedor.

## 10. Bugs e defeitos encontrados (backlog acionável)

Achados durante a sessão 2026-11-16 (pilot `eval-001`, OpenCode 2.3.0, Windows). Evidência: `docs/evaluation-results/pilot-inkling-eval-001.md` e `.raw.log` local (gitignored).

- [x] **`evaluate-run.mjs` saía com exit 0 mesmo quando o harness falhava.** *(corrigido em 2026-11-16: se `result.error`, `result.signal` ou `status !== 0`, o runner imprime `evaluate-run: <motivo>` e sai com 1, mantendo transcript e relatório no disco; coberto por `tests/evaluate-run.test.mjs` — 5 testes originais do runner (dry-run, usage, argv literal, scaffold, caminho feliz) + 2 novos de caminho de falha (harness inexistente, exit ≠ 0); suite agora registrada em `npm test`)*
- [x] **Comando documentado do pilot quebra no Windows (`spawnSync opencode ENOENT`).** O shim npm (`opencode.cmd` / `opencode.ps1`) não é resolvível pelo `spawn` do Node sem shell; o exemplo do README falha silenciosamente no Windows (ver item acima). *(parcialmente corrigido em 2026-11-16: workaround documentado em `docs/evaluation-results/README.md` e `EVALUATIONS.md` — argv aponta para `node_modules/@opencode/cli/bin/opencode.exe`, sem shell; o bug do exit 0 permanece no item acima.)*

---

**Nota de manutenção:** este arquivo é um backlog, não uma lista de defeitos confirmados. Antes de implementar cada item, reproduzir o comportamento, confirmar se o problema ainda existe na branch alvo e atualizar este documento com status, evidência e commit/release correspondente. Itens concluídos foram removidos; consulta de evidências passadas se faz pelo git, não por reabertura sem reavaliação.
