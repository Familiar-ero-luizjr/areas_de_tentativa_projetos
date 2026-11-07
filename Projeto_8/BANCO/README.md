# AdvogadoJá — Banco V7 modular

Extraído de `ADVOGADOJA_BANCO_V6_AUTOCONTIDO.html` preservando interface, CSS e funções de projeção. A entrada única é `index.html`.

## Organização
- `index.html`: estrutura da interface, com referências aos arquivos externos.
- `visualizador/style.css`: CSS original.
- `visualizador/app.js`: JavaScript original do Banco, preservando projeção, diagrama, relacionamentos, exportação e menu.
- `conector/montador.js`: monta `window.__BANCO_CATALOGO__` lendo o manifesto e JSONs individuais antes de iniciar a interface.
- `dados/manifest.json`: índice canônico, com caminhos `telas/...` e `componentes/...`.
- `telas/`: registros JSON reais das telas.
- `componentes/`: registros JSON reais dos componentes.

## Catálogo vazio no arquivo de origem
O HTML V6 recebido continha `indice.telas = []`, `indice.componentes = []` e os respectivos mapas vazios. Portanto, este pacote também inicia **sem registros**. A ferramenta não pode inventar entidades, relacionamentos ou SQL. Não foram incluídas telas/componentes de outros projetos sem autorização.

## Para adicionar dados
Crie um arquivo em `telas/cliente/home.json` com `identidade.id` igual ao ID escolhido e, no manifesto, adicione em `indice.telas`:

```json
{"id":"cliente.home","arquivo":"telas/cliente/home.json"}
```

Registros de componentes seguem a mesma regra com arquivos em `componentes/` e entradas em `indice.componentes`. O Banco agrega `dados.persistencia` de cada tela, sem deduzir ausências.

## Execução
No diretório extraído rode `python -m http.server 8000` e acesse `http://localhost:8000/`. `file://` pode bloquear `fetch`.

## Compatibilidade
A lógica preexistente de rascunhos por `localStorage` foi mantida. O manifesto define os registros ativos; rascunhos locais podem sobrepor seus campos no navegador.
