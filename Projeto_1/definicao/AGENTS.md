# AGENTS.md — Entrevista funcional por blocos

## Missão
Esta pasta é a entrevista funcional do Advogado Já. A interface deve reduzir esforço de decisão e seguir a mesma hierarquia da Orquestração.

## Fonte canônica
- `index.html`: motor visual autocontido.
- `entrevista.json`: conteúdo canônico.
- A navegação principal é **Bloco → Fase → filhos[] recursivos → Perguntas**.
- Perguntas continuam canônicas em `areas[].perguntas`; a árvore de `orquestracao.blocos` referencia áreas/perguntas e não duplica objetos.

## Regra de clareza
A tela principal deve responder somente: **em qual bloco estou, em qual fase estou, quais perguntas faltam resolver**.
Não criar navegações concorrentes por assunto/auditoria/orquestração. Informações técnicas e históricas ficam em detalhes expansíveis.

## Status de trabalho
Usar: `pendente`, `revisar`, `resolvida`, `obsoleta`, `adiada`.
`resolvida` é uma decisão explicitamente confirmada pelo operador. Resposta histórica nunca vira resolvida automaticamente.

## Regra obrigatória das opções
Perguntas decisórias **novas ou reformuladas** devem:
1. oferecer preferencialmente **4 ou 5 alternativas objetivas**;
2. manter alternativas semanticamente distintas;
3. evitar induzir uma resposta;
4. incluir sempre **Outro**, com campo livre;
5. permitir justificativa/observação quando útil.

Perguntas legadas com 2 ou 3 opções não são reescritas automaticamente. Devem ser auditadas; se continuarem válidas e precisarem de nuance, então são reformuladas segundo a regra acima.

## Hierarquia flexível
Fases podem conter `filhos[]` de profundidade variável. Um filho pode representar subfase, grupo, tela ou outro recorte operacional. Não fixar no motor quantos níveis existem.

## Preservação
IDs de perguntas e áreas são estáveis. Não apagar histórico, proveniência ou respostas legadas sem decisão explícita. A migração original trouxe 683 perguntas e 65 respostas históricas.

## Decisões estruturais atuais
- Estudante é plano/área do Cliente, não usuário independente.
- Escritório é subfluxo do Advogado.
- Administrador é papel interno de identidade existente.
Perguntas antigas que contradigam isso devem ser revisadas/obsoletadas, nunca silenciosamente convertidas.

## Persistência
Alterações no navegador são locais até exportar o JSON e publicar no repositório. Não adicionar tokens ou segredos.

## Critérios de aceitação
- JSON válido e IDs únicos.
- Todos os blocos/fases vêm do JSON.
- Progresso calculado por perguntas resolvidas.
- Interface mobile sem navegações concorrentes.
- Perguntas históricas claramente marcadas como Revisar.
- Novas perguntas respeitam 4–5 opções + Outro.
