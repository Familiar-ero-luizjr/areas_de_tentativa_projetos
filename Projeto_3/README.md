# Arquitetura de HTML Autocontido

Documento interativo de referência para estruturar aplicações HTML modulares que podem ser entregues como um único arquivo executável offline.

## Abrir

Abra `index.html` por um servidor estático. A partir da raiz do repositório:

```powershell
py -m http.server 8000
```

Em seguida, acesse `http://localhost:8000/Projeto_3/`.

No GitHub Pages, o endereço será:

`https://familiar-ero-luizjr.github.io/areas_de_tentativa_projetos/Projeto_3/`

## Conteúdo

- `index.html`: entrada pública do documento interativo.
- `PADRAO_ARQUITETURA_HTML_AUTOCONTIDO.html`: fonte original preservada.
- `padrao-html-autocontido-dados.json`: conteúdo estruturado usado como referência para evolução do padrão.

## Escopo

Este projeto não é uma aplicação de produção. Ele documenta uma arquitetura de referência. Consulte [`AGENTS.md`](./AGENTS.md) antes de alterá-lo.
