# Advogado Já — Laboratório de Telas JSON V4

Laboratório independente para modelar, revisar e exportar telas do Advogado Já por meio de JSON, com artefato HTML autocontido e offline.

## Abrir

O ponto de entrada público é `index.html`. A partir da raiz do repositório:

```powershell
py -m http.server 8000
```

Abra `http://localhost:8000/Projeto_4/`. No GitHub Pages, o endereço será:

`https://familiar-ero-luizjr.github.io/areas_de_tentativa_projetos/Projeto_4/`

## Estrutura

- `index.html`: artefato publicado, autocontido e independente.
- `ADVOGADOJA_LABORATORIO_TELAS_JSON_V4.html` e variantes `V4.*`: versões autocontidas do laboratório.
- Os demais arquivos `.html` na raiz são visualizadores e catálogos independentes, mantidos como referências de trabalho.

O projeto passou a usar artefatos HTML autocontidos; não há mais uma fonte modular separada como parte desta versão.

Leia [`AGENTS.md`](./AGENTS.md) antes de alterar este projeto.
