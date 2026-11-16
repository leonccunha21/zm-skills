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

- [ ] **Atualizar badges de versão nos READMEs.** Os arquivos `README.md` e `README.pt-BR.md` exibem badge estático 0.4.0, enquanto `package.json`, `zm-pro/SKILL.md` e o changelog indicam 0.8.1. Preferir badge dinâmico baseado na última release ou manter uma única fonte de versão.
- [ ] **Atualizar a política de segurança.** `SECURITY.md` declara suporte a 0.4.x, embora a versão atual indicada seja 0.8.1. Definir política de versões suportadas coerente com SemVer e releases reais.
- [ ] **Corrigir instrução de instalação npm.** O README sugere que `npm run install-skill` equivale à instalação OpenCode, mas o script exige um argumento de harness. O script npm atual não fornece esse argumento. Documentar o comando correto (`npm run install-skill -- opencode`, se validado) ou ajustar o script para fornecer um padrão explícito.
- [ ] **Alinhar documentação e comportamento do instalador.** Confirmar que os exemplos de instalação para OpenCode e Claude Code correspondem aos diretórios realmente usados pelo script e aos diretórios reconhecidos por cada versão do harness.
- [ ] **Distinguir testes de validação estrutural.** Atualmente `npm test` executa o validador do repositório; isso não equivale a uma suíte de testes unitários do instalador e do validador. Criar testes automatizados reais e deixar os nomes dos comandos inequívocos.

### P1 — Qualidade da validação e manutenção

- [ ] **Fortalecer o validador de Markdown.** Verificar links relativos, imagens, referências, âncoras internas e caminhos com espaços; ignorar blocos de código e diretórios que não fazem parte do conteúdo publicado, como `.git/` e `node_modules/`.
- [ ] **Validar frontmatter com regras explícitas.** Cobrir campos obrigatórios, descrição, delimitadores, caracteres especiais e limites do formato Agent Skills. Evitar depender de expressões regulares frágeis para interpretar YAML.
- [ ] **Validar cobertura do índice.** Garantir que todas as referências e templates publicados estejam indexados e que nenhum caminho apontado pelo router esteja ausente.
- [ ] **Validar sincronização de versões.** Conferir `package.json`, `SKILL.md`, badges, changelog, release e documentação de instalação.
- [ ] **Testar instalador sem sobrescrita acidental.** Cobrir harness inválido, diretório inexistente, destino já existente, `--force`, `--global`, `--dir`, caminhos com espaços e execução em Windows/Linux/macOS.
- [ ] **Garantir instalação reversível.** Confirmar que instalar e desinstalar não alteram arquivos fora do diretório de destino e não executam código ou chamadas de rede.
- [ ] **Revisar a opção `--dir`.** Documentar se ela representa a raiz do projeto ou o diretório final de instalação; testar caminhos absolutos e relativos.

## 3. Arquitetura e conteúdo da skill

### Router e carregamento progressivo

- [ ] Manter `zm-pro/SKILL.md` curto, orientado a decisão e sem duplicar o conteúdo dos guias.
- [ ] Criar uma tabela clara de gatilhos: tarefa → referências obrigatórias → entregável esperado.
- [ ] Definir combinações de trilhas para tarefas que atravessam áreas (por exemplo, feature com autenticação e dados pessoais).
- [ ] Incluir uma regra explícita para resolver conflito entre referências: regra do projeto primeiro; depois segurança e privacidade; por fim convenções gerais. Registrar a hierarquia sem criar contradições.
- [ ] Explicar o que fazer quando `AGENTS.md`, `RULES.md` ou comandos de projeto não existem.
- [ ] Definir limite de contexto: carregar primeiro o router, depois somente os trechos necessários das referências; evitar leitura integral desnecessária.

### Revisão dos 13 guias

- [ ] **01 — Code rules:** diferenciar regra obrigatória, recomendação e exceção; explicitar critérios de mudança mínima, regressão e definição de pronto.
- [ ] **02 — Project standards:** alinhar estrutura, documentação, versionamento, changelog, convenções de commit e templates.
- [ ] **03 — Layout UI:** cobrir responsividade, acessibilidade WCAG, teclado, leitores de tela, estados vazios/erro/carregamento, formulários, contraste e testes em viewport real.
- [ ] **04 — Multi-agent:** definir limites de delegação, propriedade de arquivos, prevenção de alterações concorrentes, validação do trabalho delegado e protocolo de parada.
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
- [ ] Publicar um roteiro de teste reproduzível e um formulário simples para relatos da comunidade.
- [ ] Incluir evidências mínimas: versão, SO, caminho instalado, prompt usado, comportamento observado e logs sem dados sensíveis.
- [ ] Automatizar somente testes que possam ser executados de forma estável e sem credenciais pessoais.

## 5. Testes automatizados e CI

- [ ] Criar suíte `node:test` para o validador e instalador, sem dependências externas desnecessárias.
- [ ] Cobrir entradas inválidas e casos extremos, inclusive nomes de arquivos com espaços, CRLF, links quebrados e arquivos ausentes.
- [ ] Executar CI em Linux, Windows e macOS quando viável, com Node 18, 20 e 22 (reavaliar a matriz conforme suporte oficial e dependências).
- [ ] Separar jobs: validação de estrutura, testes unitários, verificação de links, checksums e empacotamento.
- [ ] Adicionar verificação de Markdown e spellcheck com dicionário técnico pt-BR/en-US, sem bloquear falsos positivos sem revisão.
- [ ] Adicionar verificação de diferenças entre documentação EN e pt-BR nos tópicos que precisam estar equivalentes.
- [ ] Fazer CI validar o conteúdo efetivamente distribuído em `zm-pro/`, não apenas o repositório completo.
- [ ] Definir política de falha: qualquer gate obrigatório vermelho bloqueia release.
- [ ] Gerar relatório de testes com versões de runtime e saída real.

## 6. Segurança, privacidade e cadeia de fornecimento

- [ ] Revisar todos os arquivos Markdown contra prompt injection, instruções maliciosas copiadas de fontes externas e recomendações inseguras.
- [ ] Tratar conteúdo de issues, PRs, sites e documentos externos como dados não confiáveis, nunca como instruções que substituem as regras do projeto.
- [ ] Revisar permissões mínimas de GitHub Actions e fixar actions por SHA quando adequado.
- [ ] Adicionar verificação de dependências e licença se dependências forem introduzidas; manter baseline sem dependências sempre que possível.
- [ ] Garantir que workflows não imprimam segredos nem executem código não confiável com permissões de escrita.
- [ ] Revisar geração e publicação de checksums; documentar como verificar o artefato baixado.
- [ ] Considerar provenance/attestations para releases quando o processo estiver maduro.
- [ ] Criar política de retenção para logs de CI e exemplos; nunca incluir tokens, dados pessoais ou dumps reais.
- [ ] Revisar licença de textos, exemplos, ícones e referências externas; preservar atribuições e avisos.
- [ ] Documentar claramente o que o kit não garante: não substitui pentest, revisão humana, DPO, assessoria jurídica ou controles do provedor.

## 7. Documentação e experiência de quem instala

- [ ] Ter README principal em inglês e README pt-BR com equivalência de conteúdo e comandos.
- [ ] Criar uma página de início rápido de até cinco minutos, além do tutorial para iniciantes.
- [ ] Adicionar seção de solução de problemas por harness e sistema operacional.
- [ ] Mostrar exemplos reais de antes/depois: prompt inicial, referências carregadas, alteração, testes e entrega.
- [ ] Incluir exemplo de projeto pequeno e exemplo de aplicação web com banco de dados, sem credenciais ou dados reais.
- [ ] Explicar claramente diferença entre repositório, skill, router, referência, template, harness e agente.
- [ ] Documentar atualização de versão: comparar changelog, substituir pasta, validar e revisar alterações locais.
- [ ] Documentar desinstalação e recuperação de instalação incompleta.
- [ ] Criar FAQ sobre custos, funcionamento offline, privacidade, compatibilidade, licença e limitações.
- [ ] Adicionar glossário consistente e links internos para os conceitos.
- [ ] Evitar promessas como “funciona em qualquer agente” sem teste reproduzível.

## 8. Templates e exemplos que agregam valor

Avaliar a inclusão dos seguintes materiais, sem inflar o pacote com arquivos redundantes:

- [ ] Template de plano de implementação com escopo, riscos, dependências e critérios de aceite.
- [ ] Template de relatório de auditoria técnica com severidade, evidência, impacto e recomendação.
- [ ] Template de threat model simplificado.
- [ ] Template de plano de testes baseado em risco.
- [ ] Template de runbook e checklist de incidente.
- [ ] Template de release notes e plano de rollback.
- [ ] Template de revisão de acessibilidade.
- [ ] Template de inventário de integrações e fornecedores.
- [ ] Exemplo de feature ponta a ponta, incluindo teste, documentação, changelog e evidência.
- [ ] Exemplo de correção de bug com reprodução, teste de regressão e validação.
- [ ] Exemplo de revisão de segurança sem expor vulnerabilidades reais ou segredos.

Cada template deve ser genérico, curto, copiável e acompanhado de orientação sobre quando usar. Não editar os templates originais a partir de projetos consumidores.

## 9. Distribuição, releases e adoção

- [ ] Definir o canal oficial de distribuição: GitHub Release, instalação por cópia e, se fizer sentido, catálogo Agent Skills.
- [ ] Documentar o que é publicado em cada release e manter os artefatos reproduzíveis.
- [ ] Conferir se `package.json` com `private: true` é intencional; não publicar no npm sem decisão explícita e plano de pacote.
- [ ] Padronizar tags SemVer, changelog, checksums e notas de release.
- [ ] Validar os arquivos incluídos no pacote para não distribuir arquivos de desenvolvimento desnecessários.
- [ ] Manter PRs de catálogos comunitários atualizados e registrar status real (aberto, aprovado, mesclado ou fechado).
- [ ] Criar guia de contribuição em pt-BR ou versão resumida equivalente.
- [ ] Definir processo de triagem de issues e discussões, com labels e modelos claros.
- [ ] Criar política de suporte e compatibilidade que não prometa manutenção de versões antigas indefinidamente.
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

- [ ] Corrigir badges e política de versões suportadas.
- [ ] Corrigir comandos de instalação nos READMEs.
- [ ] Ajustar nomes e escopo dos comandos de teste.
- [ ] Revisar instalador e validador para casos extremos.
- [ ] Executar validação local e CI; registrar evidências.

**Critério de conclusão:** comandos documentados funcionam como escritos; versão consistente em todos os pontos; testes automatizados passam.

### Fase 2 — Qualidade técnica

- [ ] Criar testes unitários do validador e instalador.
- [ ] Fortalecer verificação de links, frontmatter e estrutura.
- [ ] Revisar os 13 guias em busca de conflito, ambiguidade e lacunas.
- [ ] Padronizar templates e critérios de entrega.
- [ ] Revisar workflows e permissões.

**Critério de conclusão:** suíte automatizada cobre caminhos críticos; guias possuem revisão registrada; CI bloqueia regressões conhecidas.

### Fase 3 — Compatibilidade comprovada

- [ ] Executar matriz de testes nos harnesses prioritários.
- [ ] Publicar resultados reproduzíveis.
- [ ] Ajustar instruções específicas de instalação e descoberta.
- [ ] Adicionar relatos da comunidade com evidências.

**Critério de conclusão:** cada status da matriz corresponde a um teste documentado ou permanece explicitamente como não verificado.

### Fase 4 — Experiência e adoção

- [ ] Melhorar onboarding e troubleshooting.
- [ ] Criar exemplos completos e reutilizáveis.
- [ ] Completar templates de auditoria, testes e operação.
- [ ] Melhorar contribuição, triagem e releases.
- [ ] Revisar documentação EN/PT-BR.

**Critério de conclusão:** uma pessoa nova consegue instalar, executar uma tarefa pequena, validar e remover a skill seguindo apenas a documentação.

### Fase 5 — Maturidade contínua

- [ ] Revisar trimestralmente referências externas e orientações legais.
- [ ] Reavaliar versões de Node e harnesses suportados.
- [ ] Revisar issues recorrentes e incorporar melhorias com evidência.
- [ ] Publicar notas de compatibilidade e limitações a cada release relevante.
- [ ] Manter roadmap enxuto, sem promessas de datas não confirmadas.

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
