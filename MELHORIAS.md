# Melhorias e plano de evolução do zm-pro

> Documento vivo de planejamento. Reúne achados da inspeção do repositório, recomendações técnicas, melhorias de produto e critérios verificáveis para transformar o zm-pro em um projeto completo, confiável, fácil de instalar, manter e adotar.
>
> **Escopo desta revisão:** inspeção estática de arquivos disponíveis no GitHub em 16/11/2026. Os itens abaixo não significam que todos os 13 guias, instalações ou harnesses tenham sido executados. Marcar como concluído somente após implementação e evidência reproduzível.

## 1. Objetivo do projeto

Consolidar o zm-pro como um playbook profissional, agnóstico de stack e de harness, que ajude agentes de IA a executar o ciclo completo de engenharia de software com segurança, qualidade, rastreabilidade e uso eficiente de contexto.

O repositório deve oferecer:

- Uma skill central simples de descobrir e carregar.
- Guias especializados, consistentes e sem regras contraditórias.
- Instalação previsível e reversível.
- Compatibilidade comprovada, não apenas declarada.
- Validação automatizada e testes reais.
- Documentação em português e inglês sincronizada.
- Exemplos executáveis e cenários de demonstração.
- Processo transparente de contribuição, segurança e releases.
- Roadmap priorizado, com critérios objetivos de conclusão.

## 2. Achados prioritários já identificados

Estes itens foram observados nos arquivos consultados durante a inspeção inicial.

### P0 — Corrigir inconsistências que afetam a confiança e o uso

- [x] **Atualizar badges de versão nos READMEs.** Os arquivos `README.md` e `README.pt-BR.md` exibem badge estático 0.4.0, enquanto `package.json`, `zm-pro/SKILL.md` e o changelog indicam 0.8.1. Preferir badge dinâmico baseado na última release ou manter uma única fonte de versão.
- [x] **Atualizar a política de segurança.** `SECURITY.md` declara suporte a 0.4.x, embora a versão atual indicada seja 0.8.1. Definir política de versões suportadas coerente com SemVer e releases reais.
- [x] **Corrigir instrução de instalação npm.** O README sugere que `npm run install-skill` equivale à instalação OpenCode, mas o script exige um argumento de harness. O script npm atual não fornece esse argumento. Documentar o comando correto (`npm run install-skill -- opencode`, se validado) ou ajustar o script para fornecer um padrão explícito.
- [x] **Alinhar documentação e comportamento do instalador.** Confirmar que os exemplos de instalação para OpenCode e Claude Code correspondem aos diretórios realmente usados pelo script e aos diretórios reconhecidos por cada versão do harness.
- [x] **Distinguir testes de validação estrutural.** Atualmente `npm test` executa o validador do repositório; isso não equivale a uma suíte de testes unitários do instalador e do validador. Criar testes automatizados reais e deixar os nomes dos comandos inequívocos.

> **Status 2026-11-16** — os cinco itens P0 foram implementados na branch `chore/p0-trust-fixes`.
> Evidência: `npm run validate` → `ok - zm-pro íntegro` (49 arquivos); `npm test` → 15/15 testes passando;
> `npm run install-skill -- opencode --dir <tmp>` → pasta instalada com `SKILL.md` presente.
> Badge dinâmico: `img.shields.io/github/v/release/...` nos dois READMEs. `SECURITY.md`: `0.8.x` suportado.
> Scripted install: `npm run install-skill -- opencode` (separador `--`). `--dir` documentado como raiz do projeto.
> Não testado: descoberta real nos harnesses além do OpenCode 2.3.0 (permanece como declarado em `docs/harness-compatibility.md`).

### P1 — Qualidade da validação e manutenção

- [x] **Fortalecer o validador de Markdown.** Verificar links relativos, imagens, referências, âncoras internas e caminhos com espaços; ignorar blocos de código e diretórios que não fazem parte do conteúdo publicado, como `.git/` e `node_modules/`.
- [x] **Validar frontmatter com regras explícitas.** Cobrir campos obrigatórios, descrição, delimitadores, caracteres especiais e limites do formato Agent Skills. Evitar depender de expressões regulares frágeis para interpretar YAML.
- [x] **Validar cobertura do índice.** Garantir que todas as referências e templates publicados estejam indexados e que nenhum caminho apontado pelo router esteja ausente.
- [x] **Validar sincronização de versões.** Conferir `package.json`, `SKILL.md`, badges, changelog, release e documentação de instalação.
- [x] **Testar instalador sem sobrescrita acidental.** Coberto por `tests/install.test.mjs`: harness inválido, ausência de harness, destino já existente, `--force`, `--global` (com `XDG_CONFIG_HOME` isolado), `--dir` e caminhos com espaços. Windows local; Linux/macOS cobertos pela matriz de CI.
- [x] **Garantir instalação reversível.** Desinstalar = apagar a pasta: teste confirma que todos os arquivos instalados vivem sob o destino e que, após removê-lo, nada resta no projeto.
- [x] **Revisar a opção `--dir`.** Documentada como raiz do projeto (destino: `<dir>/.agents|.claude/skills/zm-pro`) no cabeçalho de `scripts/install.mjs`; testada com caminho absoluto, relativo (`.` a partir do cwd) e com espaços.

> **Status 2026-11-16 — Fase 2 (parcial).** Validador v2: fences ignorados, âncoras (incluindo acentos e `--`), imagens, caminhos percent-encoded, frontmatter com campos obrigatórios/duplicados/limites, índice obrigatório, versão sincronizada (`package.json` × `SKILL.md` × changelog × badges × `SECURITY.md`) e `--json` estável. `SECURITY.md` e `README.pt-BR.md` agora são arquivos obrigatórios.
> Evidência: `npm test` → 26/26; `npm run validate` → `ok - zm-pro íntegro`.
> Não feito ainda: revisão editorial dos 13 guias, templates, workflows (permissões/SHA) e CI real.

## 3. Arquitetura e conteúdo da skill

### Router e carregamento progressivo

- [x] Manter `zm-pro/SKILL.md` curto, orientado a decisão e sem duplicar o conteúdo dos guias.
- [x] Criar uma tabela clara de gatilhos: tarefa → referências obrigatórias → entregável esperado.
- [x] Definir combinações de trilhas para tarefas que atravessam áreas (por exemplo, feature com autenticação e dados pessoais).
- [x] Incluir uma regra explícita para resolver conflito entre referências: regra do projeto primeiro; depois segurança e privacidade; por fim convenções gerais. Registrar a hierarquia sem criar contradições.
- [x] Explicar o que fazer quando `AGENTS.md`, `RULES.md` ou comandos de projeto não existem.
- [x] Definir limite de contexto: carregar primeiro o router, depois somente os trechos necessários das referências; evitar leitura integral desnecessária.

### Revisão dos 13 guias

- [ ] **01 — Code rules:** diferenciar regra obrigatória, recomendação e exceção; explicitar critérios de mudança mínima, regressão e definição de pronto.
- [ ] **02 — Project standards:** alinhar estrutura, documentação, versionamento, changelog, convenções de commit e templates.
- [ ] **03 — Layout UI:** cobrir responsividade, acessibilidade WCAG, teclado, leitores de tela, estados vazios/erro/carregamento, formulários, contraste e testes em viewport real.
- [x] **04 — Multi-agent:** definir limites de delegação, propriedade de arquivos, prevenção de alterações concorrentes, validação do trabalho delegado e protocolo de parada. *(coberto por `zm-pro/reference/04-multi-agent.md`, `scripts/coordinate.mjs`, `tests/coordinate.test.mjs` e `zm-pro/templates/COORDINATION.md`)*
- [ ] **05 — Project memory:** distinguir fatos confirmados, hipóteses e decisões; incluir origem, data, responsável, validade e procedimento de atualização/remoção.
- [ ] **06 — LGPD:** revisar referências legais e datas; separar orientação técnica de aconselhamento jurídico; incluir privacidade desde a concepção, retenção, descarte, operadores e transferências internacionais.
- [ ] **07 — Security:** ampliar ameaças por stack e tipo de aplicação; autenticação, autorização por recurso, sessões, CSRF, XSS, SSRF, upload, dependências, segredos e resposta a incidentes.
- [ ] **08 — Testing quality:** propor estratégia por risco; testes unitários, integração, contrato, E2E, acessibilidade, segurança, migrações e dados sintéticos.
- [ ] **09 — Delivery git:** padronizar branches, commits, revisão, tags, releases, rollback e proteção contra deploy sem aprovação.
- [ ] **10 — Operations:** incluir SLO/SLI quando aplicável, alertas acionáveis, runbooks, backups e teste periódico de restauração.
- [ ] **11 — Architecture:** documentar limites de módulos, dependências, contratos, migrações e critérios para evitar abstração prematura.
- [ ] **12 — Performance:** tornar budgets configuráveis por produto; medir antes de otimizar; cobrir frontend, backend, banco, rede e custo.
- [ ] **13 — Token economy:** orientar roteamento de modelo por complexidade, cache, escopo de subagentes, limites de saída e proteção contra perda de contexto.

Para cada guia, manter a mesma estrutura editorial: propósito, quando aplicar, regras, procedimento, checklist, anti-padrões, evidências e referências externas. Não transformar sugestões contextuais em regras universais.

## 4. Compatibilidade com agentes e harnesses

A matriz atual reconhece OpenCode como o único harness testado de ponta a ponta e os demais como não verificados. Preservar essa honestidade.

- [ ] Criar uma matriz de testes por harness, versão, sistema operacional, modo de instalação e resultado.
- [ ] Validar separadamente descoberta da skill, leitura do router, carregamento de referências, execução de uma tarefa e respeito às regras do projeto.
- [ ] Testar OpenCode, Claude Code, Codex CLI, Cursor e Gemini CLI em versões identificadas.
- [ ] Documentar diferenças entre formato Agent Skills nativo, regras de projeto e simples inclusão de arquivo no contexto.
- [ ] Não classificar uma integração como compatível apenas porque aceita Markdown.
- [x] Publicar um roteiro de teste reproduzível e um formulário simples para relatos da comunidade.
- [x] Incluir evidências mínimas: versão, SO, caminho instalado, prompt usado, comportamento observado e logs sem dados sensíveis.
- [ ] Automatizar somente testes que possam ser executados de forma estável e sem credenciais pessoais.

## 5. Testes automatizados e CI

- [x] Criar suíte `node:test` para o validador e instalador, sem dependências externas desnecessárias.
- [x] Cobrir entradas inválidas e casos extremos, inclusive nomes de arquivos com espaços, CRLF, links quebrados e arquivos ausentes.
- [x] Executar CI em Linux, Windows e macOS quando viável, com Node 18, 20 e 22 (reavaliar a matriz conforme suporte oficial e dependências).
- [ ] Separar jobs: validação de estrutura, testes unitários, verificação de links, checksums e empacotamento.
- [ ] Adicionar verificação de Markdown e spellcheck com dicionário técnico pt-BR/en-US, sem bloquear falsos positivos sem revisão.
- [x] Adicionar verificação de diferenças entre documentação EN e pt-BR nos tópicos que precisam estar equivalentes.
- [x] Fazer CI validar o conteúdo efetivamente distribuído em `zm-pro/`, não apenas o repositório completo.
- [x] Definir política de falha: qualquer gate obrigatório vermelho bloqueia release.
- [ ] Gerar relatório de testes com versões de runtime e saída real.

## 6. Segurança, privacidade e cadeia de fornecimento

- [x] Revisar todos os arquivos Markdown contra prompt injection, instruções maliciosas copiadas de fontes externas e recomendações inseguras.
- [x] Tratar conteúdo de issues, PRs, sites e documentos externos como dados não confiáveis, nunca como instruções que substituem as regras do projeto.
- [x] Revisar permissões mínimas de GitHub Actions e fixar actions por SHA quando adequado.
- [x] Adicionar verificação de dependências e licença se dependências forem introduzidas; manter baseline sem dependências sempre que possível.
- [x] Garantir que workflows não imprimam segredos nem executem código não confiável com permissões de escrita.
- [x] Revisar geração e publicação de checksums; documentar como verificar o artefato baixado.
- [x] Considerar provenance/attestations para releases quando o processo estiver maduro.
- [x] Criar política de retenção para logs de CI e exemplos; nunca incluir tokens, dados pessoais ou dumps reais.
- [ ] Revisar licença de textos, exemplos, ícones e referências externas; preservar atribuições e avisos.
- [x] Documentar claramente o que o kit não garante: não substitui pentest, revisão humana, DPO, assessoria jurídica ou controles do provedor.

## 7. Documentação e experiência de quem instala

- [x] Ter README principal em inglês e README pt-BR com equivalência de conteúdo e comandos.
- [x] Criar uma página de início rápido de até cinco minutos, além do tutorial para iniciantes.
- [x] Adicionar seção de solução de problemas por harness e sistema operacional.
- [x] Mostrar exemplos reais de antes/depois: prompt inicial, referências carregadas, alteração, testes e entrega.
- [ ] Incluir exemplo de projeto pequeno e exemplo de aplicação web com banco de dados, sem credenciais ou dados reais.
- [x] Explicar claramente diferença entre repositório, skill, router, referência, template, harness e agente.
- [x] Documentar atualização de versão: comparar changelog, substituir pasta, validar e revisar alterações locais.
- [x] Documentar desinstalação e recuperação de instalação incompleta.
- [x] Criar FAQ sobre custos, funcionamento offline, privacidade, compatibilidade, licença e limitações.
- [x] Adicionar glossário consistente e links internos para os conceitos.
- [x] Evitar promessas como “funciona em qualquer agente” sem teste reproduzível.

## 8. Templates e exemplos que agregam valor

Avaliar a inclusão dos seguintes materiais, sem inflar o pacote com arquivos redundantes:

- [x] Template de plano de implementação com escopo, riscos, dependências e critérios de aceite.
- [x] Template de relatório de auditoria técnica com severidade, evidência, impacto e recomendação.
- [x] Template de threat model simplificado.
- [x] Template de plano de testes baseado em risco.
- [x] Template de runbook e checklist de incidente.
- [x] Template de release notes e plano de rollback.
- [x] Template de revisão de acessibilidade.
- [x] Template de inventário de integrações e fornecedores.
- [x] Exemplo de feature ponta a ponta, incluindo teste, documentação, changelog e evidência.
- [x] Exemplo de correção de bug com reprodução, teste de regressão e validação.
- [x] Exemplo de revisão de segurança sem expor vulnerabilidades reais ou segredos.

Cada template deve ser genérico, curto, copiável e acompanhado de orientação sobre quando usar. Não editar os templates originais a partir de projetos consumidores.

## 9. Distribuição, releases e adoção

- [x] Definir o canal oficial de distribuição: GitHub Release, instalação por cópia e, se fizer sentido, catálogo Agent Skills.
- [x] Documentar o que é publicado em cada release e manter os artefatos reproduzíveis.
- [x] Conferir se `package.json` com `private: true` é intencional; não publicar no npm sem decisão explícita e plano de pacote.
- [x] Padronizar tags SemVer, changelog, checksums e notas de release.
- [x] Validar os arquivos incluídos no pacote para não distribuir arquivos de desenvolvimento desnecessários.
- [ ] Manter PRs de catálogos comunitários atualizados e registrar status real (aberto, aprovado, mesclado ou fechado).
- [x] Criar guia de contribuição em pt-BR ou versão resumida equivalente.
- [x] Definir processo de triagem de issues e discussões, com labels e modelos claros.
- [x] Criar política de suporte e compatibilidade que não prometa manutenção de versões antigas indefinidamente.
- [ ] Medir adoção com sinais públicos e voluntários (estrelas, forks, relatos, PRs); não adicionar telemetria à skill.

## 10. Organização sugerida do repositório

Manter a estrutura atual como base e adicionar somente o necessário:

```text
/
├── README.md
├── README.pt-BR.md
├── CHANGELOG.md
├── SECURITY.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
├── MELHORIAS.md
├── package.json
├── AGENTS.md
├── RULES.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
├── docs/
│   ├── harness-compatibility.md
│   ├── primeiro-dia.md
│   ├── para-leigos.md
│   ├── demo.md
│   └── roadmap.md
├── scripts/
│   ├── validate.mjs
│   ├── install.mjs
│   └── checksums.mjs
├── tests/
│   ├── validate.test.mjs
│   └── install.test.mjs
├── examples/
│   ├── minimal-project/
│   └── web-app/
└── zm-pro/
    ├── SKILL.md
    ├── LICENSE
    ├── reference/
    └── templates/
```

A estrutura é uma proposta, não uma exigência para criar todos os diretórios imediatamente. Evitar duplicar documentação e manter uma fonte de verdade para cada regra.

## 11. Roadmap recomendado por fases

### Fase 1 — Correções de confiança (prioridade máxima)

- [x] Corrigir badges e política de versões suportadas.
- [x] Corrigir comandos de instalação nos READMEs.
- [x] Ajustar nomes e escopo dos comandos de teste.
- [x] Revisar instalador e validador para casos extremos.
- [ ] Executar validação local e CI; registrar evidências. *(Local: verde. CI: roda no PR.)*

**Critério de conclusão:** comandos documentados funcionam como escritos; versão consistente em todos os pontos; testes automatizados passam.

### Fase 2 — Qualidade técnica

- [x] Criar testes unitários do validador e instalador.
- [x] Fortalecer verificação de links, frontmatter e estrutura.
- [ ] Revisar os 13 guias em busca de conflito, ambiguidade e lacunas.
- [x] Padronizar templates e critérios de entrega.
- [x] Revisar workflows e permissões.

**Critério de conclusão:** suíte automatizada cobre caminhos críticos; guias possuem revisão registrada; CI bloqueia regressões conhecidas.

### Fase 3 — Compatibilidade comprovada

- [ ] Executar matriz de testes nos harnesses prioritários.
- [x] Publicar resultados reproduzíveis.
- [x] Ajustar instruções específicas de instalação e descoberta.
- [ ] Adicionar relatos da comunidade com evidências.

**Critério de conclusão:** cada status da matriz corresponde a um teste documentado ou permanece explicitamente como não verificado.

### Fase 4 — Experiência e adoção

- [x] Melhorar onboarding e troubleshooting.
- [x] Criar exemplos completos e reutilizáveis.
- [x] Completar templates de auditoria, testes e operação.
- [x] Melhorar contribuição, triagem e releases.
- [x] Revisar documentação EN/PT-BR.

**Critério de conclusão:** uma pessoa nova consegue instalar, executar uma tarefa pequena, validar e remover a skill seguindo apenas a documentação.

### Fase 5 — Maturidade contínua

- [x] Revisar trimestralmente referências externas e orientações legais.
- [x] Reavaliar versões de Node e harnesses suportados.
- [ ] Revisar issues recorrentes e incorporar melhorias com evidência.
- [x] Publicar notas de compatibilidade e limitações a cada release relevante.
- [x] Manter roadmap enxuto, sem promessas de datas não confirmadas.

## 12. Critérios permanentes de qualidade

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

## 13. Princípios que não devem ser sacrificados

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

---

**Nota de manutenção:** este arquivo é um backlog estratégico, não uma declaração de defeitos confirmados em todos os componentes. Antes de implementar cada item, reproduzir o comportamento, confirmar se o problema ainda existe na branch alvo e atualizar este documento com status, evidência e commit/release correspondente.

## 14. Avaliação comportamental da skill

Validar Markdown e instalação não prova que um agente entendeu o router, escolheu as referências corretas ou entregou engenharia melhor. O diferencial do zm-pro precisa ser demonstrado por resultados observáveis.

- [x] Criar uma suíte versionada de tarefas de avaliação, com cenários pequenos, médios e complexos.
- [x] Incluir manutenção de legado, bug, feature, refatoração, migração de banco, autenticação, upload, dados pessoais, incidente e deploy.
- [x] Definir para cada caso contexto inicial, objetivo, restrições, arquivos relevantes, resultado esperado, critérios de aceite e falhas críticas.
- [ ] Avaliar se o agente identifica o ambiente, inspeciona o projeto, respeita instruções locais e evita assumir stack ou ferramentas inexistentes.
- [ ] Avaliar seleção correta e mínima das referências, sem carregar todos os guias indiscriminadamente.
- [x] Testar cenários positivos e negativos: uma referência, várias referências, nenhuma referência e instruções conflitantes.
- [ ] Medir sucesso, regressões, violações de restrições, contexto irrelevante, comandos inventados, alterações fora do escopo e qualidade da evidência final.
- [ ] Comparar tarefas equivalentes com e sem zm-pro, mantendo modelo, harness, contexto, orçamento e critérios.
- [ ] Repetir cenários quando houver variabilidade; reportar mediana, dispersão e falhas graves, não somente a melhor execução.
- [x] Versionar prompts e fixtures sintéticos; remover segredos, dados pessoais e código proprietário.
- [x] Definir avaliações mínimas obrigatórias antes de releases relevantes.
- [x] Registrar que os resultados dependem de modelo, versão, harness, ferramentas, contexto e configuração.

**Critério de conclusão:** cada release relevante possui relatório reproduzível com casos, ambiente, resultados, falhas conhecidas e comparação com a versão anterior.

## 15. Protocolo operacional do agente

- [x] Definir ciclo padrão: entender pedido → inspecionar contexto → planejar proporcionalmente → executar → validar → revisar diff → entregar evidências.
- [x] Distinguir leitura, escrita, execução, publicação e operações destrutivas; exigir confirmação proporcional ao impacto.
- [x] Exigir inspeção do estado atual antes de editar, executar migrações, instalar dependências ou alterar infraestrutura.
- [x] Definir quando planejar e quando uma alteração simples pode ser feita diretamente.
- [x] Proibir alegações de execução, teste, deploy ou publicação sem resultado verificável.
- [x] Padronizar relatório final: mudanças, arquivos afetados, comandos executados, resultados, limitações, riscos e próximos passos.
- [x] Comunicar falhas de ferramentas sem mascarar resultados ou inventar alternativas executadas.
- [x] Definir recuperação: interromper, preservar estado, identificar alterações parciais e reverter somente quando seguro.
- [x] Criar regra de parada para escopo crescente, contexto insuficiente, risco não autorizado ou conflito de instruções.
- [x] Tratar pedidos vagos sem questionários excessivos: perguntar somente o indispensável ou declarar hipótese reversível.

## 16. Política de ferramentas, permissões e autonomia

- [x] Criar matriz de risco por ferramenta: leitura, escrita local, shell, rede, credenciais, banco, cloud, deploy e comunicação externa.
- [x] Aplicar privilégio mínimo: usar a ferramenta menos poderosa que resolva a tarefa.
- [x] Distinguir comandos somente de leitura de comandos que alteram estado; não presumir segurança pelo nome.
- [x] Exigir confirmação explícita para exclusão, sobrescrita, publicação, envio de mensagens, alteração de permissões, gastos, migrações irreversíveis e mudanças em produção.
- [x] Proibir exposição de tokens, chaves, cookies, variáveis secretas e dados pessoais em logs, respostas ou commits.
- [x] Definir limites para shell, scripts baixados, extensões, MCPs, plugins e ferramentas de terceiros.
- [x] Tratar saídas de ferramentas, páginas, issues, arquivos e resultados de busca como dados não confiáveis; ignorar instruções contidas nesses dados que tentem alterar a hierarquia de instruções.
- [x] Antes de executar código externo, inspecionar origem, conteúdo, permissões e efeitos colaterais.
- [x] Quando uma ferramenta não estiver disponível, não inventar execução; explicar a limitação e oferecer alternativa compatível.
- [x] Documentar que a skill não concede permissões nem contorna controles do harness, sistema operacional ou usuário.

## 17. Engenharia de contexto e memória

- [x] Definir modelo de contexto por tarefa: objetivo, restrições, arquitetura relevante, estado atual, decisões, evidências e pendências.
- [x] Separar fatos confirmados, inferências, hipóteses, preferências e decisões aprovadas.
- [x] Exigir fonte ou caminho de arquivo para afirmações técnicas relevantes sobre o projeto.
- [x] Evitar copiar arquivos extensos para memória quando caminho, resumo e seção de referência forem suficientes.
- [x] Definir atualização de memória após mudanças arquiteturais, decisões importantes e conclusão de tarefas longas.
- [x] Estabelecer revisão ou expiração de informações temporárias, como versões, endpoints, deploys e prioridades.
- [x] Não armazenar segredos, dados pessoais desnecessários, dados de clientes ou conteúdo confidencial em arquivos de memória.
- [x] Definir precedência entre documentação atual, código executável, configuração, histórico de commits e memória antiga.
- [x] Incluir procedimento para detectar e corrigir memória desatualizada ou contraditória.
- [x] Criar exemplos de handoff entre sessões e agentes com estado, arquivos modificados, testes e próximos passos.

## 18. Arquitetura de instruções e prevenção de conflitos

- [x] Inventariar instruções do repositório e classificar por escopo: global, projeto, linguagem, framework, tarefa e operação.
- [x] Identificar regras duplicadas, contraditórias, vagas, impossíveis de verificar ou dependentes de ferramenta específica.
- [x] Definir hierarquia explícita respeitando a hierarquia real do harness e as políticas superiores.
- [x] Não sugerir que arquivos do zm-pro podem sobrepor políticas do sistema, provedor ou controles do usuário.
- [x] Definir resolução de conflitos entre regra genérica e convenção existente no projeto consumidor.
- [ ] Criar testes com instruções maliciosas em README, comentários, logs, documentos e resultados externos.
- [x] Reduzir termos absolutos quando a regra depender do contexto; documentar exceções e condições.
- [x] Padronizar termos normativos MUST/DEVE, SHOULD/RECOMENDA-SE e MAY/PODE.
- [ ] Cada regra crítica deve ter justificativa, cenário de aplicação e método de verificação.

## 19. Cobertura de engenharia por domínio

Expandir a cobertura técnica com módulos opcionais, carregados sob demanda, evitando transformar o router em uma enciclopédia.

- [x] **APIs e integrações:** contratos, versionamento, idempotência, retries com backoff, timeouts, rate limits, paginação, webhooks e validação de payload.
- [x] **Banco de dados:** modelagem, índices, transações, concorrência, migrações compatíveis, rollback, backups e restauração.
- [x] **Frontend:** arquitetura de estado, hidratação, formulários, navegação, acessibilidade, segurança no cliente e performance percebida.
- [x] **Backend:** limites de domínio, filas, jobs, concorrência, cache, consistência, observabilidade e falhas.
- [x] **Mobile:** ciclo de vida, permissões, armazenamento seguro, conectividade intermitente, acessibilidade e publicação.
- [x] **Infraestrutura/cloud:** IaC, segregação de ambientes, IAM, redes, secrets, custos, escalabilidade e recuperação.
- [x] **IA e LLMs:** avaliação de prompts, grounding, alucinação, injeção de prompt, ferramentas, proteção de dados, custo, latência e fallback.
- [x] **Sistemas legados:** caracterização de comportamento, compatibilidade, migração incremental e reversão.
- [x] **Dados e analytics:** qualidade, linhagem, minimização, retenção, anonimização/pseudonimização e acesso.
- [x] **Documentação técnica:** diagramas, ADRs, contratos, exemplos atualizados e rastreabilidade.
- [x] Criar referência independente somente quando houver conteúdo suficiente, critérios de roteamento claros e manutenção viável.

## 20. Acessibilidade, internacionalização e experiência inclusiva

- [x] Adotar WCAG 2.2 AA como referência para produtos web quando aplicável, sem declarar conformidade sem auditoria.
- [x] Incluir teclado, foco visível, semântica, nomes acessíveis, contraste, zoom, redução de movimento e erros compreensíveis.
- [x] Incluir testes com leitor de tela e ferramentas automatizadas, reconhecendo que automação não substitui avaliação manual.
- [x] Tratar idioma, fuso horário, moeda, formatos de data/número, pluralização e RTL quando aplicável.
- [x] Não assumir idioma, país, legislação ou convenções regionais por sinais indiretos.
- [x] Incluir linguagem simples e testes de layout com textos longos e traduções.

## 21. Governança, contribuição e manutenção sustentável

- [x] Criar CONTRIBUTING.md com ambiente local, padrão de contribuição, validações, commits e revisão.
- [x] Criar modelos de issue para bug, proposta de guia, incompatibilidade e vulnerabilidade, sem solicitar dados sensíveis.
- [x] Criar template de PR com motivação, escopo, arquivos, testes, impacto, documentação e checklist de segurança.
- [x] Definir responsáveis por aprovar mudanças em segurança, privacidade, instalador, release e conteúdo.
- [x] Criar política de depreciação de referências, templates, comandos e harnesses.
- [x] Exigir justificativa para adicionar dependências, ferramentas ou novas referências.
- [x] Definir versões suportadas, janela de correção, fim de suporte e canal de reporte.
- [x] Criar processo para revisar contribuições automatizadas e conteúdo gerado por IA.
- [x] Registrar decisões arquiteturais em ADRs curtos, com contexto, alternativas e consequências.
- [ ] Manter histórico de mudanças incompatíveis e instruções de migração.
- [x] Definir calendário de manutenção leve e baseado em risco.

## 22. Métricas de qualidade e maturidade

Evitar métricas de vaidade. Medir qualidade, confiabilidade e custo com definições claras.

- [x] Taxa de sucesso da suíte de avaliação por categoria e severidade.
- [x] Taxa de seleção correta de referências e proporção de contexto irrelevante.
- [x] Taxa de violações de restrições e ações destrutivas sem autorização.
- [x] Taxa de comandos documentados que funcionam em ambiente limpo.
- [x] Cobertura dos caminhos críticos do instalador e validador.
- [x] Número e severidade de contradições abertas entre guias.
- [x] Tempo de onboarding até concluir primeira tarefa validada.
- [x] Compatibilidade verificada por harness/versão/SO, com data da execução.
- [x] Regressões por release e tempo de correção.
- [x] Custo e latência das avaliações, quando mensuráveis sem coletar dados de usuários.
- [x] Definir baseline, método, periodicidade e responsável por métrica.
- [x] Não coletar telemetria oculta; usar avaliações locais, CI e relatos voluntários.

## 23. Critérios de maturidade do projeto

| Nível | Definição | Evidência mínima |
|---|---|---|
| 1 — Estruturado | Arquivos e documentação organizados | Router, referências, licença e instruções coerentes |
| 2 — Validado | Instalação e estrutura verificadas | Testes do instalador/validador e comandos reproduzíveis |
| 3 — Avaliado | Comportamento do agente medido | Suíte de tarefas, critérios e relatório |
| 4 — Compatível | Harnesses testados de ponta a ponta | Matriz com versões, SO, evidências e limitações |
| 5 — Sustentável | Governança e manutenção contínuas | Suporte, releases, segurança e contribuição |

- [x] Definir nível atual somente após executar as evidências correspondentes.
- [x] Não avançar de nível com base apenas em documentação escrita.
- [x] Reavaliar a maturidade a cada release principal ou mudança estrutural.

## 24. Novos artefatos recomendados

Criar gradualmente, quando houver conteúdo e manutenção definidos:

- [ ] EVALUATIONS.md: metodologia, cenários e critérios da suíte de avaliação.
- [x] docs/evaluation-results/: relatórios versionados por release e ambiente.
- [x] docs/harness-compatibility.md: matriz real de compatibilidade.
- [x] docs/architecture.md: arquitetura do kit, fluxo do router e carregamento progressivo.
- [x] docs/instruction-hierarchy.md: hierarquia, escopo e resolução de conflitos.
- [x] docs/tool-safety.md: matriz de permissões e ações que exigem confirmação.
- [x] docs/maintenance-policy.md: suporte, depreciação e ciclo de revisão.
- [x] docs/decisions/: ADRs para decisões estruturais.
- [ ] tests/fixtures/: projetos sintéticos e cenários adversariais.
- [ ] tests/evaluations/: tarefas e critérios automatizáveis.
- [x] Templates de ADR, threat model, relatório de incidente e relatório de avaliação.
- [ ] CONTRIBUTING.md, CODE_OF_CONDUCT.md e modelos de issue/PR, se ainda estiverem ausentes ou incompletos.

## 25. Ordem de execução ampliada

1. Corrigir inconsistências P0 e validar instalador/validador.
2. Criar testes automatizados reais e cobertura dos casos críticos.
3. Revisar router e os 13 guias para remover conflitos e lacunas.
4. Construir suíte de avaliação comportamental com tarefas sintéticas.
5. Definir protocolo operacional, permissões e hierarquia de instruções.
6. Executar testes de compatibilidade reais nos harnesses prioritários.
7. Criar referências de domínio somente com demanda e roteamento claros.
8. Melhorar onboarding, troubleshooting, templates e exemplos ponta a ponta.
9. Formalizar governança, suporte, depreciação e releases.
10. Publicar relatório de maturidade baseado em evidências.

**Regra de priorização:** reduzir risco de comportamento incorreto, perda de dados, exposição de informações ou falsa alegação de compatibilidade tem prioridade sobre simplesmente adicionar guias ou aumentar o tamanho do repositório.


## 26. Perfis de uso e configuração

O zm-pro deve funcionar bem em projetos diferentes sem impor o mesmo nível de rigor, cerimônia ou custo a todos eles.

- [x] Definir perfis configuráveis, por exemplo: essencial, profissional, crítico e auditoria.
- [x] Explicar o que muda em cada perfil: profundidade de planejamento, cobertura de testes, revisão de segurança, documentação e evidências.
- [x] Permitir que o projeto consumidor declare requisitos próprios em um arquivo de configuração simples, sem exigir um formato proprietário complexo.
- [x] Definir precedência entre configuração do projeto, preferências da tarefa e recomendações genéricas, respeitando as instruções superiores.
- [x] Oferecer configuração gradual: começar com defaults seguros e permitir personalização explícita.
- [x] Evitar que o perfil essencial desative proteções fundamentais de segurança, privacidade ou autorização.
- [x] Criar exemplos de configuração para projeto pessoal, SaaS, biblioteca open source e sistema crítico.

## 27. Adaptadores de stack sem acoplamento excessivo

- [x] Criar guias opcionais por ecossistema somente quando houver procedimentos concretos: JavaScript/TypeScript, Python, Java, .NET, PHP, Go, Rust e mobile.
- [x] Em cada adaptador, orientar o agente a detectar versões e ferramentas existentes antes de recomendar instalação ou migração.
- [x] Cobrir gerenciadores de pacote, scripts, lint, formatadores, testes, build e comandos de desenvolvimento sem presumir um padrão universal.
- [x] Incluir orientação específica para monorepos, workspaces, pacotes compartilhados e dependências internas.
- [x] Documentar integração com bancos, provedores cloud e frameworks sem favorecer fornecedor sem justificativa.
- [x] Manter os guias de stack independentes do núcleo; não carregar todos em tarefas que não precisam deles.
- [ ] Definir um modelo editorial comum e testes para exemplos de comandos de cada adaptador.

## 28. Modos de trabalho especializados

- [x] **Modo descoberta:** mapear o projeto, tecnologias, arquitetura, comandos, riscos e lacunas sem editar arquivos.
- [x] **Modo implementação:** executar uma tarefa delimitada, com validação e revisão do diff.
- [x] **Modo auditoria:** identificar problemas e apresentar evidências sem corrigir automaticamente.
- [x] **Modo correção:** resolver achados aprovados, um grupo de risco por vez, com testes de regressão.
- [x] **Modo modernização:** planejar atualizações e migrações em etapas, com compatibilidade e rollback.
- [x] **Modo incidente:** priorizar contenção, preservação de evidências, restauração e comunicação segura.
- [x] **Modo revisão de PR:** avaliar correção, segurança, testes, manutenção e impacto, sem aprovar automaticamente.
- [x] Definir entradas, limites, entregáveis e condições de parada de cada modo.
- [x] Não permitir que um modo seja confundido com uma autorização para executar ações externas ou destrutivas.

## 29. Auditoria de qualidade do próprio zm-pro

- [x] Criar um comando de auditoria que verifique estrutura, metadados, links, referências, templates, versões e consistência documental.
- [x] Produzir saída legível por humanos e, opcionalmente, JSON estável para integração com outras ferramentas.
- [x] Atribuir severidade, arquivo, linha ou seção, evidência, explicação e correção sugerida a cada achado.
- [x] Diferenciar erro bloqueador, aviso e sugestão; permitir configuração de regras sem esconder falhas críticas.
- [x] Garantir que a auditoria seja somente leitura por padrão.
- [x] Oferecer modo de correção automática apenas para mudanças mecânicas, com preview/diff e consentimento explícito.
- [x] Testar o auditor contra fixtures válidas, inválidas, incompletas e adversariais.
- [x] Garantir saída determinística para as mesmas entradas e versão.

## 30. Migração, atualização e compatibilidade entre versões

- [x] Criar guia de migração entre versões, incluindo mudanças incompatíveis, regras removidas e substituições.
- [x] Definir política SemVer adequada ao produto distribuído e explicar o que constitui breaking change em uma skill.
- [x] Fazer o instalador identificar a versão existente e apresentar o que será alterado antes de atualizar.
- [x] Preservar arquivos locais do usuário e nunca sobrescrever customizações silenciosamente.
- [x] Oferecer backup ou cópia de segurança antes de atualização destrutiva, com instruções de restauração.
- [ ] Testar upgrade de cada versão suportada para a versão atual e instalação limpa.
- [x] Definir comportamento para downgrade e explicar quando ele não for seguro.
- [x] Manter changelog com instruções acionáveis, não apenas títulos de alterações.

## 31. Robustez, recuperação e execução em ambientes restritos

- [ ] Testar caminhos com espaços, caracteres Unicode, links simbólicos, permissões limitadas e diretórios protegidos. *(espaços, Unicode, symlinks e destino inválido cobertos por `tests/install.test.mjs`; permissões limitadas não testadas — o Windows ignora o atributo read-only em pastas)*
- [x] Testar execução sem internet e documentar quais recursos funcionam offline.
- [x] Testar proxy, certificados corporativos e ambientes sem acesso a registries, quando houver dependências externas.
- [x] Garantir que falhas no meio da instalação não deixem uma cópia parcialmente válida apresentada como concluída.
- [x] Tornar operações repetíveis (*idempotentes*) sempre que possível.
- [x] Definir tratamento seguro para interrupção do processo e arquivos temporários.
- [x] Não seguir links simbólicos para fora do destino autorizado sem necessidade e validação explícita.
- [x] Documentar requisitos mínimos de Node, permissões e sistemas suportados com evidência de teste.

## 32. Segurança avançada para aplicações com IA

- [x] Incluir threat model para aplicações com LLM, RAG, agentes, ferramentas e memória persistente.
- [x] Cobrir prompt injection direta e indireta, exfiltração de contexto, abuso de ferramentas, escalada de privilégio e envenenamento de memória.
- [x] Orientar isolamento entre conteúdo confiável, instruções e dados externos recuperados.
- [x] Definir validação de argumentos de ferramentas, allowlists, limites de execução e autorização no servidor.
- [x] Cobrir vazamento entre tenants, autorização por documento, filtragem de retrieval e segregação de índices vetoriais.
- [x] Incluir controles de orçamento, rate limit, timeout, limites de tokens e proteção contra loops de agente.
- [x] Avaliar saídas estruturadas e chamadas de ferramentas como entradas não confiáveis até serem validadas.
- [x] Cobrir revisão humana para decisões de alto impacto e ações irreversíveis.
- [x] Incluir testes adversariais com payloads sintéticos e critérios objetivos de aprovação.
- [x] Evitar afirmar que filtros de prompt, isoladamente, tornam um sistema seguro.

## 33. Qualidade dos exemplos e documentação executável

- [x] Garantir que exemplos de código sejam completos o suficiente para executar ou sejam claramente identificados como pseudocódigo.
- [x] Informar versões, pré-requisitos, comandos, resultado esperado e limitações em cada exemplo executável.
- [x] Executar exemplos automaticamente quando viável e detectar snippets desatualizados.
- [x] Usar somente dados fictícios, credenciais de exemplo inválidas e serviços locais/simulados.
- [x] Evitar comandos destrutivos em exemplos; quando inevitáveis, explicar impacto e ambiente seguro.
- [x] Manter exemplos pequenos e independentes, evitando projetos demonstrativos gigantes difíceis de atualizar.
- [ ] Incluir exemplo de aplicação completa e exemplo de repositório legado para demonstrar descoberta e adaptação.
- [x] Criar glossário de termos e convenções consistentes entre português e inglês.

## 34. Estratégia de adoção e experiência do desenvolvedor

- [x] Criar uma demonstração guiada que mostre a skill identificando contexto, escolhendo referências e validando uma pequena mudança.
- [x] Oferecer um diagnóstico inicial do projeto consumidor com achados priorizados, sem editar nada automaticamente.
- [x] Criar um caminho rápido para usuários experientes e um caminho didático para iniciantes.
- [x] Documentar claramente o que o zm-pro faz, o que não faz e o que depende do harness ou das ferramentas conectadas.
- [x] Criar exemplos de prompts de uso como ponto de partida, sem exigir frases mágicas.
- [ ] Medir sucesso do onboarding por tarefa concluída e validada, não por quantidade de páginas lidas.
- [x] Manter documentação acessível no próprio repositório; um site separado só deve existir se houver benefício claro e manutenção possível.

## 35. Regras para impedir expansão sem controle

- [x] Antes de criar um novo guia, demonstrar que o conteúdo não cabe de forma mais clara em uma referência existente.
- [x] Cada guia novo deve ter gatilho de roteamento, responsável pela manutenção, critérios de qualidade e ao menos um cenário de avaliação.
- [x] Remover conteúdo duplicado e obsoleto em vez de apenas acrescentar novas seções.
- [x] Revisar o custo de contexto de cada referência: tamanho, frequência de carregamento e benefício real.
- [x] Manter o núcleo pequeno e estável; funcionalidades experimentais devem ficar isoladas até serem avaliadas.
- [x] Marcar recomendações dependentes de stack, fornecedor ou legislação com escopo e data de revisão.
- [x] Não adicionar dependências, telemetria, serviços pagos ou integrações que criem custo ou coleta de dados sem decisão explícita.
- [x] Exigir uma justificativa de valor, risco e manutenção para toda expansão relevante.

## 36. Critérios de aceite para considerar o zm-pro completo

O projeto não deve ser considerado completo por quantidade de arquivos ou número de guias. A conclusão deve depender de evidências.

- [x] Instalação limpa, atualização e remoção testadas sem sobrescrita silenciosa.
- [x] Validador e auditoria com testes automatizados cobrindo os caminhos críticos.
- [ ] Router conciso, com roteamento correto e carregamento progressivo demonstrados em avaliações.
- [x] Guias revisados quanto a contradições, escopo, segurança e precisão técnica.
- [ ] Suíte comportamental com baseline e relatório reproduzível.
- [x] Compatibilidade declarada somente para combinações efetivamente testadas.
- [x] Exemplos essenciais executados e atualizados.
- [x] Documentação de instalação, configuração, troubleshooting, migração e contribuição coerente com o código.
- [x] Política de segurança, privacidade, suporte e releases atualizada.
- [x] Processo de manutenção viável, com responsável e critérios de depreciação.
- [x] Nenhuma falha crítica conhecida sem plano de correção ou limitação claramente documentada.
- [x] Relatório de maturidade publicado com evidências, limitações e riscos remanescentes.

**Definição de completo:** o zm-pro será considerado pronto para uso profissional quando uma pessoa independente conseguir instalá-lo, configurá-lo, utilizá-lo em um projeto real, avaliar seus resultados, atualizá-lo e removê-lo com segurança, seguindo a documentação e sem depender de conhecimento informal do mantenedor.
