# 07 — Segurança pragmática

Não é pentest no fim, é disciplina em cada entrega. Referências: OWASP Cheat Sheet Series (CC-BY-SA, citar atribui), Gitleaks, security-audit-skill (Cloudflare), ZAP para varredura dinâmica quando disponível.

## Regra zero — segredos

- Segredo vive em variável de ambiente / cofre do host (nunca em código, commit, log ou screenshot). `.env*` no `.gitignore`.
- Scanner de segredos no CI (Gitleaks como referência; script próprio leve é legítimo). Varra histórico ao suspeitar de vazamento rotacionável.
- Vazou? Rotação imediata, log de incidente, análise de alcance. Esconder não resolve — rotacionar resolve.
- Tokens de serviço, chaves privadas, URLs com credencial embutida: mesma regra, sem exceção "temporária".

## OWASP essencial (curado para apps web com banco)

1. **Injeção** (SQL/NoSQL/comando/template): queries parametrizadas/ORM; nunca concatenação de string com input. Valide schema (zod) na fronteira.
2. **Controle de acesso / IDOR** (BOLA): autorização **server-side, por recurso**, em toda mutação/leitura — `WHERE account_id = ?` derivado da identidade autenticada, nunca do cliente. RLS no Postgres como segunda tranca. Fail-closed: dúvida = nega.
3. **Autenticação e sessão**: senha com hash forte (bcrypt/argon2), rate limit, expiração curta + refresh; revogação de sessão no logout/reset. Não role sua própria cripto — use bibliotecas maduras.
4. **SSRF/fetch de URL externa**: allowlist de hosts; nunca fetch de URL fornecida pelo usuário sem validação.
5. **Configuração insegura**: headers de segurança (CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS), CORS restritivo, sem `DEBUG` em produção, TLS em tudo.
6. **Dependências**: `npm audit` + scanner no gate quando tocar deps; lockfile commitado; dep abandonada (>12 meses sem release + vulnerabilidade) é dívida — agende troca.
7. **Logging sensível**: logs sem senha, token, cartão, cookie, documento pessoal. Log estruturado com request-id para rastrear.
8. **Upload**: tipo e tamanho validados por magic bytes, storage fora do web root, nome aleatório, sem execução.

## Autorização e dados

Multi-tenant sempre com `account_id` escopado no servidor; políticas de RLS testadas (tentar ler recurso de outra conta deve falhar — escreva esse teste). Soft-delete + auditoria (quem/quando/o quê) em mutações de negócio. Permissões por menor privilégio; papel de admin separado e auditado.

## Dados e backup

Backup automático criptografado **e restauração testada** — backup não ensaiado = backup inexistente. Segundo PC / segundo ambiente para homologação. Dados de produção nunca em máquina dev/teste.

## Resposta a incidente (resumo)

Detectar → conter (revogar, rotacionar, isolar) → avaliar alcance → comunicar conforme gravidade (titular/ANPD se dado pessoal) → corrigir causa raiz → pós-mortem sem culpa (ver `10-operacao-observabilidade.md`) → prevenir (gate novo, regra, alerta).

## Custo-zero

Firebase/Neon free tier, Cloudflare free, Sentry/OpenStatus free, ferramentas OSS (Gitleaks, ZAP, OWASP). Serviço pago só com decisão escrita do dono do projeto — e nunca sem estimar custo mensal.

## Checklist de segurança por PR

Input validado? Autorização por recurso testada? Segredo introduzido? (scan) · Header de segurança coberto? Dependência nova revisada? · Log com PII? Upload seguro? · Falha = nega? Comportamento sob `account_id` alheio coberto em teste?
