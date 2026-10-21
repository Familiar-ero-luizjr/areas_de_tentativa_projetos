# Advogado Já — Entrevista funcional V3

A entrevista agora segue a mesma hierarquia mental da Orquestração:

```text
Bloco
└── Fase
    └── filhos[] (subfase, grupo, tela...)
        └── Perguntas
```

A navegação principal é **somente por bloco**. Não existem abas concorrentes “por assunto”, “auditoria” e “orquestração”.

## Arquivos
- `index.html` — interface/motor.
- `entrevista.json` — fonte canônica de conteúdo e hierarquia.
- `AGENTS.md` — regras de manutenção.

## Perguntas
Perguntas continuam únicas e preservam seus IDs, respostas históricas, gestão e proveniência. A árvore de blocos/fases referencia as áreas canônicas, evitando duplicar a mesma pergunta em vários lugares.

Status de trabalho:
- **Pendente**
- **Revisar**
- **Resolvida**
- **Obsoleta**
- **Adiada**

Resposta histórica não é decisão resolvida.

## Opções
Perguntas novas ou reformuladas devem oferecer preferencialmente **4 ou 5 opções**, mais **Outro** com campo de texto livre. Isso reduz perguntas abertas e acelera a entrevista.

Perguntas legadas com menos alternativas permanecem preservadas até auditoria; não são completadas automaticamente com opções inventadas.

## Blocos iniciais
1. Governança do repositório
2. Regras de operação
3. Usuários, identidade e acesso
4. Normalização estrutural para três jornadas
5. Jornada Cliente
6. Jornada Advogado
7. Jornada Administrador
8. Consolidação transversal

Cada bloco contém fases; qualquer fase pode conter filhos recursivos. Isso permite, por exemplo, uma fase “Telas” conter cada tela como subfase, e cada tela conter suas próprias perguntas.

## Uso
Sirva a pasta por HTTP/GitHub Pages para que `index.html` carregue `entrevista.json`. A interface permite editar respostas/status e exportar o JSON completo. Publicação no GitHub continua sendo uma ação separada.
