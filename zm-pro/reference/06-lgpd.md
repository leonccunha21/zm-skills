# 06 — LGPD (ponte para o LGPD Skills)

**O kit não reescreve as 19 skills de LGPD.** Elas existem, são MIT e já foram avaliadas: [goul4rt/lgpd-skills](https://github.com/goul4rt/lgpd-skills) — funciona em Claude Code, Codex, Gemini CLI, Cursor e OpenCode. Este documento ensina **quando e como usá-las**, e onde está a linha entre ajudar e mentir.

## Quando disparar

Sempre que a tarefa envolver **dado pessoal** — direto (nome, CPF, e-mail, telefone, endereço, foto) ou indireto (IP, dispositivo, geolocalização, identificador de conta):

- Cadastro/autenticação, perfil, contas a receber, OCR de documentos, agendamento com cadastro, histórico, logs, analytics, backups/exports, integração com terceiros (WhatsApp, pagamentos, e-mail transacional)
- Nova coleta, novo uso, novo compartilhamento ou nova retenção de dado pessoal
- Incidente, vazamento, pedido de titular (DSAR), revisão de política/ROPA/RIPD

## O que fazer

1. **Instalar no projeto** (uma vez): as 19 skills em `.agents/skills/lgpd-*` (licença preservada) — ou usar as já versionadas. Não cole o conteúdo delas em outros arquivos: versão desatualizada no papel vence a lei? Não — perde para ela.
2. **Invocar o maestro**: `lgpd-audit` (o comando central) distribui o trabalho entre 18 especialidades: mapa de dados (ROPA), base legal, consentimento, DSAR, retenção/eliminação, incidentes, fornecedores, transferência internacional, criptografia, anonimização, relatório de impacto (RIPD), ECA Digital para menores.
3. **Artefatos vão para `.lgpd/`** no projeto — **versionada de propósito** (o teste `artifacts.test.ts` barra segredo/PII). Saída **rascunho de engenharia**; nada ali é certificação.
4. **Privacidade por padrão no código**: minimização (coletar só o necessário), base legal explícita por finalidade, retenção com eliminação automática, criptografia em trânsito e repouso, pseudonimização em logs e fixtures (MSW/dados falsos — nunca dado real), acesso mínimo por papel.

## Limites (leia com atenção)

- **Rascunho ≠ conformidade.** Base legal, comunicação de incidente à ANPD, texto de política pública, avaliação de legítimo interesse e ECA Digital exigem **Encarregado (DPO)/jurídico**. O kit produz engenharia; a responsabilidade é humana e documentada.
- **Nunca** enviar dado real de cliente/paciente/titular para ferramenta externa (LLM, playground, pastebin, ticket). Dumps de produção ficam fora do Git e fora de qualquer skill.
- **Menores de idade (ECA Digital/LGPD art. 14)**: base legal = melhor interesse da criança/adolescente; consentimento específico e em destaque. Trate como bloqueante em produto com público misto.
- Artefato em `.lgpd/` precisa passar pelo teste anti-vazamento do projeto; `.rascunho.md`/`draft-*.md`/`.local.md` ficam fora do Git.
- Normas citadas pelas skills mudam; confira a versão (planalto.gov.br, ANPD) antes de decidir em caso real.

## Checklist mínimo de dados pessoais (por feature)

1. Que dado pessoal esta feature coleta, de quem, para quê? (ROPA atualizado)
2. Base legal? Consentimento necessário? Revogável como?
3. Minimização: dá para funcionar sem esse campo/coluna?
4. Quanto tempo fica; como é eliminado (tombstone/retenção)?
5. Sai do Brasil/do sistema? Fornecedores com contrato/cláusula LGPD?
6. Logs e erros anônimos? Fixtures sintéticas? Backup criptografado?
7. Direito do titular (acesso, correção, exclusão, portabilidade) executável?
