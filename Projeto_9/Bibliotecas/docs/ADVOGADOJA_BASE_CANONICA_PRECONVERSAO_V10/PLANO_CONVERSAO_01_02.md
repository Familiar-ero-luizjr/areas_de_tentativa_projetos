# Conversão das bibliotecas 01 e 02 — Plano auditável

## Fontes confirmadas
- `Bibliotecas_01_02_Headers_Menus_Canonicos_V3.zip` contém **81 HTMLs em `01/telas/`**, distribuídos em **23 pastas**, e **111 HTMLs em `02/telas/`**, cada um em sua pasta (111 pastas).
- A biblioteca `01` contém pastas com mais de um HTML. Portanto, **não** copiar quatro arquivos `index.html/style.css/motor.js/documento.json` diretamente para a pasta compartilhada, pois os nomes colidiriam. Preservar a árvore já existente e criar uma subpasta por HTML dentro de cada pasta que contém vários.
- Os 192 HTMLs são origens visuais; os respectivos inventários JSON e decisões de componentes são evidências auxiliares. Não presumir que todos representam 192 telas distintas sem auditoria semântica.

## Execução em etapas
1. **Inventário**: identificar arquivo de origem, pasta, tema visual, título real, eventos/atributos DOM, CSS, estados e referências de componentes, inclusive imagens e fontes.
2. **Relações**: mapear destinos explícitos, prováveis e ausentes, com classificação `observado`, `proposto` ou `pendente` no relatório externo de auditoria. Não criar `aliasMap` no documento final.
3. **Matriz por tela**: identidade estável, instâncias, árvore DOM/CSS, estados e seus alvos, interações locais, rotas com eventos/desvios e referências a jornadas.
4. **Reconstrução**: gerar apenas o contrato canônico em cada `documento.json`; `index.html`, `style.css`, `motor.js` são os mesmos shells conceituais usados na V10. O `motor.js` deve ser bit a bit igual nas 192 saídas.
5. **Componentização**: identificar componentes de reuso real, em especial headers/menus; não transformar conteúdo único em componente compartilhado artificial.
6. **Auditoria**: schema, IDs, refs, eventos, condições, destinos e árvore de subjornadas. Rotas de entrada são inferidas das saídas sem cadastros duplicados.
7. **Homologação visual**: capturas por estado/viewport dos arquivos originais e novos; diffs aprovados individualmente, com desvio documentado.

## Estrutura-alvo
```text
biblioteca/
├── 01/telas/<pasta-original>/<identificador-do-html>/
│   ├── index.html
│   ├── style.css
│   ├── motor.js
│   └── documento.json
├── 02/telas/<pastas-originais-da-tela>/
│   ├── index.html
│   ├── style.css
│   ├── motor.js
│   └── documento.json
├── componentes/catalogo.json
└── jornadas.json
```

A subpasta extra em `01` só é necessária quando uma pasta original contém múltiplos HTMLs. A hierarquia de `01` e `02` permanece intacta. A versão V10 é o protótipo do contrato/motor a ser homologado antes da execução integral.

## Bloqueios
- Não converter automaticamente elementos de menu em rotas caso alterem apenas o estado da tela.
- Não persistir `variantes`, `conexoes`, `condicoes`, `aliasMap` ou dados redundantes do motor antigo no JSON de tela.
- Não assumir que URLs do Flutter definem saídas da tela.
- Não declarar equivalência visual integral até comparar telas e estados.
