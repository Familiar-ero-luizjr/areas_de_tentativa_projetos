# Catálogo — fonte única de edição

- `telas/` contém **79 arquivos JSON** separados por área, seção e nome da tela.
- `componentes/` contém **9 arquivos JSON** reutilizáveis, separados por escopo e função.
- Não grave pacotes de tela, cópias do master ou grafo nesta pasta. A interface lê os arquivos `*.json` recursivamente; o arquivo canônico tem raiz de **uma tela ou um componente**, não a raiz `catalogo` do pacote de exportação.
- Para encontrar uma tela: procure pelos segmentos na árvore ou pesquise por `identidade.id` na interface. Por exemplo, `auth.sessao.entrar` encontra `telas/comum/auth/entrar.json`.
- A localização pode mudar sem alterar o ID. Edite `classificacao.localizacaoArvore` e salve pela interface: o servidor move o arquivo para a pasta correspondente sem gerar cópia. Não renomeie o ID para expressar nova posição editorial.
- Para conectar duas telas, faça a ação na tela de origem em `acoes.grupos` ou use a aba `Flow & referências`. Entradas nas telas de destino são calculadas.
