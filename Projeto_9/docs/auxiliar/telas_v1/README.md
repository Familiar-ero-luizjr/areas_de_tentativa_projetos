# Telas — arquitetura orientada pelo Catálogo Mestre

Este pacote foi reduzido para uma única fonte estrutural: `catalogo/catalogo_master.json`.

## Raiz

```text
Telas/
├── assets/
├── components/
├── engine/
├── telas/
├── catalogo/
│   └── catalogo_master.json
├── index.html
└── README.md
```

## Responsabilidades

- `catalogo/catalogo_master.json`: fonte completa para composição das telas e projeções de Fluxo/Mapa.
- `telas/`: somente HTML/CSS específicos de cada tela.
- `components/`: somente HTML/CSS dos componentes compartilhados ou locais reutilizados pela composição.
- `engine/`: monta a tela usando o catálogo e as fontes visuais.
- `assets/`: arquivos estáticos externos.
- `index.html`: único ponto de entrada para catálogo e telas.

Não existem mais `data/`, `manifesto-telas.json`, `registry.json`, `screen.json`, `section.json` ou `component.json` físicos. O conteúdo desses arquivos foi consolidado no Catálogo Mestre.

## Como abrir

O pacote usa módulos ES e `fetch`, então não deve ser aberto por `file://`.

Em hospedagem estática (Netlify, por exemplo), abra somente `index.html`.

Localmente, na raiz do pacote:

```powershell
python -m http.server 8080
```

Depois abra `http://localhost:8080/`.

Uma tela individual usa o mesmo `index.html`, por exemplo:

```text
index.html?screen=cliente.home_cliente
```

## Validação

O botão **Validar todas** do índice verifica se cada composição do catálogo resolve seus componentes e templates físicos.

### Observação de asset

O ZIP de origem não contém o arquivo binário `assets/welcome_professionals.png`; contém apenas `welcome_professionals.png.SOURCE_PREVIEW.txt`. Isso não impede a montagem estrutural da tela, mas a imagem correspondente ficará ausente até o PNG real ser recolocado.
