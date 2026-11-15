# 02 — Padronização de projeto

Todo projeto profissional do time segue a mesma espinha dorsal. O que muda é o domínio; o esqueleto é este.

## Estrutura mínima do repositório

```
projeto/
├── README.md            # o quê, por quê, stack, comandos, env vars, como rodar
├── AGENTS.md            # protocolo para agentes (veja templates/)
├── RULES.md             # regras de arquitetura e segurança (veja templates/)
├── LICENSE              # sempre; sem licença = todos os direitos reservados por default
├── CHANGELOG.md         # Keep a Changelog + semver
├── docs/
│   ├── adr/             # decisões arquiteturais: NNNN-titulo.md
│   ├── COORDENACAO_AGENTES.md   # se houver sessões paralelas
│   └── referencias-github.md    # triagem adotado/observação/descartado (opcional)
├── melhorias            # registro de entregas: SHA, data, evidência (convenção do time)
└── PENDENCIAS_*.md      # o que depende de ambiente real, não de código
```

Pré-condições para o produto: 1 fonte de verdade por fato (o dado vive num lugar; o resto aponta para ele).

## Documentos — o que cada um responde

- **README**: um estranho roda o projeto em 15 minutos. O que é, stack real, `npm install`, variáveis necessárias (nomes, não valores), comandos de dev/build/test, e quem mantém.
- **AGENTS.md**: como o agente deve operar *neste* repo (protocolo de início, comandos reais, integridade). Ver `templates/AGENTS.md`.
- **RULES.md**: o que o agente **nunca** faz (arquitetura, segurança, dados, deploy). Ver `templates/RULES.md`. Skill e catálogo não sobrescrevem RULES.
- **ADR**: por que uma decisão foi tomada — contexto, opções, decisão, consequências. MADR-like, `docs/adr/NNNN-slug.md`. Decida de novo? Escreva outro ADR que o supersed; não reescreva o antigo.
- **melhorias / registro de entregas**: cada entrega com SHA, data, evidência, o que falta. É a memória institucional do projeto (ver `05-memoria.md`).

## Git, branches e commits

- `main` sempre implantável; branch por entrega: `feat/`, `fix/`, `chore/`, `docs/` + slug curto.
- Commits pequenos, por pathspec, mensagem no formato `tipo(escopo): resumo` (conventional commits): `feat(sync): tombstone em deleteMissing`.
- Nunca force-push em `main`; rebase local antes do PR é permitido na própria branch.
- Tag semântica `vX.Y.Z` no release; CHANGELOG atualizado no mesmo commit da tag.

## Versionamento (semver)

MAJOR quebra contrato · MINOR adiciona compatível · PATCH corrige. Contrato = API pública, schema de dados, CLI, formato de arquivo, comportamento de sync/licença. Dúvida → PATCH e registro no CHANGELOG.

## Definition of Done e checklists

`DEFINICAO-DE-PRONTO.md` define "quando está pronto" de uma vez por todas; `CHECKLIST-ENTREGA.md` é o formulário preenchido por entrega. Ambos vivem em `templates/`. PR sem os dois preenchidos não entra.

## Higiene de repositório

`.gitignore` cobre `.env*`, `*.pem`, `node_modules`, `dist*`, `coverage`, artefatos `.local.md`. Scanner de segredos no CI. Nada de arquivo gerado no histórico. `package.json` com `engines` e scripts canônicos (`dev`, `build`, `test`, `typecheck`, `lint`) — o agente descobre o projeto pelos scripts, não por adivinhação.
