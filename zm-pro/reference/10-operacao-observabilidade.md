# 10 — Operação e observabilidade

Depois do deploy, o software é um organismo vivo: ou você enxerga, ou é pego de surpresa. Custo-zero: use tiers gratuitos e OSS; pague só com decisão explícita.

## Os três sinais (mínimo viável)

1. **Logs estruturados** (JSON): `timestamp`, `level`, `request_id`, `user_id` (pseudonimizado), `account_id`, `action`, `result`. Nunca PII/segredo. Correlacione por `request_id` ponta a ponta (cliente → API → banco).
2. **Métricas**: taxa de erro, p95 de latência, throughput, jobs falhos, fila de sync. Se usar Neon/Postgres: conexões, slow queries. Dashboards só com o que alguém vai olhar.
3. **Alertas**: acionáveis e com dono. Erro > limiar, p95 alto, job parado, cert expirando, backup falhou. Alerta que dispara sem ação vira ruído e é silenciado — revisem juntos.

Padrões de referência: OpenTelemetry (traces/métricas/logs vendor-neutral), Sentry (erros; tier free), OpenStatus/Checkly (uptime/status público), Grafana+Loki self-host se for o caso. Instrumente primeiro os **fluxos que dão dinheiro**.

## Backup e continuidade

- Backup automático (DB + storage) criptografado; **restauração ensaiada** em calendário — backup nunca testado é hipótese.
- Retenção definida por tipo (diário 7d, semanal 4w, mensal 12m — ajuste ao negócio).
- Segundo ambiente para homologação; segundo PC/cliente para testar offline/sync quando for o caso.
- Runbook de desastre em 1 página: quem chama, o que restaura, ordem, RTO/RPO aceitáveis, como comunicar clientes.

## Runbook de incidente (1 página)

1. **Detectar** (alerta ou relatório) → 2. **Conter** (rollback, flag off, isolar instância, revogar segredo) → 3. **Comunicar** (dono do produto; se dado pessoal: jurídico/Encarregado → ANPD conforme gravidade) → 4. **Diagnosticar** (logs, métricas, reproduzir em homologação) → 5. **Corrigir** (fix ou rollback — produção estável primeiro) → 6. **Verificar** (smoke test pós-fix) → 7. **Pós-mortem blameless** em ≤ 3 dias úteis: linha do tempo, impacto, causa raiz, o que preveniu, o que falhou, ações com dono e prazo.

## Custo e capacidade

Revise mensalmente: consumo Neon/Firebase/Cloudflare vs. free tier, crescimento de storage de logs/backups, custo de e-mail transacional. Estoure o free tier → registrar decisão antes de upgradar. Fim do mês sem revisão = surpresa no cartão ou quota estourada em produção.

## Rotina mínima (checklist operacional)

- Semanal: dependências/auditoria (`npm audit`), backup verificado, alertas revisados, erros novos no Sentry triados
- Mensal: capacidade/custo, acesso dos colaboradores revisado (menor privilégio), restore testado, uptime do mês
- Release: smoke pós-deploy, monitoramento atento por N horas

## Quando dados pessoais entram em cena

Log de produção nunca contém dado pessoal em claro. Acesso a dados é auditado. Incidente com dado pessoal segue `06-lgpd.md` (Encarregado + comunicação) **antes** de qualquer decisão de produto.
